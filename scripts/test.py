import subprocess
import sys
import socket
import ctypes
import os
import multiprocessing
import signal
import re

def is_user_admin():
    """
    Check if the script is running with administrative privileges.
    Returns True if admin, False otherwise.
    """
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        return False

def add_firewall_rule(rule_name, port, protocol='TCP', direction='in', action='allow', remote_ports=None, profile='any'):
    """
    Add a firewall rule with the specified parameters.
    """
    try:
        # Check if the rule already exists
        check_command = [
            'netsh', 'advfirewall', 'firewall', 'show', 'rule',
            f'name="{rule_name}"'
        ]
        result = subprocess.run(check_command, capture_output=True, text=True)
        if 'No rules match the specified criteria' not in result.stdout:
            print(f"A firewall rule named '{rule_name}' already exists.")
            return False

        # Build the add command with quoted parameters
        add_command = [
            'netsh', 'advfirewall', 'firewall', 'add', 'rule',
            f'name="{rule_name}"',
            f'dir={direction}',
            f'action={action}',
            f'protocol={protocol}',
            f'localport={port}',
            f'profile={profile}'
        ]

        if remote_ports:
            add_command.append(f'remoteport={remote_ports}')

        subprocess.check_call(add_command)
        print(f"Firewall rule '{rule_name}' added successfully.")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Failed to add firewall rule '{rule_name}': {e}")
        return False
    except Exception as e:
        print(f"Exception occurred while adding firewall rule '{rule_name}': {e}")
        return False

def delete_firewall_rule(rule_name):
    """
    Delete the specified firewall rule.
    """
    try:
        delete_command = [
            'netsh', 'advfirewall', 'firewall', 'delete', 'rule',
            f'name="{rule_name}"'
        ]
        subprocess.check_call(delete_command)
        print(f"Firewall rule '{rule_name}' deleted successfully.")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Failed to delete firewall rule '{rule_name}': {e}")
        return False
    except Exception as e:
        print(f"Exception occurred while deleting firewall rule '{rule_name}': {e}")
        return False

def delete_all_rules_for_port(port):
    """
    Delete all firewall rules associated with the specified port based on naming convention.
    """
    try:
        # List all rules
        list_command = [
            'netsh', 'advfirewall', 'firewall', 'show', 'rule', 'name=all'
        ]
        result = subprocess.run(list_command, capture_output=True, text=True)

        # Regex patterns to match rule names for allow and block
        allow_pattern = re.compile(rf'^Allow_Port_{port}_(TCP|UDP)_\w+$', re.IGNORECASE)
        block_pattern = re.compile(rf'^Block_Port_{port}_(TCP|UDP)_\w+$', re.IGNORECASE)

        rules_to_delete = []

        for line in result.stdout.splitlines():
            if line.startswith("Rule Name:"):
                rule_name = line.split(":", 1)[1].strip().strip('"')
                if allow_pattern.match(rule_name) or block_pattern.match(rule_name):
                    rules_to_delete.append(rule_name)

        # Delete the rules
        for rule in rules_to_delete:
            delete_firewall_rule(rule)

        if not rules_to_delete:
            print(f"No firewall rules found to delete for port {port}.")
        return True
    except Exception as e:
        print(f"Exception occurred while deleting all rules for port {port}: {e}")
        return False

def start_tcp_server(port):
    """
    Start a simple TCP HTTP server on the specified port.
    """
    import http.server
    import socketserver

    class Handler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, format, *args):
            pass  # Suppress logging

    with socketserver.TCPServer(("", port), Handler) as httpd:
        print(f"TCP server started on port {port}.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
        finally:
            httpd.server_close()
            print(f"TCP server on port {port} has been stopped.")

def start_udp_server(port):
    """
    Start a simple UDP echo server on the specified port.
    """
    import socket

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        sock.bind(('localhost', port))
    except Exception as e:
        print(f"Failed to bind UDP server on port {port}: {e}")
        return

    print(f"UDP server started on port {port}.")

    try:
        while True:
            data, addr = sock.recvfrom(1024)
            if data:
                sock.sendto(data, addr)
    except KeyboardInterrupt:
        print("UDP server shutting down.")
    finally:
        sock.close()
        print(f"UDP server on port {port} has been stopped.")

def start_server_process(port, protocol='TCP'):
    """
    Start the server as a separate process.
    """
    if protocol.upper() == 'TCP':
        process = multiprocessing.Process(target=start_tcp_server, args=(port,), daemon=True)
    elif protocol.upper() == 'UDP':
        process = multiprocessing.Process(target=start_udp_server, args=(port,), daemon=True)
    else:
        print(f"Unsupported protocol: {protocol}")
        return None
    process.start()
    print(f"Started {protocol.upper()} server on port {port} with PID {process.pid}.")
    return process.pid

def find_and_terminate_servers(port, protocol='TCP'):
    """
    Find and terminate server processes running on the specified port and protocol.
    """
    try:
        # Use netstat to find PIDs listening on the specified port and protocol
        protocol_upper = protocol.upper()
        if protocol_upper not in ['TCP', 'UDP']:
            print(f"Unsupported protocol: {protocol}")
            return False

        # Execute netstat command
        netstat_command = ['netstat', '-ano', '-p', protocol_upper]
        result = subprocess.run(netstat_command, capture_output=True, text=True)
        
        # Define regex based on protocol
        if protocol_upper == 'TCP':
            pattern = re.compile(rf'^\s*TCP\s+[\d.]+:{port}\s+[\d.]+:\d+\s+LISTENING\s+(\d+)', re.MULTILINE)
        else:  # UDP
            pattern = re.compile(rf'^\s*UDP\s+[\d.]+:{port}\s+[\d.]+:\d+\s+(\d+)', re.MULTILINE)

        pids = pattern.findall(result.stdout)
        if not pids:
            print(f"No {protocol_upper} server processes found on port {port}.")
            return False

        for pid in pids:
            try:
                pid_int = int(pid)
                # Terminate the process
                terminate_command = ['taskkill', '/PID', pid, '/F']
                terminate_result = subprocess.run(terminate_command, capture_output=True, text=True)
                if terminate_result.returncode == 0:
                    print(f"Terminated {protocol_upper} server process with PID {pid} on port {port}.")
                else:
                    print(f"Failed to terminate process with PID {pid}: {terminate_result.stderr.strip()}")
            except Exception as e:
                print(f"Failed to terminate process with PID {pid}: {e}")

        return True
    except Exception as e:
        print(f"Exception occurred while terminating server processes: {e}")
        return False

def test_port(port, protocol='TCP'):
    """
    Test if the specified port is open by attempting to connect.
    For TCP: attempts to establish a connection.
    For UDP: sends a packet and waits for an echo response.
    """
    try:
        if protocol.upper() == 'TCP':
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(2)
            result = sock.connect_ex(('localhost', port))
            if result == 0:
                print(f"Port {port} ({protocol.upper()}) is open.")
            else:
                print(f"Port {port} ({protocol.upper()}) is closed or blocked.")
            sock.close()
        elif protocol.upper() == 'UDP':
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.settimeout(2)
            try:
                message = b'Test'
                sock.sendto(message, ('localhost', port))
                data, server = sock.recvfrom(1024)
                if data == message:
                    print(f"Port {port} ({protocol.upper()}) is open and responsive.")
                else:
                    print(f"Port {port} ({protocol.upper()}) did not respond as expected.")
            except socket.timeout:
                print(f"Port {port} ({protocol.upper()}) is closed or blocked (no response).")
            finally:
                sock.close()
        else:
            print(f"Unsupported protocol for testing: {protocol}")
    except Exception as e:
        print(f"Exception occurred while testing port {port} ({protocol.upper()}): {e}")

def toggle_firewall_profiles(state='disable'):
    """
    Toggle firewall profiles (Domain, Private, Public) on or off.
    """
    try:
        if state.lower() not in ['enable', 'disable']:
            print("Invalid state for toggling firewall profiles. Use 'enable' or 'disable'.")
            return False

        profiles = ['Domain', 'Private', 'Public']
        for profile in profiles:
            command = [
                'powershell', '-Command',
                f"Set-NetFirewallProfile -Profile {profile} -Enabled {state.capitalize()}"
            ]
            subprocess.run(command, capture_output=True, text=True)
            print(f"Firewall profile '{profile}' has been {state}d.")

        print(f"Successfully {state}d all firewall profiles.")
        return True
    except Exception as e:
        print(f"Exception occurred while toggling firewall profiles: {e}")
        return False

def open_port(port):
    """
    Open the specified port in both inbound and outbound directions for TCP and UDP.
    """
    protocols = ['TCP', 'UDP']
    
    # First, delete all existing rules for the port to avoid conflicts
    delete_all_rules_for_port(port)
    
    for proto in protocols:
        # Inbound Allow Rule
        inbound_rule = {"name": f"Allow_Port_{port}_{proto}_Inbound", "direction": "in", "action": "allow"}
        add_firewall_rule(
            rule_name=inbound_rule["name"],
            port=port,
            protocol=proto,
            direction=inbound_rule["direction"],
            action=inbound_rule["action"],
            remote_ports="any"
        )
        # Start server if not already running
        start_server_process(port, proto)

        # Outbound Allow Rule
        outbound_rule = {"name": f"Allow_Port_{port}_{proto}_Outbound", "direction": "out", "action": "allow"}
        add_firewall_rule(
            rule_name=outbound_rule["name"],
            port=port,
            protocol=proto,
            direction=outbound_rule["direction"],
            action=outbound_rule["action"],
            remote_ports=port  # Remote port is the destination port
        )
        # Outbound rules typically don't require server processes

    # Toggle firewall profiles to refresh settings
    toggle_firewall_profiles('disable')
    toggle_firewall_profiles('enable')

    # Test the port after opening
    for proto in protocols:
        test_port(port, proto)

def close_port(port):
    """
    Close the specified port by deleting all existing rules and adding block rules for TCP and UDP.
    """
    protocols = ['TCP', 'UDP']
    
    # First, delete all existing rules for the port to avoid conflicts
    delete_all_rules_for_port(port)
    
    for proto in protocols:
        # Inbound Block Rule
        inbound_block = {"name": f"Block_Port_{port}_{proto}_Inbound", "direction": "in"}
        add_firewall_rule(
            rule_name=inbound_block["name"],
            port=port,
            protocol=proto,
            direction=inbound_block["direction"],
            action="block",
            remote_ports="any"
        )

        # Outbound Block Rule
        outbound_block = {"name": f"Block_Port_{port}_{proto}_Outbound", "direction": "out"}
        add_firewall_rule(
            rule_name=outbound_block["name"],
            port=port,
            protocol=proto,
            direction=outbound_block["direction"],
            action="block",
            remote_ports=port  # Remote port is the destination port
        )

        # Find and terminate server processes
        find_and_terminate_servers(port, proto)

    # Toggle firewall profiles to refresh settings
    toggle_firewall_profiles('disable')
    toggle_firewall_profiles('enable')

    # Test the port after closing
    for proto in protocols:
        test_port(port, proto)

def run_server(port, protocol='TCP'):
    """
    Run the server based on the specified protocol.
    Intended to be invoked as a separate process.
    """
    if protocol.upper() == 'TCP':
        start_tcp_server(port)
    elif protocol.upper() == 'UDP':
        start_udp_server(port)
    else:
        print(f"Unsupported protocol: {protocol}")

def main():
    """
    Main function to parse command-line arguments and perform actions.
    """
    if len(sys.argv) < 2:
        print("Usage:")
        print("  To open a port: python firewall_port_manager.py open <port>")
        print("  To close a port: python firewall_port_manager.py close <port>")
        print("  Internal use: python firewall_port_manager.py server <port> <protocol>")
        sys.exit(1)

    mode = sys.argv[1].lower()

    if mode == 'server':
        # Internal mode to run the server
        if len(sys.argv) != 4:
            print("Usage for server mode: python firewall_port_manager.py server <port> <protocol>")
            sys.exit(1)
        port = int(sys.argv[2])
        protocol = sys.argv[3]
        run_server(port, protocol)
    elif mode in ['open', 'close']:
        if len(sys.argv) < 3:
            print(f"Error: Port number is required for '{mode}' mode.")
            sys.exit(1)
        port = int(sys.argv[2])

        if not is_user_admin():
            print("This script requires administrative privileges to modify firewall rules.")
            print("Please run the script as an administrator.")
            sys.exit(1)

        if mode == 'open':
            open_port(port)
        elif mode == 'close':
            close_port(port)
    else:
        print(f"Unknown mode: {mode}")
        print("Valid modes are: open, close, server")
        sys.exit(1)

if __name__ == '__main__':
    main()
