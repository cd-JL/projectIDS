import os
import json
import time
import subprocess
import uuid
import platform
from pymongo import MongoClient
from hashlib import md5
from dotenv import load_dotenv
import atexit
import re
from collections import defaultdict

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

def extract_details_from_filename(filename):
    """
    Extracts the vendor, product, and version from the given filename.
    Assumes the filename format is 'vendor_product_version.json'.
    """
    try:
        base_name = filename.replace('.json', '')
        vendor, product, version = base_name.split('_', 2)
        return vendor, product, version
    except ValueError:
        raise ValueError(f"Filename {filename} is not in the expected 'vendor_product_version.json' format.")

def parse_version(version):
    """Parses version strings into a list of integers for sorting."""
    numeric_parts = re.findall(r'\d+', version)
    return [int(part) for part in numeric_parts if part.isdigit()]

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

def get_or_create_sensor_id():
    """Get the sensor ID from the sensor_id.json file or create one if it doesn't exist."""
    try:
        company_id = get_big_corp_id()
        if not company_id:
            print("Company ID for 'Big Corp' is missing. Cannot proceed.")
            return None

        device_name = get_device_name()

        # Check if the device name already exists in the database
        existing_sensor = sensors_collection.find_one({"deviceName": device_name})
        if existing_sensor:
            db_sensor_id = existing_sensor.get("sensorId")
            save_sensor_id(db_sensor_id, device_name)
            return db_sensor_id

        # Generate a new sensor ID if it does not exist
        new_sensor_id = str(uuid.uuid4())
        save_sensor_id(new_sensor_id, device_name)
        upload_sensor_id_to_db(new_sensor_id, company_id, device_name)
        return new_sensor_id

    except Exception as e:
        print(f"Error in get_or_create_sensor_id: {e}")
        return None

def upload_sensor_id_to_db(sensor_id, company_id, device_name):
    """Upload or update the sensor ID, device name, and company ID in the sensors collection."""
    try:
        result = sensors_collection.update_one(
            {"sensorId": sensor_id},
            {"$set": {
                "companyId": company_id,
                "deviceName": device_name
            }},
            upsert=True
        )
        
        if result.upserted_id:
            print(f"New sensor created with ID {sensor_id}.")
        else:
            print(f"Sensor with ID {sensor_id} already exists. Updated device name to {device_name}.")
    except Exception as e:
        print(f"Error uploading or updating sensor ID in the database: {e}")

def upload_programs(sensor_id):
    """Upload programs data to the database linked with the given sensor ID if changes are detected."""
    global previous_hashes
    current_hash = get_file_hash(PROGRAMS_FILE)

    if current_hash and current_hash != previous_hashes["programs"]:
        try:
            with open(PROGRAMS_FILE, 'r') as programs_file:
                programs_data = json.load(programs_file)
                document = {
                    "sensorId": sensor_id,
                    "programs": programs_data
                }
                result = programs_collection.update_one(
                    {"sensorId": sensor_id},
                    {"$set": document},
                    upsert=True
                )
                if result.upserted_id:
                    print(f"New programs data uploaded for sensor ID: {sensor_id}")
                else:
                    print(f"Programs data updated for sensor ID: {sensor_id}")
                previous_hashes["programs"] = current_hash
        except Exception as e:
            print(f"Error uploading programs data: {e}")

def upload_vulnerabilities(sensor_id):
    """Upload vulnerabilities data to the database linked with the given sensor ID if changes are detected."""
    global previous_hashes
    try:
        os.makedirs(VULNERABILITIES_DIR, exist_ok=True)

        # Iterate through each JSON file in the vulnerabilities directory
        for filename in os.listdir(VULNERABILITIES_DIR):
            if filename.endswith(".json"):
                try:
                    vendor, product, version = extract_details_from_filename(filename)
                    file_path = os.path.join(VULNERABILITIES_DIR, filename)
                    current_hash = get_file_hash(file_path)
                    previous_hash = previous_hashes["vulnerabilities"].get(filename)

                    if current_hash and current_hash != previous_hash:
                        with open(file_path, 'r') as file:
                            vulnerability_data = json.load(file)
                            document = {
                                "sensorId": sensor_id,
                                "vendor": vendor,
                                "product": product,
                                "version": version,
                                "vulnerabilityData": vulnerability_data
                            }
                            result = vulnerabilities_collection.update_one(
                                {"sensorId": sensor_id, "vendor": vendor, "product": product, "version": version},
                                {"$set": document},
                                upsert=True
                            )
                            if result.upserted_id:
                                print(f"New vulnerability data uploaded for {vendor} {product} version {version}.")
                            else:
                                print(f"Vulnerability data updated for {vendor} {product} version {version}.")
                            previous_hashes["vulnerabilities"][filename] = current_hash
                except ValueError as ve:
                    print(f"Error processing file {filename}: {ve}")
                except Exception as e:
                    print(f"Error uploading data for {filename}: {e}")
    except Exception as e:
        print(f"Error uploading vulnerabilities data: {e}")

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

def cleanup(sensor_id):
    """Ensure sensor is marked as inactive when the program exits."""
    update_sensor_status(sensor_id, False)
    print("Program exiting, sensor marked as inactive.")

def main():
    sensor_id = get_or_create_sensor_id()
    if not sensor_id:
        print("Sensor ID creation failed. Exiting.")
        return

    atexit.register(cleanup, sensor_id)
    update_sensor_status(sensor_id, True)

    try:
        while True:
            run_sensor_script()
            upload_programs(sensor_id)
            upload_vulnerabilities(sensor_id)
            print(f"Waiting {SCAN_INTERVAL} seconds before the next scan...")
            time.sleep(SCAN_INTERVAL)
    except Exception as e:
        print(f"Error during main loop execution: {e}")

if __name__ == "__main__":
    main()
