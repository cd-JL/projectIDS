import json
import subprocess
import os
import time
import logging
from typing import Dict, List, Set, Optional, Tuple
from pymongo import MongoClient
from dotenv import load_dotenv

# Add custom log level for firewall changes
FIREWALL_CHANGE = 25  # Between INFO (20) and WARNING (30)
logging.addLevelName(FIREWALL_CHANGE, 'FIREWALL')

# Add a method to logger for the new level
def firewall_change(self, message, *args, **kwargs):
    if self.isEnabledFor(FIREWALL_CHANGE):
        self._log(FIREWALL_CHANGE, message, args, **kwargs)

logging.Logger.firewall_change = firewall_change

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

class FirewallManager:
    @staticmethod
    def run_as_admin(command: str) -> Tuple[bool, str]:
        """Execute a command with elevated privileges."""
        try:
            # Create a powershell command that runs netsh with elevation
            ps_command = f'Start-Process netsh -ArgumentList "{command}" -Verb RunAs -Wait'
            
            result = subprocess.run(
                ['powershell', '-Command', ps_command],
                capture_output=True,
                text=True,
                shell=True  # Needed for proper elevation
            )
            
            return result.returncode == 0, result.stdout + result.stderr
        except Exception as e:
            return False, str(e)

    @staticmethod
    def verify_rule_exists(port: int) -> Tuple[bool, str]:
        """Verify if a firewall rule exists for the given port and get its action."""
        try:
            # Use PowerShell to check firewall rules
            ps_command = (
                f'Get-NetFirewallRule -DisplayName "Port_{port}" | '
                'Select-Object -ExpandProperty Action'
            )
            
            result = subprocess.run(
                ['powershell', '-Command', ps_command],
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0 and result.stdout.strip():
                action = result.stdout.strip().lower()
                if "allow" in action:
                    return True, "allow"
                elif "block" in action:
                    return True, "block"
            
            return False, "none"
        except Exception as e:
            logger.error(f"Error verifying rule: {e}")
            return False, "error"

    @staticmethod
    def close_port(port: int) -> bool:
        """Close a port in the firewall."""
        logger.firewall_change(f"🔒 Closing port {port}")
        
        try:
            # Remove existing rules for this port
            ps_command = f'Remove-NetFirewallRule -DisplayName "Port_{port}" -ErrorAction SilentlyContinue'
            subprocess.run(['powershell', '-Command', ps_command], check=False)
            
            # Create new blocking rule
            ps_command = (
                f'New-NetFirewallRule -DisplayName "Port_{port}" '
                f'-Direction Inbound -Action Block -Protocol TCP '
                f'-LocalPort {port} -Enabled True'
            )
            
            result = subprocess.run(
                ['powershell', '-Command', ps_command],
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                logger.firewall_change(f"✅ Successfully blocked port {port}")
                return True
            else:
                logger.error(f"Failed to block port {port}: {result.stderr}")
                return False
                
        except Exception as e:
            logger.error(f"Error blocking port {port}: {e}")
            return False

    @staticmethod
    def open_port(port: int) -> bool:
        """Open a port in the firewall."""
        logger.firewall_change(f"🔓 Opening port {port}")
        
        try:
            # Remove existing rules for this port
            ps_command = f'Remove-NetFirewallRule -DisplayName "Port_{port}" -ErrorAction SilentlyContinue'
            subprocess.run(['powershell', '-Command', ps_command], check=False)
            
            # Create new allowing rule
            ps_command = (
                f'New-NetFirewallRule -DisplayName "Port_{port}" '
                f'-Direction Inbound -Action Allow -Protocol TCP '
                f'-LocalPort {port} -Enabled True'
            )
            
            result = subprocess.run(
                ['powershell', '-Command', ps_command],
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                logger.firewall_change(f"✅ Successfully opened port {port}")
                return True
            else:
                logger.error(f"Failed to open port {port}: {result.stderr}")
                return False
                
        except Exception as e:
            logger.error(f"Error opening port {port}: {e}")
            return False

    @staticmethod
    def get_current_firewall_state(port: int) -> str:
        """Get the current state of a port in the firewall."""
        try:
            ps_command = (
                f'Get-NetFirewallRule -DisplayName "Port_{port}" | '
                'Select-Object -ExpandProperty Action'
            )
            
            result = subprocess.run(
                ['powershell', '-Command', ps_command],
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0 and result.stdout.strip():
                action = result.stdout.strip().lower()
                return f"Port {port} is {'open' if 'allow' in action else 'closed'}"
            
            return f"Port {port} has no rule"
            
        except Exception as e:
            logger.error(f"Error getting firewall state: {e}")
            return f"Port {port} state unknown"

class ServiceManager:
    def __init__(self, mongodb_uri: str, cache_path: str):
        self.client = MongoClient(mongodb_uri)
        self.db = self.client['projectv']
        self.cache_path = cache_path
        self.firewall = FirewallManager()

    def load_cache(self) -> Dict:
        """Load the current cache from file."""
        try:
            if os.path.exists(self.cache_path):
                with open(self.cache_path, 'r') as f:
                    return json.load(f)
            return {}
        except Exception as e:
            logger.error(f"Error loading cache: {e}")
            return {}

    def save_cache(self, cache_data: Dict) -> None:
        """Save the current cache to file."""
        try:
            os.makedirs(os.path.dirname(self.cache_path), exist_ok=True)
            with open(self.cache_path, 'w') as f:
                json.dump(cache_data, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving cache: {e}")

    def get_db_services(self) -> List[Dict]:
        """Retrieve services from MongoDB."""
        try:
            sensor = self.db.sensors.find_one({})
            if sensor:
                services = sensor.get('services', [])
                logger.info(f"Found {len(services)} services in database")
                return services
            logger.warning("No sensor data found in database")
            return []
        except Exception as e:
            logger.error(f"Database error: {e}")
            return []

    def update_cache_service_status(self, service_name: str, port: int, is_open: bool) -> None:
        """Update a specific service's status in the cache."""
        try:
            cache = self.load_cache()
            if service_name in cache:
                actual_state = self.firewall.get_current_firewall_state(port)
                cache[service_name]['status'] = actual_state
                logger.info(f"Updating cache status for {service_name} to match firewall: {actual_state}")
                self.save_cache(cache)
        except Exception as e:
            logger.error(f"Error updating cache status: {e}")

    def verify_and_update_service(self, service_name: str, port: int) -> None:
        """Verify firewall state matches cache and update if needed."""
        try:
            cache = self.load_cache()
            if service_name in cache:
                cache_status = cache[service_name]['status']
                actual_state = self.firewall.get_current_firewall_state(port)
                
                if cache_status != actual_state:
                    logger.warning(f"Mismatch detected for {service_name}:")
                    logger.warning(f"Cache status: {cache_status}")
                    logger.warning(f"Actual state: {actual_state}")
                    cache[service_name]['status'] = actual_state
                    self.save_cache(cache)
        except Exception as e:
            logger.error(f"Error verifying service state: {e}")

    def sync_services(self, db_services: List[Dict], cache: Dict) -> Tuple[Set[int], Set[int]]:
        ports_to_open = set()
        ports_to_close = set()
        
        # Create lookup dictionary for DB services
        db_service_dict = {
            service['name']: service
            for service in db_services
            if 'name' in service and 'port' in service and 'status' in service
        }

        # First, verify current firewall states
        for name, cache_service in cache.items():
            if name == 'all_open_ports':
                continue
            if not isinstance(cache_service, dict) or 'port' not in cache_service:
                continue
                
            self.verify_and_update_service(name, cache_service['port'])

        # Now compare and determine needed changes
        for name, cache_service in cache.items():
            if name == 'all_open_ports':
                continue
                
            if not isinstance(cache_service, dict) or 'port' not in cache_service:
                continue

            port = cache_service['port']
            db_service = db_service_dict.get(name)
            
            if db_service:
                # Service exists in both DB and cache
                current_status = cache_service['status']
                expected_status = db_service['status']
                
                logger.info(f"Checking {name}:")
                logger.info(f"  Current status: {current_status}")
                logger.info(f"  Expected status: {expected_status}")
                logger.info(f"  Firewall state: {self.firewall.get_current_firewall_state(port)}")
                
                if current_status != expected_status:
                    if "is open" in expected_status:
                        ports_to_open.add(port)
                    else:
                        ports_to_close.add(port)
            else:
                # Service in cache but not in DB - should be closed
                ports_to_close.add(port)

        return ports_to_open, ports_to_close

def main():
    # Load environment variables
    script_dir = os.path.dirname(os.path.abspath(__file__))
    parent_directory = os.path.join(script_dir, '..', 'projectVD')
    env_path = os.path.join(parent_directory, '.env.local')
    
    logger.info(f"Loading environment from: {env_path}")
    load_dotenv(env_path)

    mongodb_uri = os.getenv('MONGODB_URI')
    if not mongodb_uri:
        logger.error("MONGODB_URI not found in environment variables")
        return

    cache_path = os.path.join(script_dir, "cache", "open_ports_configs.json")
    logger.info(f"Using cache path: {cache_path}")

    service_manager = ServiceManager(mongodb_uri, cache_path)
    cycle_count = 0

    logger.info("Starting monitoring loop...")
    
    try:
        while True:
            cycle_count += 1
            logger.info(f"\nStarting cycle {cycle_count}")
            
            db_services = service_manager.get_db_services()
            current_cache = service_manager.load_cache()
            
            ports_to_open, ports_to_close = service_manager.sync_services(db_services, current_cache)

            if ports_to_open or ports_to_close:
                # Handle ports that need to be closed
                for port in ports_to_close:
                    if service_manager.firewall.close_port(port):
                        for name, service in current_cache.items():
                            if name != 'all_open_ports' and service.get('port') == port:
                                service_manager.update_cache_service_status(name, port, False)
                    else:
                        logger.error(f"Failed to close port {port}")

                # Handle ports that need to be opened
                for port in ports_to_open:
                    if service_manager.firewall.open_port(port):
                        for name, service in current_cache.items():
                            if name != 'all_open_ports' and service.get('port') == port:
                                service_manager.update_cache_service_status(name, port, True)
                    else:
                        logger.error(f"Failed to open port {port}")

                logger.firewall_change("🔄 Port updates completed")
            else:
                logger.info("No changes needed")

            logger.info(f"Cycle {cycle_count} complete. Waiting 5 seconds...")
            time.sleep(5)

    except KeyboardInterrupt:
        logger.info("Monitoring stopped by user")
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
    finally:
        service_manager.client.close()
        logger.info("MongoDB connection closed")

if __name__ == "__main__":
    main()