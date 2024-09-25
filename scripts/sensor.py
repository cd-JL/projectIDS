import subprocess
import json
import re
from collections import defaultdict

def get_installed_programs():
    # Updated PowerShell command to extract main installed programs and avoid individual components
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
        # Run the PowerShell command and capture the output as JSON
        output = subprocess.check_output(["powershell", "-Command", command], universal_newlines=True)
        
        # Parse the JSON output
        installed_programs = json.loads(output)

        return installed_programs
    except subprocess.CalledProcessError as e:
        print(f"Error executing PowerShell command: {e}")
        return []

def condense_programs(installed_programs):
    """
    Condenses program names based on patterns, grouping by name and aggregating versions.
    """
    condensed = defaultdict(set)

    # Add relevant patterns to map different versions of the same program into one condensed name
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
        # Add more patterns for condensing other programs as necessary
    }

    for program in installed_programs:
        program_name = program['DisplayName'].lower()
        program_version = program['DisplayVersion']

        matched = False
        for pattern, condensed_name in condense_map.items():
            if re.search(pattern, program_name):
                condensed[condensed_name].add(program_version)
                matched = True
                break

        if not matched:
            condensed[program['DisplayName']].add(program_version)

    # Formatting the output
    return {name: ', '.join(sorted(versions)) for name, versions in condensed.items()}

def query_vulnerabilities(condensed_programs):
    """
    Cross-references the condensed programs and generates a query link to search for vulnerabilities.
    """
    for program, versions in condensed_programs.items():
        print(f"Condensed Program: {program}, Versions: {versions}")
        # Construct the CPE name and query NVD API (this is just a placeholder for actual querying logic)
        # Example:
        # print(f"Querying for {program}: https://services.nvd.nist.gov/rest/json/cves/2.0?cpeName=cpe:/a:{program}:{version}")

def main():
    # Get the list of installed programs
    installed_programs = get_installed_programs()

    # Condense program names and versions
    condensed_programs = condense_programs(installed_programs)

    # Print the condensed program details
    print("Condensed Application Details:")
    for name, versions in condensed_programs.items():
        print(f"{name}: Versions - {versions}")

    # Query for vulnerabilities using the condensed program list
    query_vulnerabilities(condensed_programs)

# Run the main function
if __name__ == "__main__":
    main()
