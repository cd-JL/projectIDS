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
sensors_collection = db['ports']

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

    # Retrieve the sensor document
    sensor = sensors_collection.find_one({"sensorId": sensor_id})
    if not sensor:
        print(f"[Error]: Sensor with ID {sensor_id} not found.")
        return jsonify({'error': 'Sensor not found.'}), 404

    print(f"[Sensor Retrieved]: {sensor_id} -> Device Name: {sensor.get('deviceName')}")
    
    # Query the specific service with the provided port
    service_entry = next((s for s in sensor.get('services', []) if s['port'] == port), None)
    print(f"[Service Entry for Port {port}]: {service_entry}")

    # Determine the new status and dangerous flag
    new_status = f"Port {port} is open" if action == 'open' else f"Port {port} is closed"
    new_dangerous = action == 'open'

    if service_entry:
        # Update the matching service entry
        result = sensors_collection.update_one(
            {"sensorId": sensor_id, "services.port": port},
            {
                "$set": {
                    "services.$.status": new_status,
                    "services.$.dangerous": new_dangerous
                }
            }
        )
        print(f"[MongoDB Update Result]: {result.raw_result}")
    else:
        # Add a new service entry
        sensors_collection.update_one(
            {"sensorId": sensor_id},
            {
                "$push": {
                    "services": {
                        "name": f"Port {port}",
                        "port": port,
                        "status": new_status,
                        "dangerous": new_dangerous
                    }
                }
            }
        )
        print(f"[New Entry Added]: Port {port} -> Status: '{new_status}', Dangerous: {new_dangerous}")

    # Fetch the updated service entry for the port
    updated_service_entry = sensors_collection.find_one(
        {"sensorId": sensor_id},
        {"services": {"$elemMatch": {"port": port}}}
    )
    print(f"[Updated Service Entry for Port {port}]: {updated_service_entry}")

    return jsonify({'message': f'Port {port} {action}ed for sensor {sensor_id}.'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
