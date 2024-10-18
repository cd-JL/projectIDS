import os
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

# Load environment variables from the .env.local file
parent_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'projectVD')
parent_directory = os.path.abspath(parent_directory)  # Ensures the path is absolute
env_path = os.path.join(parent_directory, '.env.local')
load_dotenv(env_path)

# Fetch MongoDB URI
uri = os.getenv("MONGODB_URI")
client = MongoClient(uri)

# Connect to MongoDB
db = client["projectv"]
sensors_collection = db["sensors"]
companies_collection = db["companies"]
programs_collection = db["programs"]
vulnerabilities_collection = db["vulnerabilities"]

# Step 1: Retrieve sensorId and ObjectId for the device with name 'GuyMan6'
sensor = sensors_collection.find_one({"deviceName": "GuyMan6"})

if sensor:
    sensor_id = sensor.get("sensorId")
    object_id = sensor.get("_id")
    print(f"Found sensor with sensorName 'GuyMan6': sensorId = '{sensor_id}', objectId = '{object_id}'")

    # Step 2: Delete the sensor from the sensors collection
    sensor_deletion_result = sensors_collection.delete_one({"_id": object_id, "sensorId": sensor_id})
    print(f"Deleted sensor with sensorId '{sensor_id}' and objectId '{object_id}': {sensor_deletion_result.raw_result}")

    # Step 3: Remove the sensor reference from the sensors array in the 'Big Corp' company
    company_update_result = companies_collection.update_one(
        {"name": "Big Corp"},
        {"$pull": {"sensors": object_id}}
    )
    print(f"Removed sensor with objectId '{object_id}' from the sensors array in 'Big Corp': {company_update_result.raw_result}")

    # Step 4: Delete all programs associated with this sensorId
    programs_deletion_result = programs_collection.delete_many({"sensorId": object_id})
    print(f"Deleted programs associated with sensorId '{object_id}' from programs collection: {programs_deletion_result.raw_result}")

    # Step 5: Verify vulnerabilities to be deleted before deletion
    vulnerabilities_to_delete = list(vulnerabilities_collection.find({"sensorId": sensor_id}))
    print(f"Found {len(vulnerabilities_to_delete)} vulnerabilities associated with sensorId '{sensor_id}' before deletion.")

    # Step 6: Delete all vulnerabilities associated with this sensorId
    vulnerabilities_deletion_result = vulnerabilities_collection.delete_many({"sensorId": sensor_id})
    print(f"Deleted vulnerabilities associated with sensorId '{sensor_id}' from vulnerabilities collection: {vulnerabilities_deletion_result.raw_result}")

    # Verify that the vulnerabilities are deleted
    remaining_vulnerabilities = list(vulnerabilities_collection.find({"sensorId": sensor_id}))
    print(f"Remaining vulnerabilities after deletion: {len(remaining_vulnerabilities)}")

else:
    print("No sensor found with the name 'GuyMan6'.")
