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

# List of weak ciphers to check for in TLS 1.2
weak_ciphers = ['RC4', '3DES', 'AES-CBC']

# Check if a port is open
def check_port(host, port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(1)  # Timeout after 1 second
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
        return None

# Check if HTTP redirects to HTTPS
def check_http(host):
    try:
        response = requests.get(f'http://{host}', timeout=3)
        if response.history and response.url.startswith('https://'):
            return "HTTP redirects to HTTPS (good)"
        else:
            return "HTTP does not redirect to HTTPS (potential risk)"
    except requests.RequestException:
        return "Unable to connect to HTTP"

# Check SSH for weak ciphers or outdated protocols
def check_ssh(host):
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(host, port=22, username='invalid', password='invalid', timeout=3)
    except paramiko.AuthenticationException:
        # Authentication is expected to fail, but check if the server supports outdated ciphers
        try:
            transport = client.get_transport()
            if transport:
                ciphers = transport.get_security_options().ciphers
                if 'aes128-cbc' in ciphers or '3des-cbc' in ciphers:
                    return "SSH supports outdated ciphers (vulnerable)"
                else:
                    return "SSH uses secure ciphers (good)"
        except:
            return "SSH configuration could not be fully determined"
    except:
        return "Unable to connect to SSH"

# Check SMB configuration (e.g., if SMBv1 is enabled)
def check_smb(host):
    # SMB checks would require third-party tools or library integration (e.g., impacket)
    return "SMB checks not implemented in this example"

# General check for all ports
def check_ports_and_configs(host='127.0.0.1'):
    results = {}

    # Check high-risk ports
    for service, port in high_risk_ports.items():
        if check_port(host, port):
            if service == 'HTTP':
                results['HTTP'] = check_http(host)
            elif service == 'HTTPS':
                results['HTTPS'] = check_tls_version_and_ciphers(host)
            elif service == 'SSH':
                results['SSH'] = check_ssh(host)
            else:
                results[service] = f"Port {port} is open (basic check, configuration not implemented)"
    
    return results

# Save the results to a JSON file
def save_to_json(data, filename='open_ports_configs.json'):
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)

if __name__ == "__main__":
    host_to_check = '127.0.0.1'  # Host computer (localhost)
    open_ports = check_ports_and_configs(host_to_check)
    
    if open_ports:
        print(f"Open high-risk ports and configuration issues found: {open_ports}")
        save_to_json(open_ports)
    else:
        print("No high-risk ports or configuration issues found.")