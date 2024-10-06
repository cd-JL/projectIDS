import os
import json
import time
import subprocess
import uuid
from pymongo import MongoClient
from hashlib import md5

# Constants
CACHE_DIR = "cache"
SENSOR_ID_FILE = os.path.join(CACHE_DIR, "sensor_id.json")
PROGRAMS_FILE = os.path.join(CACHE_DIR, "programs.json")
VULNERABILITIES_DIR = os.path.join(CACHE_DIR, "vulnerabilities")
SENSOR_SCRIPT = os.path.join("sensor.py")  # Correctly point to sensor.py
SCAN_INTERVAL = 10  # Time interval in seconds between scans

# MongoDB connection details
uri = "mongodb+srv://lamjulienrd:3zgtpYc34JaYU9l3@projectv.sxtlx.mongodb.net/?retryWrites=true&w=majority&appName=projectv"
client = MongoClient(uri)
db = client["projectv"]
programs_collection = db["programs"]
vulnerabilities_collection = db["vulnerabilities"]

# Tracks hashes of previously uploaded data to detect changes
previous_hashes = {"programs": None, "vulnerabilities": {}}

def get_file_hash(filepath):
    """Calculate MD5 hash of a file."""
    try:
        with open(filepath, 'rb') as file:
            file_content = file.read()
            return md5(file_content).hexdigest()
    except FileNotFoundError:
        return None

def get_or_create_sensor_id():
    """Get the sensor ID from the sensor_id.json file or create one if it doesn't exist."""
    try:
        if not os.path.exists(SENSOR_ID_FILE):
            # Generate a new sensor ID if the file does not exist
            new_sensor_id = str(uuid.uuid4())
            save_sensor_id(new_sensor_id)
            print(f"Generated new sensor ID: {new_sensor_id}")
            return new_sensor_id

        # Read the existing sensor ID
        with open(SENSOR_ID_FILE, 'r') as id_file:
            sensor_data = json.load(id_file)
            sensor_id = sensor_data.get("sensor_id", "").strip()
            if not sensor_id:
                raise ValueError("Sensor ID is empty in the JSON file.")
            return sensor_id
    except (FileNotFoundError, json.JSONDecodeError, ValueError) as e:
        # If the file is missing, corrupted, or the sensor ID is empty, generate a new one
        new_sensor_id = str(uuid.uuid4())
        save_sensor_id(new_sensor_id)
        print(f"Generated new sensor ID: {new_sensor_id}")
        return new_sensor_id

def save_sensor_id(sensor_id):
    """Save the sensor ID to the sensor_id.json file."""
    try:
        os.makedirs(CACHE_DIR, exist_ok=True)
        with open(SENSOR_ID_FILE, 'w') as id_file:
            json.dump({"sensor_id": sensor_id}, id_file)
    except Exception as e:
        print(f"Error saving sensor ID: {e}")

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
                programs_collection.update_one(
                    {"sensorId": sensor_id},
                    {"$set": document},
                    upsert=True
                )
                previous_hashes["programs"] = current_hash
                print(f"Programs data uploaded successfully for sensor ID: {sensor_id}")
        except FileNotFoundError:
            print(f"Programs file not found: {PROGRAMS_FILE}")
        except Exception as e:
            print(f"Error uploading programs data: {e}")

def upload_vulnerabilities(sensor_id):
    """Upload vulnerabilities data to the database linked with the given sensor ID if changes are detected."""
    global previous_hashes
    try:
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
                        vulnerabilities_collection.update_one(
                            {"sensorId": sensor_id, "sourceFile": filename},
                            {"$set": document},
                            upsert=True
                        )
                        previous_hashes["vulnerabilities"][filename] = current_hash
                        print(f"Vulnerabilities data uploaded successfully from file: {filename}")
    except FileNotFoundError:
        print(f"Vulnerabilities folder not found: {VULNERABILITIES_DIR}")
    except Exception as e:
        print(f"Error uploading vulnerabilities data: {e}")

def run_sensor_script():
    """Runs the sensor.py script and waits for it to complete."""
    try:
        print("Running sensor.py...")
        subprocess.run(["python", SENSOR_SCRIPT], check=True)
        print("sensor.py completed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error running {SENSOR_SCRIPT}: {e}")
    except FileNotFoundError:
        print(f"{SENSOR_SCRIPT} not found. Please ensure that {SENSOR_SCRIPT} is in the correct directory.")

def main():
    while True:
        # Step 1: Run sensor.py script
        run_sensor_script()

        # Step 2: Get or create the sensor ID
        sensor_id = get_or_create_sensor_id()
        if not sensor_id:
            print("Sensor ID is missing. Cannot proceed with uploads.")
            time.sleep(SCAN_INTERVAL)
            continue

        # Step 3: Upload programs data linked with the sensor ID (only if changed)
        upload_programs(sensor_id)

        # Step 4: Upload vulnerabilities data linked with the sensor ID (only if changed)
        upload_vulnerabilities(sensor_id)

        # Step 5: Wait for the next scan interval
        print(f"Waiting {SCAN_INTERVAL} seconds before the next scan...")
        time.sleep(SCAN_INTERVAL)

if __name__ == "__main__":
    main()
