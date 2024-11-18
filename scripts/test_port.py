import socket
import sys

def test_port(port):
    """
    Tests if a specified port on localhost is open.
    """
    host = '127.0.0.1'  # Localhost IP
    try:
        # Create a socket object
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)  # Set timeout to 5 seconds

        # Try to connect to the host and port
        result = sock.connect_ex((host, port))

        if result == 0:
            print(f"Port {port} on {host} (localhost) is OPEN.")
        else:
            print(f"Port {port} on {host} (localhost) is CLOSED or unreachable.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        sock.close()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python test_port.py <port>")
        sys.exit(1)

    try:
        target_port = int(sys.argv[1])
        if not (1 <= target_port <= 65535):
            print("Error: Port must be an integer between 1 and 65535.")
            sys.exit(1)
    except ValueError:
        print("Error: Port must be an integer.")
        sys.exit(1)

    test_port(target_port)
