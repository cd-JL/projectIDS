import requests
import time
import subprocess
import re

def get_installed_apps():
    # Command to get installed applications
    command = "wmic product get name,version"
    output = subprocess.check_output(command, shell=True, universal_newlines=True)
    # Split and clean up the output
    return [line.strip() for line in output.strip().split("\n")[1:] if line.strip()]

def format_cpe(vendor, product, version):
    return f"cpe:2.3:a:{vendor}:{product}:{version}:*:*:*:*:*:*:*"

def query_vulnerabilities(apps):
    for app in apps:
        # Use regex to separate name and version
        match = re.match(r'(.+?)(\d[\d.]*).*', app)
        if match:
            raw_name = match.group(1).strip()
            version = match.group(2).strip()
            vendor = raw_name.lower().replace(" ", "_")
            product = raw_name.lower().replace(" ", "_")
            
            # Print raw application details
            print(f"Raw Application Details: {raw_name}, Version: {version}")
            
            # Format the CPE and create the query URL
            cpe_name = format_cpe(vendor, product, version)
            query_url = f"https://services.nvd.nist.gov/rest/json/cves/2.0?cpeName={cpe_name}"
            print(f"Querying: {query_url}")
            # Uncomment the following lines to actually perform the query
            # response = requests.get(query_url)
            # if response.status_code == 200:
            #     print(response.json())
            # else:
            #     print(f"Error: {response.status_code}")
        else:
            print(f"Could not parse app: {app}")

def main():
    while True:
        installed_apps = get_installed_apps()
        query_vulnerabilities(installed_apps)
        time.sleep(120)  # Sleep for 2 minutes

if __name__ == "__main__":
    main()
