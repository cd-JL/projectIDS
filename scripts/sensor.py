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


def get_installed_programs():
    """
    Extracts installed programs using PowerShell.
    """
    command = '''
    Get-ItemProperty HKLM:\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*, 
    HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* |
    Where-Object {
        $_.DisplayName -ne $null -and
        $_.DisplayVersion -ne $null -and
        $_.DisplayName -notmatch 'Update|Service|Component|Package|SDK|Driver|Symbols|Bootstrap|Redistributable'
    } |
    Sort-Object DisplayName -Unique |
    Select-Object DisplayName, DisplayVersion |
    ConvertTo-Json
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
    return {"DisplayName": os_name, "DisplayVersion": win_version[1]}


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
        program_name = program['DisplayName'].lower()
        program_version = program['DisplayVersion']
        stripped_name = strip_version_from_name(program['DisplayName'])
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
    folder_path = "vulnerabilities"
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


def main():
    installed_programs = get_installed_programs()
    windows_version = get_windows_version()
    installed_programs.append(windows_version)
    condensed_programs = condense_programs(installed_programs)

    print("Condensed Application Details:")
    for name, versions in condensed_programs.items():
        print(f"{name}: Versions - {versions}")

    query_vulnerabilities(condensed_programs)


if __name__ == "__main__":
    main()
