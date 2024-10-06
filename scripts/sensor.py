import subprocess
import json
import re
import time
from collections import defaultdict
import requests
import platform
from pprint import pprint
import os

# Define your NVD API key here
API_KEY = 'b7803c2d-9a86-44b9-8c01-66074d62fbb4'
CACHE_FOLDER = "cache"
PROGRAMS_FILE = os.path.join(CACHE_FOLDER, "programs.json")
VULNERABILITIES_FOLDER = os.path.join(CACHE_FOLDER, "vulnerabilities")

# Create cache directory if it doesn't exist
os.makedirs(CACHE_FOLDER, exist_ok=True)
os.makedirs(VULNERABILITIES_FOLDER, exist_ok=True)

def get_installed_programs():
    """
    Extracts installed programs using PowerShell.
    """
    command = '''
    Get-WmiObject -Class Win32_Product | Select-Object -Property Name, Version | ConvertTo-Json
    '''
    try:
        output = subprocess.check_output(["powershell", "-Command", command], universal_newlines=True)
        installed_programs = json.loads(output)
        return installed_programs
    except subprocess.CalledProcessError as e:
        print(f"Error executing PowerShell command: {e}")
        return []


def get_windows_version():
    """
    Gets the Windows version details and sets the vendor to Microsoft.
    """
    win_version = platform.win32_ver()
    os_name = f"Windows {win_version[0]} {win_version[1]}"
    return {"Name": os_name, "Version": win_version[1]}


def determine_vendor(program_name):
    """
    Determines the vendor based on known keywords in the program name.
    """
    program_name = program_name.lower()
    vendor_map = {
        "microsoft": "microsoft",
        "adobe": "adobe",
        "google": "google",
        "oracle": "oracle",
        "python": "python",
        "nvidia": "nvidia",
        "blender": "blender",
        "skype": "microsoft",
        "notepad++": "notepad-plus-plus",
        "visual studio": "microsoft",
        "mozilla": "mozilla"
    }

    for keyword, vendor in vendor_map.items():
        if keyword in program_name:
            return vendor

    # Default vendor based on the first word in the program name
    default_vendor = program_name.split()[0] if program_name.split() else "unknown"
    return default_vendor


def strip_version_from_name(product_name):
    """
    Strips unnecessary details like versions and parentheses from product names.
    """
    cleaned_name = re.sub(r'\b(version\s*[0-9\.]+|[0-9\.]+.*)\b', '', product_name, flags=re.IGNORECASE)
    cleaned_name = re.sub(r'\s*\(.*\)\s*', '', cleaned_name)
    return cleaned_name.strip()


def condense_programs(installed_programs):
    """
    Condenses programs based on patterns and groups them.
    """
    condensed = defaultdict(set)
    condense_map = {
        r'(catalyst control center.*)': 'Catalyst Control Center',
        r'(microsoft\s*.net.*)': 'Microsoft .NET',
        r'(microsoft visual c\+\+.*)': 'Microsoft Visual C++',
        r'(python.*)': 'Python',
        r'(nvidia.*)': 'NVIDIA',
        r'(winrt intellisense.*)': 'WinRT Intellisense',
        r'(windows software development kit.*)': 'Windows SDK',
        r'(audacity.*)': 'Audacity',
        r'(adobe.*)': 'Adobe'
    }

    for program in installed_programs:
        if not program or not isinstance(program, dict) or not program.get('Name') or not program.get('Version'):
            continue

        program_name = program['Name'].lower()
        program_version = program['Version']
        stripped_name = strip_version_from_name(program['Name'])

        matched = False
        for pattern, condensed_name in condense_map.items():
            if re.search(pattern, program_name):
                condensed[condensed_name].add(program_version)
                matched = True
                break

        if not matched:
            condensed[stripped_name].add(program_version)

    return {name: ', '.join(sorted(versions)) for name, versions in condensed.items()}


def clean_product_name(vendor, product):
    """
    Cleans up the product name by removing redundant vendor names and formatting marks.
    """
    product = re.sub(r'[^\w\s]', '', product)  # Remove non-alphanumeric characters except spaces
    product = re.sub(r'\s+', '_', product)     # Replace spaces with underscores
    if vendor in product.lower() and vendor != product.lower():
        product = product.lower().replace(vendor, "").replace("__", "_").strip("_")
    return product.capitalize() if product else vendor.capitalize()


def generate_cpe_query(vendor, product, version):
    """
    Generates the CPE query format.
    """
    product = clean_product_name(vendor, product)
    return f"cpe:2.3:a:{vendor}:{product}:{version}:*:*:*:*:*:*:*"


def parse_version(version):
    """
    Parses version strings into a list of integers for sorting.
    """
    numeric_parts = re.findall(r'\d+', version)
    return [int(part) for part in numeric_parts if part.isdigit()]


def query_vulnerabilities(condensed_programs):
    """
    Queries the NVD API for each program's vulnerabilities.
    """
    vulnerable_programs = []
    total_scanned = 0
    vulnerabilities_count = 0
    all_queries = []  # Store all queries to print before making requests

    # Prepare all queries
    for program, versions in condensed_programs.items():
        version_list = sorted([v for v in versions.split(', ') if v], key=lambda v: parse_version(v), reverse=True)
        if not version_list:
            continue

        latest_version = version_list[0]
        vendor = determine_vendor(program)

        # Properly format the product name
        product = program if vendor == program else program.replace(vendor, "").replace("-", "").replace("_", "").strip()
        cpe_query = generate_cpe_query(vendor, product, latest_version)
        query_url = f"https://services.nvd.nist.gov/rest/json/cves/2.0?cpeName={cpe_query}"
        all_queries.append((program, latest_version, vendor, product, query_url))

    # Print all queries before making requests
    print("All CPE Queries to be made:")
    for program, version, vendor, product, query in all_queries:
        print(f"Program: {program}, Version: {version}, Query URL: {query}")

    # Query the NVD for vulnerabilities
    for program, latest_version, vendor, product, query_url in all_queries:
        try:
            print(f"Querying: {query_url}")
            headers = {'Authorization': f'Bearer {API_KEY}'}
            response = requests.get(query_url, headers=headers)
            if response.status_code == 200:
                data = response.json()
                print(f"Response: {data}")
                if 'vulnerabilities' in data and data['vulnerabilities']:
                    vulnerabilities_count += 1
                    vulnerable_programs.append(data)
                    save_vulnerability_to_file(data, vendor, product, latest_version)
            else:
                print(f"Error querying NVD for {program} (version {latest_version}): {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Exception occurred while querying NVD: {e}")
        time.sleep(6)
        total_scanned += 1

    print(f"Total programs scanned: {total_scanned}")
    print(f"Total programs with vulnerabilities: {vulnerabilities_count}")
    pprint(vulnerable_programs)


def save_vulnerability_to_file(vulnerability_data, vendor, product, version):
    """
    Saves the vulnerability data as a JSON file in the vulnerabilities folder using the custom format.
    """
    folder_path = VULNERABILITIES_FOLDER
    os.makedirs(folder_path, exist_ok=True)
    product_name = product.lower().replace(" ", "_").replace("-", "_")
    file_name = f"{vendor}_{product_name}_{version}.json"
    file_path = os.path.join(folder_path, file_name)

    # Save the JSON data only if the file doesn't exist to avoid duplicates
    if not os.path.exists(file_path):
        with open(file_path, 'w') as file:
            json.dump(vulnerability_data, file, indent=4)
        print(f"Saved vulnerability data to {file_path}")
    else:
        print(f"File already exists: {file_path}")


def save_program_list(programs):
    """
    Saves the list of installed programs to a JSON file.
    """
    with open(PROGRAMS_FILE, 'w') as file:
        json.dump(programs, file, indent=4)
    print(f"Saved current program list to {PROGRAMS_FILE}")


def load_program_list():
    """
    Loads the list of installed programs from the saved JSON file.
    """
    if os.path.exists(PROGRAMS_FILE):
        with open(PROGRAMS_FILE, 'r') as file:
            return json.load(file)
    return []


def check_for_changes(current_programs):
    """
    Checks if the current programs differ from the previously saved list.
    """
    previous_programs = load_program_list()
    return current_programs != previous_programs


def main():
    print("Starting a new scan...")
    
    # Step 1: Retrieve currently installed programs and save them
    installed_programs = get_installed_programs()
    windows_version = get_windows_version()
    installed_programs.append(windows_version)

    # Step 2: Check if there are any changes compared to the previous scan
    if check_for_changes(installed_programs):
        print("Detected changes in installed programs or a new scan required.")
        save_program_list(installed_programs)  # Update stored program list
        print("Performing a scan based on updated program list...")
        condensed_programs = condense_programs(installed_programs)
        query_vulnerabilities(condensed_programs)
    else:
        print("No changes detected in installed programs. Skipping scan.")

    print("Scan completed.")


if __name__ == "__main__":
    main()
