import subprocess
import re
import json
import os

# High-risk ports
high_risk_ports = {
    'FTP': 21,
    'SSH': 22,
    'Telnet': 23,
    'SMTP': 25,
    'DNS': 53,
    'TFTP': 69,
    'Finger': 79,
    'HTTP': 80,
    'POP3': 110,
    'IMAP': 143,
    'SNMP': 161,
    'LDAP': 389,
    'HTTPS': 443,
    'SMB': 445,
    'Microsoft SQL Server': 1433,
    'Oracle DB': 1521,
    'MySQL': 3306,
    'RDP': 3389,
    'PostgreSQL': 5432,
    'VNC': 5900,
    'X11': 6000,
    'SIP': 5060,
    'Rsync': 873,
    'NFS': 2049,
    'Redis': 6379,
    'Elasticsearch': 9200,
    'MongoDB': 27017,
    'Cassandra': 9042,
    'Memcached': 11211,
    'Docker': 2375,
    'Kubernetes API': 6443,
    'Kubernetes Etcd': 2379,
    'RADIUS': 1812,
    'IPSec': 4500,
    'CUPS': 631,
    'SMTPS': 465,
    'IMAPS': 993,
    'POP3S': 995,
}

# Directory setup for saving data in cache
script_dir = os.path.dirname(os.path.abspath(__file__))
CACHE_DIR = os.path.join(script_dir, "cache")
os.makedirs(CACHE_DIR, exist_ok=True)
RESULTS_FILE = os.path.join(CACHE_DIR, "open_ports_configs.json")

def get_open_ports():
    try:
        command = ['netstat', '-ano']
        print("Running netstat command to fetch open ports...")
        result = subprocess.run(command, capture_output=True, text=True, shell=True)
        if result.returncode != 0:
            print(f"Error running netstat command: {result.stderr}")
            return None
        print("Open ports fetched successfully.")
        return result.stdout
    except Exception as e:
        print(f"Exception occurred while fetching open ports: {e}")
        return None

def parse_netstat_output(netstat_output):
    all_open_ports = set()
    services = {}

    print("Parsing netstat output...")
    lines = netstat_output.splitlines()
    for line in lines:
        # Skip header lines
        if line.strip() == '' or 'Proto' in line or 'Active Connections' in line:
            continue
        parts = line.split()
        if len(parts) >= 4:
            proto = parts[0]
            local_address = parts[1]
            state = parts[3] if proto == 'TCP' else 'LISTENING'
            # We are interested in listening ports
            if state == 'LISTENING':
                # Extract port
                if ':' in local_address:
                    address, port_str = local_address.rsplit(':', 1)
                    if port_str.isdigit():
                        port = int(port_str)
                        all_open_ports.add(port)

                        # Check if the port is in the high-risk list
                        for service_name, high_risk_port in high_risk_ports.items():
                            if port == high_risk_port:
                                print(f"High-Risk Port Found: {service_name} on port {port}")
                                services[service_name] = {
                                    "port": port,
                                    "status": f"Port {port} is open",
                                    "dangerous": True
                                }
    print(f"All Open Ports: {sorted(all_open_ports)}")
    print(f"Services Detected: {json.dumps(services, indent=4)}")
    return sorted(all_open_ports), services

def sanitize_results(all_open_ports, services):
    sanitized = {
        "all_open_ports": all_open_ports,
    }
    sanitized.update(services)  # Merge services into the sanitized data
    print(f"Sanitized Data: {json.dumps(sanitized, indent=4)}")
    return sanitized

if __name__ == "__main__":
    netstat_output = get_open_ports()
    if netstat_output is None or not netstat_output.strip():
        print("Error: No output received or an error occurred.")
    else:
        all_open_ports, services = parse_netstat_output(netstat_output)
        sanitized_data = sanitize_results(all_open_ports, services)

        # Save sanitized data to a JSON file
        with open(RESULTS_FILE, 'w') as file:
            json.dump(sanitized_data, file, indent=4)
        print(f"Sanitized data saved to {RESULTS_FILE}")
