import requests
import time
import subprocess
import json
import re

# Dictionary to manually map application names to vendor names
vendor_map = {
    "Microsoft Teams": "microsoft",
    "Google Chrome": "google",
    "Mozilla Firefox": "mozilla",
    "Office": "microsoft",
    "Edge": "microsoft",
    "VMware": "vmware",
    # Add more mappings as needed
}

def get_installed_apps():
    # PowerShell command to get installed applications without table formatting
    command = "powershell -Command \"Get-ItemProperty HKLM:\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName, DisplayVersion | ConvertTo-Json\""
    output = subprocess.check_output(command, shell=True, universal_newlines=True)
    
    # Print the raw output from PowerShell
    print("PowerShell Output:")
    print(output)

    # Parse JSON output
    apps = json.loads(output)
    
    # Extract DisplayName and DisplayVersion, ensuring they are valid
    return [(app.get('DisplayName'), app.get('DisplayVersion')) for app in apps if app.get('DisplayName') and app.get('DisplayVersion')]

def clean_product_name(vendor, product):
    # Remove vendor name from product if present
    vendor_lower = vendor.lower()
    product_cleaned = product.lower().replace("_", " ")
    
    # Remove vendor name
    if vendor_lower in product_cleaned:
        product_cleaned = product_cleaned.replace(vendor_lower, "").strip()
    
    # Remove special characters near numbers and the numbers themselves
    product_cleaned = re.sub(r'[\W_]*\d+[\W_]*', '', product_cleaned).strip()

    return product_cleaned.replace(" ", "_")  # Return with underscores for CPE

def format_cpe(vendor, product, version):
    return f"cpe:2.3:a:{vendor}:{product}:{version}:*:*:*:*:*:*:*"

def query_vulnerabilities(apps):
    for app in apps:
        raw_name, version = app
        if not raw_name or not version:
            print(f"Skipping invalid app entry: {app}")
            continue  # Skip if either name or version is None
        
        # Set vendor based on the vendor map or keyword check
        if "microsoft" in raw_name.lower() or "visual studio" in raw_name.lower():
            vendor = "microsoft"
        elif "vmware" in raw_name.lower():
            vendor = "vmware"
        else:
            vendor = vendor_map.get(raw_name, raw_name.lower().replace(" ", "_"))
        
        product = clean_product_name(vendor, raw_name)
        
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

def main():
    while True:
        installed_apps = get_installed_apps()
        query_vulnerabilities(installed_apps)
        time.sleep(120)  # Sleep for 2 minutes

if __name__ == "__main__":
    main()
