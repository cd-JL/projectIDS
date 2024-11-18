import json
import time
import os
from pymongo import MongoClient
from dotenv import load_dotenv
import subprocess
import ctypes
import re

# MongoDB connection setup
script_dir = os.path.dirname(os.path.abspath(__file__))
parent_directory = os.path.join(script_dir, '..', 'projectVD')
env_path = os.path.join(parent_directory, '.env.local')
load_dotenv(env_path)

MONGODB_URI = os.getenv('MONGODB_URI')
if not MONGODB_URI:
    raise Exception("MONGODB_URI not found in environment variables.")

client = MongoClient(MONGODB_URI)
db = client['projectv']
sensors_collection = db['sensors']

CACHE_FILE_PATH = r"C:\Users\Jmast\OneDrive\Desktop\Scool\SAIT\Course Work\Capstone\projectIDS\scripts\cache\open_ports_configs.json"
CHECK_INTERVAL = 60  # Interval for monitoring database changes in seconds


def is_user_admin():
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        return False


def add_firewall_rule(rule_name, port, protocol='TCP', direction='in', action='allow'):
    try:
        check_command = [
            'netsh', 'advfirewall', 'firewall', 'show', 'rule',
            f'name="{rule_name}"'
        ]
        result = subprocess.run(check_command, capture_output=True, text=True)
        if 'No rules match the specified criteria' not in result.stdout:
            print(f"DEBUG: Firewall rule '{rule_name}' already exists.")
            return False

        add_command = [
            'netsh', 'advfirewall', 'firewall', 'add', 'rule',
            f'name="{rule_name}"',
            f'dir={direction}',
            f'action={action}',
            f'protocol={protocol}',
            f'localport={port}'
        ]
        subprocess.check_call(add_command)
        print(f"DEBUG: Firewall rule '{rule_name}' added successfully.")
        return True
    except subprocess.CalledProcessError as e:
        print(f"DEBUG: Failed to add firewall rule '{rule_name}': {e}")
        return False


def delete_firewall_rule(rule_name):
    try:
        delete_command = [
            'netsh', 'advfirewall', 'firewall', 'delete', 'rule',
            f'name="{rule_name}"'
        ]
        subprocess.check_call(delete_command)
        print(f"DEBUG: Firewall rule '{rule_name}' deleted successfully.")
        return True
    except subprocess.CalledProcessError as e:
        print(f"DEBUG: Failed to delete firewall rule '{rule_name}': {e}")
        return False


def open_port(port):
    protocols = ['TCP', 'UDP']
    for proto in protocols:
        add_firewall_rule(f"Allow_Port_{port}_{proto}_Inbound", port, proto, 'in', 'allow')
        add_firewall_rule(f"Allow_Port_{port}_{proto}_Outbound", port, proto, 'out', 'allow')
    print(f"DEBUG: Opened port {port}.")


def close_port(port):
    protocols = ['TCP', 'UDP']
    for proto in protocols:
        delete_firewall_rule(f"Allow_Port_{port}_{proto}_Inbound")
        delete_firewall_rule(f"Allow_Port_{port}_{proto}_Outbound")
    print(f"DEBUG: Closed port {port}.")


def load_cache():
    try:
        with open(CACHE_FILE_PATH, 'r') as f:
            cache = json.load(f)
        print("DEBUG: Loaded cache successfully.")
        return cache
    except FileNotFoundError:
        print("DEBUG: Cache file not found. Initializing with empty cache.")
        return {"services": {}}
    except json.JSONDecodeError as e:
        print(f"DEBUG: JSON decode error in cache file: {e}")
        return {"services": {}}


def save_cache(cache_data):
    try:
        with open(CACHE_FILE_PATH, 'w') as f:
            json.dump(cache_data, f, indent=4)
        print("DEBUG: Cache updated successfully.")
    except Exception as e:
        print(f"DEBUG: Exception occurred while saving cache: {e}")


def get_db_services():
    try:
        sensor = sensors_collection.find_one({})
        if not sensor:
            print("DEBUG: No sensor data found in the database.")
            return {}

        return {service['name']: service for service in sensor.get("services", [])}
    except Exception as e:
        print(f"DEBUG: Exception occurred while fetching data from MongoDB: {e}")
        return {}


def compare_and_apply_changes(db_services, cache_services):
    services_to_open = []
    services_to_close = []

    for name, service in db_services.items():
        if name not in cache_services or cache_services[name]['status'] != service['status']:
            if service['status'].startswith('Port') and 'open' in service['status']:
                services_to_open.append(service['port'])
            elif service['status'].startswith('Port') and 'closed' in service['status']:
                services_to_close.append(service['port'])

    for name, service in cache_services.items():
        if name not in db_services:
            services_to_close.append(service['port'])

    # Apply changes
    for port in services_to_open:
        open_port(port)

    for port in services_to_close:
        close_port(port)

    return db_services


def main_loop():
    if not is_user_admin():
        print("DEBUG: This script requires administrative privileges.")
        sys.exit(1)

    cache = load_cache()
    cache_services = cache.get("services", {})

    while True:
        print("DEBUG: Checking database for changes...")
        db_services = get_db_services()

        if not db_services:
            print("DEBUG: No services retrieved. Skipping this cycle.")
        else:
            updated_services = compare_and_apply_changes(db_services, cache_services)
            cache["services"] = updated_services
            save_cache(cache)

        print(f"DEBUG: Sleeping for {CHECK_INTERVAL} seconds...\n")
        time.sleep(CHECK_INTERVAL)


if __name__ == '__main__':
    try:
        main_loop()
    except KeyboardInterrupt:
        print("\nDEBUG: Script terminated by user.")
        sys.exit(0)
    except Exception as e:
        print(f"DEBUG: Unexpected exception: {e}")
        sys.exit(1)
