import socket
import json
import ssl
import os
import requests  # Ensure this is installed: `pip install requests`
import paramiko  # Ensure this is installed: `pip install paramiko`
import psutil  # Ensure this is installed: `pip install psutil`

# Full list of high-risk ports (as per common services vulnerable to attacks)
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

# List of weak ciphers to check for in TLS 1.2
weak_ciphers = ['RC4', '3DES', 'AES-CBC']

# Directory setup for saving data in cache
script_dir = os.path.dirname(os.path.abspath(__file__))
CACHE_DIR = os.path.join(script_dir, "cache")
os.makedirs(CACHE_DIR, exist_ok=True)
RESULTS_FILE = os.path.join(CACHE_DIR, "open_ports_configs.json")

# Check if a port is open
def check_port(host, port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(3)  # Timeout after 3 seconds
        try:
            s.connect((host, port))
            return True
        except (socket.timeout, socket.error):
            return False

# Check TLS version and cipher suites for HTTPS (port 443)
def check_tls_version_and_ciphers(host):
    context = ssl.create_default_context()
    try:
        with socket.create_connection((host, 443), timeout=3) as sock:
            with context.wrap_socket(sock, server_hostname=host) as ssock:
                protocol = ssock.version()  # Get TLS version
                cipher = ssock.cipher()  # Get the cipher suite
                cipher_suite = cipher[0]

                if protocol == 'TLSv1.2':
                    # Check if the cipher suite is weak
                    for weak in weak_ciphers:
                        if weak in cipher_suite:
                            return f"Port 443 is open with {protocol} using weak cipher {cipher_suite} (vulnerable)"
                    return f"Port 443 is open with {protocol} using strong cipher {cipher_suite} (good)"
                elif protocol == 'TLSv1.3':
                    return f"Port 443 is open with {protocol} (good)"
                else:
                    return f"Port 443 is open with outdated protocol {protocol} (vulnerable)"
    except (ssl.SSLError, socket.timeout):
        return "Port 443 is open but could not determine TLS version or cipher"

# Check if HTTP redirects to HTTPS
def check_http(host):
    try:
        response = requests.get(f'http://{host}', timeout=3)
        if response.history and response.url.startswith('https://'):
            return "Port 80 is open and HTTP redirects to HTTPS (good)"
        else:
            return "Port 80 is open but HTTP does not redirect to HTTPS (potential risk)"
    except requests.RequestException:
        return "Port 80 is open but unable to determine if HTTP redirects"

# General check for all ports
def check_ports_and_configs(host='127.0.0.1'):
    results = {}
    all_open_ports = []

    # Check high-risk ports
    for service, port in high_risk_ports.items():
        print(f"Checking {service} on port {port}...")
        if check_port(host, port):
            if service == 'HTTP':
                results['HTTP'] = {
                    'port': port,
                    'status': check_http(host),
                    'dangerous': True
                }
            elif service == 'HTTPS':
                results['HTTPS'] = {
                    'port': port,
                    'status': check_tls_version_and_ciphers(host),
                    'dangerous': False
                }
            else:
                results[service] = {
                    'port': port,
                    'status': f"Port {port} is open (basic check, configuration not implemented)",
                    'dangerous': True
                }
        else:
            results[service] = {
                'port': port,
                'status': f"Port {port} is closed",
                'dangerous': False
            }
    
    # Get all open ports on the computer
    for conn in psutil.net_connections():
        if conn.status == 'LISTEN' and conn.laddr.port not in all_open_ports:
            all_open_ports.append(conn.laddr.port)

    results['all_open_ports'] = all_open_ports
    return results

# Save the results to a JSON file
def save_to_json(data, filename=RESULTS_FILE):
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)

if __name__ == "__main__":
    host_to_check = '127.0.0.1'  # Change to local IP if needed
    open_ports = check_ports_and_configs(host_to_check)
    
    if open_ports:
        print(f"Open high-risk ports and configuration issues found: {open_ports}")
        save_to_json(open_ports)
    else:
        print("No high-risk ports or configuration issues found.")
