import subprocess
import json
import re
from collections import defaultdict

def get_installed_programs():
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

def strip_version_from_name(product_name):
    cleaned_name = re.sub(r'\b(version\s*[0-9\.]+|[0-9\.]+.*)\b', '', product_name, flags=re.IGNORECASE)
    cleaned_name = re.sub(r'\s*\(.*\)\s*', '', cleaned_name)  # Remove text inside parentheses
    cleaned_name = re.sub(r'[\)\(\-\+]', '', cleaned_name)  # Remove extra symbols like parentheses, etc.
    return cleaned_name.strip()

def condense_programs(installed_programs):
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
        r'(adobe.*)': 'Adobe',
        r'(asp\.net|asp)': 'ASP.NET',  # Handle ASP.NET products
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

def determine_vendor(program_name):
    vendor_map = {
        'microsoft': 'Microsoft',
        'adobe': 'Adobe',
        'nvidia': 'NVIDIA',
        'python': 'Python',
        'intel': 'Intel',
        'oracle': 'Oracle',
        'google': 'Google',
        'mozilla': 'Mozilla',
        'apple': 'Apple',
        'vmware': 'VMware',
        'blender foundation': 'Blender',
        'python software foundation': 'Python',
        'windows': 'Microsoft',  # Mapping Windows to Microsoft
    }
    program_name_lower = program_name.lower().strip()
    if not program_name_lower:
        return "Unknown Vendor"
    for keyword, vendor in vendor_map.items():
        if keyword in program_name_lower:
            return vendor
    default_vendor = program_name.split()[0] if program_name.split() else "Unknown Vendor"
    return default_vendor

def generate_cpe_query(program, version):
    vendor = determine_vendor(program)
    product = program.lower().replace(' ', '_').replace('.', '_').replace('-', '_')

    if program.lower().startswith(".net"):
        product = ".net"  # Special handling for .NET

    # Ensure product doesn't repeat the vendor (like nvidia:nvidia)
    if vendor.lower() in product:
        product = product.replace(vendor.lower(), "").strip('_')

    cpe_name = f"cpe:2.3:a:{vendor.lower()}:{product}:{version}:*:*:*:*:*:*:*"
    return cpe_name

def query_vulnerabilities(condensed_programs):
    for program, versions in condensed_programs.items():
        for version in versions.split(', '):
            cpe_query = generate_cpe_query(program, version)
            print(f"Querying for {program} (version {version}): {cpe_query}")

def main():
    installed_programs = get_installed_programs()
    condensed_programs = condense_programs(installed_programs)
    print("Condensed Application Details:")
    for name, versions in condensed_programs.items():
        print(f"{name}: Versions - {versions}")
    query_vulnerabilities(condensed_programs)

if __name__ == "__main__":
    main()
