import json
import subprocess
import os
import time
from pymongo import MongoClient
from dotenv import load_dotenv

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

CACHE_FILE_PATH = os.path.join(script_dir, "cache", "open_ports_configs.json")


def debug(message):
    """Print debug messages with a prefix."""
    print(f"DEBUG: {message}")


def load_cache():
    """Load the local cache file."""
    try:
        with open(CACHE_FILE_PATH, 'r') as f:
            cache = json.load(f)
        debug(f"Cache content loaded successfully: {cache}")
        return cache
    except FileNotFoundError:
        debug("Cache file not found. Returning empty cache.")
        return {}
    except json.JSONDecodeError as e:
        debug(f"JSON decode error in cache file: {e}")
        return {}
    except Exception as e:
        debug(f"Error loading cache: {e}")
        return {}


def get_db_services():
    debug("Retrieving services from MongoDB.")
    try:
        sensor = sensors_collection.find_one({})
        if not sensor:
            debug("No sensor data found in the database.")
            return {}

        # Print raw document
        debug(f"Raw MongoDB document: {sensor}")

        services = sensor.get("services", [])
        if not isinstance(services, list):
            debug("Services field is not a list. Returning empty.")
            return {}

        # Process services
        db_services = {service['name']: service for service in services if 'name' in service and 'port' in service}
        debug(f"Processed db_services: {db_services}")
        return db_services
    except Exception as e:
        debug(f"Error retrieving services from MongoDB: {e}")
        return {}



def add_firewall_rule(rule_name, port, protocol='TCP', direction='in', action='allow', profile='any'):
    """Add a firewall rule."""
    try:
        check_command = ['netsh', 'advfirewall', 'firewall', 'show', 'rule', f'name="{rule_name}"']
        result = subprocess.run(check_command, capture_output=True, text=True)
        if 'No rules match the specified criteria' not in result.stdout:
            debug(f"Firewall rule '{rule_name}' already exists.")
            return False
        add_command = [
            'netsh', 'advfirewall', 'firewall', 'add', 'rule',
            f'name="{rule_name}"',
            f'dir={direction}', f'action={action}',
            f'protocol={protocol}', f'localport={port}', f'profile={profile}'
        ]
        subprocess.check_call(add_command)
        debug(f"Firewall rule '{rule_name}' added successfully.")
        return True
    except subprocess.CalledProcessError as e:
        debug(f"Failed to add firewall rule '{rule_name}': {e}")
        return False


def delete_firewall_rule(rule_name):
    """Delete the specified firewall rule."""
    try:
        delete_command = ['netsh', 'advfirewall', 'firewall', 'delete', 'rule', f'name="{rule_name}"']
        subprocess.check_call(delete_command)
        debug(f"Firewall rule '{rule_name}' deleted successfully.")
        return True
    except subprocess.CalledProcessError as e:
        debug(f"Failed to delete firewall rule '{rule_name}': {e}")
        return False


def delete_all_rules_for_port(port):
    """Delete all firewall rules for a specific port."""
    try:
        list_command = ['netsh', 'advfirewall', 'firewall', 'show', 'rule', 'name=all']
        result = subprocess.run(list_command, capture_output=True, text=True)
        rules_to_delete = [
            line.split(':', 1)[1].strip().strip('"')
            for line in result.stdout.splitlines() if line.startswith("Rule Name:")
        ]
        for rule in rules_to_delete:
            delete_firewall_rule(rule)
        debug(f"Deleted all rules for port {port}.")
        return True
    except Exception as e:
        debug(f"Error deleting rules for port {port}: {e}")
        return False


def open_port(port):
    """Open the specified port."""
    debug(f"Opening port: {port}")
    delete_all_rules_for_port(port)
    add_firewall_rule(f"Allow_Port_{port}_TCP", port, protocol='TCP', direction='in', action='allow')
    add_firewall_rule(f"Allow_Port_{port}_UDP", port, protocol='UDP', direction='in', action='allow')


def close_port(port):
    """Close the specified port."""
    debug(f"Closing port: {port}")
    delete_all_rules_for_port(port)
    add_firewall_rule(f"Block_Port_{port}_TCP", port, protocol='TCP', direction='in', action='block')
    add_firewall_rule(f"Block_Port_{port}_UDP", port, protocol='UDP', direction='in', action='block')


def sync_services(db_services, cache_services):
    """
    Sync services between the database and cache, focusing only on services.
    """
    debug("Syncing services between database and cache.")
    services_to_update = {}
    ports_to_open = []
    ports_to_close = []

    # Compare database and cache services
    for name, cache_service in cache_services.items():
        if name == "all_open_ports" or "port" not in cache_service:
            continue  # Skip unrelated entries
        db_service = db_services.get(name)
        if db_service:
            # Compare statuses to decide actions
            if cache_service['status'] != db_service['status']:
                services_to_update[name] = cache_service
                if cache_service['status'] == "Port is open":
                    ports_to_open.append(cache_service['port'])
                else:
                    ports_to_close.append(cache_service['port'])
        else:
            # Add missing service to open ports
            ports_to_open.append(cache_service['port'])

    # Apply port updates
    for port in ports_to_close:
        close_port(port)
    for port in ports_to_open:
        open_port(port)

    debug(f"Services to update: {services_to_update}")
    debug(f"Ports to open: {ports_to_open}")
    debug(f"Ports to close: {ports_to_close}")



def main_loop():
    """Main loop to monitor and sync services."""
    debug("Starting main loop.")
    while True:
        try:
            db_services = get_db_services()
            cache = load_cache()
            cache_services = {name: service for name, service in cache.items() if isinstance(service, dict) and "port" in service}
            sync_services(db_services, cache_services)
            debug("Sleeping for 5 seconds.")
            time.sleep(5)
        except KeyboardInterrupt:
            debug("Main loop terminated by user.")
            break
        except Exception as e:
            debug(f"Error in main loop: {e}")


if __name__ == '__main__':
    main_loop()
