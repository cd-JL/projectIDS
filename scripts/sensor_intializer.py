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
from bson import ObjectId

# Get the absolute path of the current script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))

# Load environment variables from the .env.local file in the parent folder of the script
parent_directory = os.path.join(script_dir, '..', 'projectVD')
env_path = os.path.join(parent_directory, '.env.local')
load_dotenv(env_path)

# Fetch MongoDB URI
uri = os.getenv("MONGODB_URI")

# Constants - Ensuring all paths are relative to the script's directory
COMPANY_NAME = "Big Corp"
CACHE_DIR = os.path.join(script_dir, "cache")
SENSOR_ID_FILE = os.path.join(CACHE_DIR, "sensor_id.json")
PROGRAMS_FILE = os.path.join(CACHE_DIR, "programs.json")
VULNERABILITIES_DIR = os.path.join(CACHE_DIR, "vulnerabilities")
PORT_SCAN_FILE = os.path.join(CACHE_DIR, "open_ports_configs.json")

# Assuming sensor.py and portScanner.py are in the same folder as the current script
SENSOR_SCRIPT = os.path.join(script_dir, "sensor.py")
PORT_SCANNER_SCRIPT = os.path.join(script_dir, "portScanner.py")

SCAN_INTERVAL = 10  # Time interval in seconds between scans

# MongoDB connection setup
client = MongoClient(uri)
db = client["projectv"]
programs_collection = db["programs"]
vulnerabilities_collection = db["vulnerabilities"]
sensors_collection = db["sensors"]
companies_collection = db["companies"]
ports_collection = db["ports"]

# Ensure cache directory and vulnerabilities directory are created
os.makedirs(CACHE_DIR, exist_ok=True)
os.makedirs(VULNERABILITIES_DIR, exist_ok=True)

# Tracks hashes of previously uploaded data to detect changes
previous_hashes = {"programs": None, "vulnerabilities": {}, "ports": None}

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

def get_company_id():
    """Retrieve the company ID based on the company name."""
    try:
        company = companies_collection.find_one({"name": COMPANY_NAME})
        if company:
            return company["_id"]
        else:
            raise ValueError(f"Company '{COMPANY_NAME}' not found in the companies collection.")
    except Exception as e:
        print(f"Error retrieving company ID for '{COMPANY_NAME}': {e}")
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

def add_sensor_to_company(sensor_id, company_id):
    """Adds the sensor ID to the specified company's sensors array if it's not already there."""
    try:
        sensor_object_id = sensors_collection.find_one({"sensorId": sensor_id})["_id"]
        result = companies_collection.update_one(
            {"_id": company_id},
            {"$addToSet": {"sensors": sensor_object_id}}
        )
        if result.modified_count > 0:
            print(f"Sensor {sensor_id} added to {COMPANY_NAME}.")
        else:
            print(f"Sensor {sensor_id} was already associated with {COMPANY_NAME}.")
    except Exception as e:
        print(f"Error adding sensor to '{COMPANY_NAME}': {e}")

def get_or_create_sensor_id():
    """Get the sensor ID from the sensor_id.json file or create one if it doesn't exist."""
    try:
        company_id = get_company_id()
        if not company_id:
            print(f"Company ID for '{COMPANY_NAME}' is missing. Cannot proceed.")
            return None

        device_name = get_device_name()

        # Check if the device name already exists in the database
        existing_sensor = sensors_collection.find_one({"deviceName": device_name})
        if existing_sensor:
            db_sensor_id = existing_sensor.get("sensorId")
            save_sensor_id(db_sensor_id, device_name)
            pull_programs_and_vulnerabilities(db_sensor_id)
            pull_ports_from_db(db_sensor_id)
            return db_sensor_id

        # Generate a new sensor ID if it does not exist
        new_sensor_id = str(uuid.uuid4())
        save_sensor_id(new_sensor_id, device_name)
        upload_sensor_id_to_db(new_sensor_id, company_id, device_name)
        add_sensor_to_company(new_sensor_id, company_id)
        return new_sensor_id

    except Exception as e:
        print(f"Error in get_or_create_sensor_id: {e}")
        return None

def pull_programs_and_vulnerabilities(sensor_id):
    """Pull programs and vulnerabilities data from the database if not present locally."""
    pull_programs_from_db(sensor_id)
    pull_vulnerabilities_from_db(sensor_id)

def pull_programs_from_db(sensor_id):
    """Pull programs data from the database if not present locally."""
    if not os.path.exists(PROGRAMS_FILE):
        try:
            program_data = programs_collection.find_one({"sensorId": sensor_id})
            if program_data and "programs" in program_data:
                with open(PROGRAMS_FILE, 'w') as programs_file:
                    json.dump(program_data["programs"], programs_file)
                print(f"Programs data pulled from the database and saved to {PROGRAMS_FILE} for sensor {sensor_id}.")
            else:
                print(f"No programs data found in the database for sensor {sensor_id}.")
        except Exception as e:
            print(f"Error pulling programs data from database: {e}")
    else:
        print(f"Programs file already exists locally: {PROGRAMS_FILE}")

def pull_vulnerabilities_from_db(sensor_id):
    """Pull vulnerabilities data from the database if not present locally."""
    try:
        vulnerabilities = vulnerabilities_collection.find({"sensorId": sensor_id})
        for vuln in vulnerabilities:
            vendor = vuln.get("vendor")
            product = vuln.get("product")
            version = vuln.get("version")
            if vendor and product and version:
                filename = f"{vendor}_{product}_{version}.json"
                file_path = os.path.join(VULNERABILITIES_DIR, filename)
                if not os.path.exists(file_path):
                    with open(file_path, 'w') as file:
                        json.dump(vuln.get("vulnerabilityData", {}), file)
                    print(f"Vulnerability data pulled and saved to {file_path} for {vendor} {product} version {version}.")
                else:
                    print(f"Vulnerability file {filename} already exists locally.")
    except Exception as e:
        print(f"Error pulling vulnerabilities data from database: {e}")

def pull_ports_from_db(sensor_id):
    """Pull port scan data from the database if not present locally."""
    if not os.path.exists(PORT_SCAN_FILE):
        try:
            port_data = ports_collection.find_one({"sensorId": sensor_id})
            if port_data and "services" in port_data:
                # Convert ObjectId to a string for JSON serialization
                port_data["_id"] = str(port_data["_id"])
                
                with open(PORT_SCAN_FILE, 'w') as ports_file:
                    json.dump(port_data, ports_file)
                print(f"Port scan data pulled from the database and saved to {PORT_SCAN_FILE} for sensor {sensor_id}.")
            else:
                print(f"No port scan data found in the database for sensor {sensor_id}.")
        except Exception as e:
            print(f"Error pulling port scan data from database: {e}")
    else:
        print(f"Port scan file already exists locally: {PORT_SCAN_FILE}")


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
                    vendor, product, version = filename.replace('.json', '').split('_', 2)
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

def upload_ports(sensor_id):
    """Upload port scan data to the database linked with the given sensor ID if changes are detected."""
    global previous_hashes
    current_hash = get_file_hash(PORT_SCAN_FILE)

    if current_hash and current_hash != previous_hashes["ports"]:
        try:
            with open(PORT_SCAN_FILE, 'r') as ports_file:
                ports_data = json.load(ports_file)
                document = {
                    "sensorId": sensor_id,
                    "services": [
                        {
                            "name": name,
                            "port": details["port"],
                            "status": details["status"],
                            "dangerous": details["dangerous"]
                        } for name, details in ports_data.items() if name != "all_open_ports"
                    ],
                    "all_open_ports": ports_data.get("all_open_ports", [])
                }
                result = ports_collection.update_one(
                    {"sensorId": sensor_id},
                    {"$set": document},
                    upsert=True
                )
                if result.upserted_id:
                    print(f"New port scan data uploaded for sensor ID: {sensor_id}")
                else:
                    print(f"Port scan data updated for sensor ID: {sensor_id}")
                previous_hashes["ports"] = current_hash
        except Exception as e:
            print(f"Error uploading port scan data: {e}")

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

def run_port_scanner():
    """Runs the portScanner.py script and waits for it to complete."""
    try:
        print(f"Running portScanner.py from path: {PORT_SCANNER_SCRIPT}")
        subprocess.run(["python", PORT_SCANNER_SCRIPT], check=True)
        print("portScanner.py completed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error running {PORT_SCANNER_SCRIPT}: {e}")
    except FileNotFoundError:
        print(f"{PORT_SCANNER_SCRIPT} not found. Please ensure that {PORT_SCANNER_SCRIPT} is in the correct directory.")

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
            if not os.path.exists(PROGRAMS_FILE):
                run_sensor_script()
            upload_programs(sensor_id)
            upload_vulnerabilities(sensor_id)

            # Run port scanner and upload data
            run_port_scanner()
            upload_ports(sensor_id)

            print(f"Waiting {SCAN_INTERVAL} seconds before the next scan...")
            time.sleep(SCAN_INTERVAL)
    except Exception as e:
        print(f"Error during main loop execution: {e}")

if __name__ == "__main__":
    main()
