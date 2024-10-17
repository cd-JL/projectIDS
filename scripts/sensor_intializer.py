import os
import json
import time
import subprocess
import uuid
import platform  # Added for getting the device name
from pymongo import MongoClient
from bson import ObjectId
from hashlib import md5
from dotenv import load_dotenv
import atexit

# Get the absolute path of the current script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))

# Load environment variables from the .env.local file in the parent folder of the script
parent_directory = os.path.join(script_dir, '..', 'projectVD')
env_path = os.path.join(parent_directory, '.env.local')
load_dotenv(env_path)

# Fetch MongoDB URI
uri = os.getenv("MONGODB_URI")

# Constants - Ensuring all paths are relative to the script's directory
CACHE_DIR = os.path.join(script_dir, "cache")
SENSOR_ID_FILE = os.path.join(CACHE_DIR, "sensor_id.json")
PROGRAMS_FILE = os.path.join(CACHE_DIR, "programs.json")
VULNERABILITIES_DIR = os.path.join(CACHE_DIR, "vulnerabilities")

# Assuming sensor.py is in the same folder as the current script
SENSOR_SCRIPT = os.path.join(script_dir, "sensor.py")

SCAN_INTERVAL = 10  # Time interval in seconds between scans

# MongoDB connection setup
client = MongoClient(uri)
db = client["projectv"]
programs_collection = db["programs"]
vulnerabilities_collection = db["vulnerabilities"]
sensors_collection = db["sensors"]
companies_collection = db["companies"]

# Ensure cache directory and vulnerabilities directory are created
os.makedirs(CACHE_DIR, exist_ok=True)
os.makedirs(VULNERABILITIES_DIR, exist_ok=True)

# Tracks hashes of previously uploaded data to detect changes
previous_hashes = {"programs": None, "vulnerabilities": {}}

def get_device_name():
    """Get the device name using platform module."""
    return platform.node()

def get_file_hash(filepath):
    """Calculate MD5 hash of a file."""
    try:
        with open(filepath, 'rb') as file:
            file_content = file.read()
            return md5(file_content).hexdigest()
    except FileNotFoundError:
        return None

def get_big_corp_id():
    """Get the ObjectId of 'Big Corp' from the companies collection."""
    try:
        company = companies_collection.find_one({"name": "Big Corp"})
        if company:
            return company["_id"]
        else:
            raise ValueError("Company 'Big Corp' not found in the companies collection.")
    except Exception as e:
        print(f"Error retrieving 'Big Corp' ID: {e}")
        return None
    
def pull_programs_from_db(sensor_id):
    """Pull the programs data for the given sensor ID from the database."""
    try:
        # Fetch programs for the sensor from the database
        program_data = programs_collection.find_one({"sensorId": sensor_id})
        if program_data and "programs" in program_data:
            # Save the programs data to the local file
            with open(PROGRAMS_FILE, 'w') as programs_file:
                json.dump(program_data["programs"], programs_file)
            print(f"Programs data pulled from the database and saved to {PROGRAMS_FILE} for sensor {sensor_id}.")
        else:
            print(f"No programs data found in the database for sensor {sensor_id}.")
    except Exception as e:
        print(f"Error pulling programs data from database: {e}")

def get_or_create_sensor_id():
    """Get the sensor ID from the sensor_id.json file or create one if it doesn't exist, including the device name."""
    try:
        company_id = get_big_corp_id()
        if not company_id:
            print("Company ID for 'Big Corp' is missing. Cannot proceed.")
            return None

        device_name = get_device_name()

        # Step 1: Check if the device name already exists in the database
        existing_sensor = sensors_collection.find_one({"deviceName": device_name})
        if existing_sensor:
            db_sensor_id = existing_sensor.get("sensorId")

            # Step 2: Check if the sensor_id.json file exists
            if os.path.exists(SENSOR_ID_FILE):
                with open(SENSOR_ID_FILE, 'r') as id_file:
                    sensor_data = json.load(id_file)
                    local_sensor_id = sensor_data.get("sensor_id", "").strip()

                    # Step 3: Compare the sensor IDs (local and database)
                    if local_sensor_id and local_sensor_id != db_sensor_id:
                        # The sensor ID in the local file is different from the database, update the local file
                        save_sensor_id(db_sensor_id, device_name)
                        print(f"Updated local sensor ID to {db_sensor_id} from the database for device {device_name}.")
                    else:
                        print(f"Sensor ID in the local file matches the database for device {device_name}.")
            else:
                # If the local file doesn't exist, save the sensor ID from the database
                save_sensor_id(db_sensor_id, device_name)
                print(f"Saved sensor ID {db_sensor_id} from the database to local file for device {device_name}.")

            # Step 4: Pull programs data from the database and save it locally
            pull_programs_from_db(db_sensor_id)

            return db_sensor_id

        # Step 5: If the device name doesn't exist in the database, handle sensor creation or updating
        if not os.path.exists(SENSOR_ID_FILE):
            # Generate a new sensor ID if the file does not exist
            new_sensor_id = str(uuid.uuid4())
            save_sensor_id(new_sensor_id, device_name)
            print(f"Generated new sensor ID: {new_sensor_id}")
            upload_sensor_id_to_db(new_sensor_id, company_id, device_name)  # Upload new sensor ID to database with device name
            return new_sensor_id

        # Read the existing sensor ID from the local file
        with open(SENSOR_ID_FILE, 'r') as id_file:
            sensor_data = json.load(id_file)
            local_sensor_id = sensor_data.get("sensor_id", "").strip()

            if not local_sensor_id:
                raise ValueError("Sensor ID is empty in the JSON file.")

            # If device name is missing in the JSON, add it and update the database
            if "device_name" not in sensor_data or not sensor_data["device_name"]:
                save_sensor_id(local_sensor_id, device_name)  # Update local file with device name
                upload_sensor_id_to_db(local_sensor_id, company_id, device_name)  # Update database with device name
                print(f"Added device name {device_name} to sensor ID {local_sensor_id} and updated the database.")

            return local_sensor_id

    except (FileNotFoundError, json.JSONDecodeError, ValueError) as e:
        # If the file is missing, corrupted, or the sensor ID is empty, generate a new one
        new_sensor_id = str(uuid.uuid4())
        save_sensor_id(new_sensor_id, device_name)
        print(f"Generated new sensor ID: {new_sensor_id}")
        upload_sensor_id_to_db(new_sensor_id, company_id, device_name)  # Upload new sensor ID to database with device name
        return new_sensor_id

def save_sensor_id(sensor_id, device_name):
    """Save the sensor ID and device name to the sensor_id.json file."""
    try:
        os.makedirs(CACHE_DIR, exist_ok=True)
        with open(SENSOR_ID_FILE, 'w') as id_file:
            json.dump({"sensor_id": sensor_id, "device_name": device_name}, id_file)
        print(f"Sensor ID and device name saved to: {SENSOR_ID_FILE}")
    except Exception as e:
        print(f"Error saving sensor ID: {e}")

def update_sensor_status(sensor_id, status):
    """Update the sensor's active status in the database."""
    try:
        sensors_collection.update_one(
            {"sensorId": sensor_id},
            {"$set": {"active": status}}
        )
        print(f"Sensor {sensor_id} status updated to {'active' if status else 'inactive'}.")
    except Exception as e:
        print(f"Error updating sensor status: {e}")

def upload_sensor_id_to_db(sensor_id, company_id, device_name):
    """Upload or update the sensor ID, device name, and company ID in the sensors collection."""
    try:
        # Use an upsert to insert or update the sensor in the sensors collection
        result = sensors_collection.update_one(
            {"sensorId": sensor_id},
            {"$set": {
                "companyId": company_id,
                "deviceName": device_name
            }},
            upsert=True
        )
        
        # Check if an insert or update occurred
        if result.upserted_id:
            print(f"New sensor created with ID {sensor_id} and device name {device_name} for company {company_id}.")
            sensor_obj_id = result.upserted_id
            # Add the new sensor to the company's sensors array in the companies collection
            companies_collection.update_one(
                {"_id": company_id},
                {"$push": {"sensors": sensor_obj_id}}
            )
            print(f"Sensor ID {sensor_obj_id} added to the company 'Big Corp' sensors array.")
        else:
            print(f"Sensor with ID {sensor_id} already exists. Updated device name to {device_name}.")

    except Exception as e:
        print(f"Error uploading or updating sensor ID in the database: {e}")

def upload_programs(sensor_id):
    """Upload programs data to the database linked with the given sensor ID if changes are detected."""
    global previous_hashes
    current_hash = get_file_hash(PROGRAMS_FILE)

    # Only upload if the data has changed
    if current_hash and current_hash != previous_hashes["programs"]:
        try:
            with open(PROGRAMS_FILE, 'r') as programs_file:
                programs_data = json.load(programs_file)
                document = {
                    "sensorId": sensor_id,
                    "programs": programs_data
                }
                
                # Use upsert to insert or update the sensor's program data in the programs collection
                result = programs_collection.update_one(
                    {"sensorId": sensor_id},
                    {"$set": document},
                    upsert=True
                )
                
                # Check if an insert or update occurred
                if result.upserted_id:
                    print(f"New programs data uploaded for sensor ID: {sensor_id}")
                else:
                    print(f"Programs data updated for sensor ID: {sensor_id}")
                    
                previous_hashes["programs"] = current_hash

        except FileNotFoundError:
            print(f"Programs file not found: {PROGRAMS_FILE}")
        except Exception as e:
            print(f"Error uploading programs data: {e}")

import re
from collections import defaultdict

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

def strip_version_from_name(product_name):
    """
    Strips unnecessary details like versions and parentheses from product names.
    """
    cleaned_name = re.sub(r'\b(version\s*[0-9\.]+|[0-9\.]+.*)\b', '', product_name, flags=re.IGNORECASE)
    cleaned_name = re.sub(r'\s*\(.*\)\s*', '', cleaned_name)
    return cleaned_name.strip()


def upload_vulnerabilities(sensor_id):
    """Upload vulnerabilities data to the database linked with the given sensor ID if changes are detected."""
    global previous_hashes

    # First, load the program list from the database for this sensor
    program_data = programs_collection.find_one({"sensorId": sensor_id})
    if not program_data or "programs" not in program_data:
        print(f"No programs found for sensor ID {sensor_id}.")
        return

    # Condense programs for vulnerability query
    installed_programs = program_data.get("programs", [])
    condensed_programs = condense_programs(installed_programs)

    print(f"Condensed programs for vulnerability query: {condensed_programs}")

    try:
        os.makedirs(VULNERABILITIES_DIR, exist_ok=True)

        # Query vulnerabilities for each program
        query_vulnerabilities(condensed_programs)

    except Exception as e:
        print(f"Error uploading vulnerabilities data: {e}")


def query_vulnerabilities(condensed_programs):
    """Queries the NVD API for each program's vulnerabilities."""
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
        time.sleep(6)  # Respect rate limiting
        total_scanned += 1

    print(f"Total programs scanned: {total_scanned}")
    print(f"Total programs with vulnerabilities: {vulnerabilities_count}")
    pprint(vulnerable_programs)


def save_vulnerability_to_file(vulnerability_data, vendor, product, version):
    """Saves the vulnerability data as a JSON file in the vulnerabilities folder using the custom format."""
    folder_path = VULNERABILITIES_DIR
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
def run_sensor_script():
    """Runs the sensor.py script and waits for it to complete."""
    try:
        print(f"Running sensor.py from path: {SENSOR_SCRIPT}")
        subprocess.run(["python", SENSOR_SCRIPT], check=True)
        print("sensor.py completed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error running {SENSOR_SCRIPT}: {e}")
    except FileNotFoundError:
        print(f"{SENSOR_SCRIPT} not found. Please ensure that {SENSOR_SCRIPT} is in the correct directory.")

# Cleanup logic
def cleanup(sensor_id):
    """Ensure sensor is marked as inactive when the program exits."""
    update_sensor_status(sensor_id, False)
    print("Program exiting, sensor marked as inactive.")

# Main function
def main():
    # Step 1: Get or create the sensor ID
    sensor_id = get_or_create_sensor_id()
    if not sensor_id:
        print("Sensor ID creation failed. Exiting.")
        return
    
    # Register cleanup function with atexit
    atexit.register(cleanup, sensor_id)

    update_sensor_status(sensor_id, True)  # Mark sensor as active

    try:
        while True:
            # Step 2: Run sensor.py script (scans running)
            run_sensor_script()

            # Step 3: Upload programs data linked with the sensor ID (only if changed)
            upload_programs(sensor_id)

            # Step 4: Upload vulnerabilities data linked with the sensor ID (only if changed)
            upload_vulnerabilities(sensor_id)

            # Step 5: Wait for the next scan interval
            print(f"Waiting {SCAN_INTERVAL} seconds before the next scan...")
            time.sleep(SCAN_INTERVAL)
        
    except Exception as e:
        print(f"Error during main loop execution: {e}")

if __name__ == "__main__":
    main()
