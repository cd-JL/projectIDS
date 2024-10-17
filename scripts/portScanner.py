import socket
import json
import ssl

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

# Function to check if a port is open
def check_port(host, port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(1)  # Timeout after 1 second
        try:
            s.connect((host, port))
            return True
        except (socket.timeout, socket.error):
            return False

# Function to check TLS version
def check_tls_version(host):
    context = ssl.create_default_context()
    try:
        with socket.create_connection((host, 443), timeout=3) as sock:
            with context.wrap_socket(sock, server_hostname=host) as ssock:
                protocol = ssock.version()
                return protocol
    except (ssl.SSLError, socket.timeout):
        return None

# Function to differentiate between good and bad HTTP/HTTPS connections
def check_http_https(host):
    http_open = check_port(host, 80)
    https_open = check_port(host, 443)
    tls_version = check_tls_version(host) if https_open else None
    
    results = {}
    if http_open:
        results['HTTP'] = "Port 80 is open. Check if it redirects to HTTPS."
    if https_open:
        if tls_version in ['TLSv1.2', 'TLSv1.3']:
            results['HTTPS'] = f"Port 443 is open with {tls_version} (good)"
        else:
            results['HTTPS'] = f"Port 443 is open with {tls_version} (outdated TLS version)"
    return results

# Function to check all high-risk ports and HTTP/HTTPS
def check_ports_and_tls(host='127.0.0.1'):
    open_ports = {}

    # Check high-risk ports
    for service, port in high_risk_ports.items():
        if check_port(host, port):
            open_ports[service] = port
    
    # Check HTTP/HTTPS
    http_https_results = check_http_https(host)
    if http_https_results:
        open_ports.update(http_https_results)
    
    return open_ports

# Save the results to a JSON file
def save_to_json(data, filename='open_ports_tls.json'):
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)

if __name__ == "__main__":
    host_to_check = '127.0.0.1'  # Host computer (localhost)
    open_ports = check_ports_and_tls(host_to_check)
    
    if open_ports:
        print(f"Open high-risk ports or HTTP/HTTPS issues found: {open_ports}")
        save_to_json(open_ports)
    else:
        print("No high-risk ports or TLS issues found.")
