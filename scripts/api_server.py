from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Create Flask app and enable CORS
app = Flask(__name__)
CORS(app)

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

@app.route('/api/update_port', methods=['POST'])
def update_port():
    data = request.get_json()
    sensor_id = data.get('sensorId')
    port = data.get('port')
    action = data.get('action')  # 'open' or 'close'

    # Validate input
    if not sensor_id or port is None or not action:
        return jsonify({'error': 'sensorId, port, and action are required.'}), 400

    try:
        port = int(port)
        if not (1 <= port <= 65535):
            return jsonify({'error': 'Invalid port number.'}), 400
    except ValueError:
        return jsonify({'error': 'Port must be an integer.'}), 400

    # Retrieve sensor from the database
    sensor = sensors_collection.find_one({"sensorId": sensor_id})
    if not sensor:
        print(f"DEBUG: Sensor with ID {sensor_id} not found.")
        return jsonify({'error': 'Sensor not found.'}), 404

    print(f"DEBUG: Sensor retrieved: {sensor}")

    services = sensor.get('services', [])

    # Find the service entry for the specified port
    service_entry = next((service for service in services if service['port'] == port), None)
    print(f"DEBUG: Service entry for port {port}: {service_entry}")

    # Validate action
    if action not in ['open', 'close']:
        print(f"DEBUG: Invalid action received: {action}")
        return jsonify({'error': 'Invalid action. Must be "open" or "close".'}), 400

    if action == 'open':
        if service_entry and service_entry.get('status', '').startswith(f"Port {port} is open"):
            print(f"DEBUG: Port {port} is already open for sensor {sensor_id}.")
            return jsonify({'error': f'Port {port} is already open for sensor {sensor_id}.'}), 400
    elif action == 'close':
        if service_entry and service_entry.get('status', '').startswith(f"Port {port} is closed"):
            print(f"DEBUG: Port {port} is already closed for sensor {sensor_id}.")
            return jsonify({'message': f'Port {port} is already closed for sensor {sensor_id}.'}), 200
        elif not service_entry:
            print(f"DEBUG: Port {port} is not currently open for sensor {sensor_id}. Closing anyway.")
        else:
            print(f"DEBUG: Closing port {port} for sensor {sensor_id}.")

    # Perform the requested action on the 'services' array
    if service_entry:
        # Update existing service entry
        new_status = f"Port {port} is open" if action == 'open' else f"Port {port} is closed"
        new_dangerous = True if action == 'open' else False

        print(f"DEBUG: Updating sensor {sensor_id}, port {port} with status: {new_status}, dangerous: {new_dangerous}")
        result = sensors_collection.update_one(
            {"sensorId": sensor_id, "services.port": port},  # Match sensor and port
            {"$set": {
                "services.$[elem].status": new_status,
                "services.$[elem].dangerous": new_dangerous
            }},
            array_filters=[{"elem.port": port}]  # Specify the target array element
        )
        print(f"DEBUG: Update existing service entry result: {result.raw_result}")
    else:
        # Create a new service entry
        new_status = f"Port {port} is open" if action == 'open' else f"Port {port} is closed"
        new_dangerous = True if action == 'open' else False
        print(f"DEBUG: Adding new service entry for sensor {sensor_id}, port {port}")
        result = sensors_collection.update_one(
            {"sensorId": sensor_id},
            {"$push": {"services": {
                "name": f"Port {port}",
                "port": port,
                "status": new_status,
                "dangerous": new_dangerous
            }}}
        )
        print(f"DEBUG: Add new service entry result: {result.raw_result}")

    print(f"DEBUG: Successfully {action}ed port {port} for sensor {sensor_id}.")
    return jsonify({'message': f'Port {port} {action}ed for sensor {sensor_id}.'}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
