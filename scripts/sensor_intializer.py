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
import signal

# Load environment variables from the .env.local file in the webapp folder
parent_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'projectVD')
env_path = os.path.join(parent_directory, '.env.local')
load_dotenv(env_path)

# Fetch MongoDB URI
uri = os.getenv("MONGODB_URI")

# Constants
CACHE_DIR = "cache"
SENSOR_ID_FILE = os.path.join(CACHE_DIR, "sensor_id.json")
PROGRAMS_FILE = os.path.join(CACHE_DIR, "programs.json")
VULNERABILITIES_DIR = os.path.join(CACHE_DIR, "vulnerabilities")
SENSOR_SCRIPT = os.path.join("scripts", "sensor.py")
SCAN_INTERVAL = 10  # Time interval in seconds between scans

# MongoDB connection setup
client = MongoClient(uri)
db = client["projectv"]
programs_collection = db["programs"]
vulnerabilities_collection = db["vulnerabilities"]
sensors_collection = db["sensors"]
companies_collection = db["companies"]

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


def upload_vulnerabilities(sensor_id):
    """Upload vulnerabilities data to the database linked with the given sensor ID if changes are detected."""
    global previous_hashes
    try:
        os.makedirs(VULNERABILITIES_DIR, exist_ok=True)
        for filename in os.listdir(VULNERABILITIES_DIR):
            if filename.endswith(".json"):
                file_path = os.path.join(VULNERABILITIES_DIR, filename)
                current_hash = get_file_hash(file_path)

                # Only upload if the data has changed
                if current_hash and previous_hashes["vulnerabilities"].get(filename) != current_hash:
                    with open(file_path, 'r') as vuln_file:
                        vuln_data = json.load(vuln_file)
                        document = {
                            "sensorId": sensor_id,
                            "vulnerabilities": vuln_data.get("vulnerabilities", [])
                        }
                        
                        # Use upsert to insert or update the sensor's vulnerability data in the vulnerabilities collection
                        result = vulnerabilities_collection.update_one(
                            {"sensorId": sensor_id, "sourceFile": filename},
                            {"$set": document},
                            upsert=True
                        )

                        # Check if an insert or update occurred
                        if result.upserted_id:
                            print(f"New vulnerabilities data uploaded from file: {filename} for sensor ID: {sensor_id}")
                        else:
                            print(f"Vulnerabilities data updated from file: {filename} for sensor ID: {sensor_id}")

                        previous_hashes["vulnerabilities"][filename] = current_hash

    except FileNotFoundError:
        print(f"Vulnerabilities folder not found: {VULNERABILITIES_DIR}")
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

# Add a global variable to track if the program is running
running = True

def handle_exit_signal(signum, frame):
    """Handle exit signals to ensure the program updates the sensor status before exiting."""
    global running
    running = False

# Register signal handlers for graceful shutdown
signal.signal(signal.SIGINT, handle_exit_signal)
signal.signal(signal.SIGTERM, handle_exit_signal)

def main():
    global running

    while running:
        try:
            # Step 1: Get or create the sensor ID
            sensor_id = get_or_create_sensor_id()
            if not sensor_id:
                print("Sensor ID is missing. Cannot proceed with uploads.")
                time.sleep(SCAN_INTERVAL)
                continue

            # Step 2: Mark the sensor as active when the program starts running
            update_sensor_status(sensor_id, True)

            # Step 3: Run sensor.py script (scans running)
            run_sensor_script()

            # Step 4: Upload programs data linked with the sensor ID (only if changed)
            upload_programs(sensor_id)

            # Step 5: Upload vulnerabilities data linked with the sensor ID (only if changed)
            upload_vulnerabilities(sensor_id)

            # Step 6: Wait for the next scan interval
            print(f"Waiting {SCAN_INTERVAL} seconds before the next scan...")
            time.sleep(SCAN_INTERVAL)
        
        except Exception as e:
            print(f"Error during main loop execution: {e}")

        finally:
            # If the program is interrupted or completed, update sensor to inactive
            if not running:
                update_sensor_status(sensor_id, False)
                print("Program interrupted or completed, sensor marked as inactive.")
                break

if __name__ == "__main__":
    main()