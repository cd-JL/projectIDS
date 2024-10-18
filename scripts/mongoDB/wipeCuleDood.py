from pymongo import MongoClient


# Load environment variables from the .env.local file
parent_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'projectVD')
env_path = os.path.join(parent_directory, '.env.local')
load_dotenv(env_path)

# Fetch MongoDB URI
uri = os.getenv("MONGODB_URI")
client = MongoClient(mongo_uri)

# Connect to MongoDB
client = MongoClient(uri)
db = client["projectv"]
sensors_collection = db["sensors"]

# Function to update the schema validation
def update_schema():
    try:
        db.command({
            'collMod': 'sensors',  # Name of your collection
            'validator': {
                '$jsonSchema': {
                    'bsonType': 'object',
                    'required': ['companyId', 'sensorId'],  # Remove 'vulnerabilities' from required fields
                    'properties': {
                        'companyId': {
                            'bsonType': 'objectId',
                            'description': 'Reference to the company ID this sensor belongs to'
                        },
                        'sensorId': {
                            'bsonType': 'string',
                            'description': 'Unique ID for the sensor'
                        },
                        'sensorName': {
                            'bsonType': 'string',
                            'description': 'Name of the sensor'
                        },
                        'type': {
                            'bsonType': 'string',
                            'description': 'Type of sensor (e.g., network, application)'
                        },
                        'active': {
                            'bsonType': 'bool',
                            'description': 'Indicates if the sensor is active or inactive'
                        },
                        'vulnerabilities': {
                            'bsonType': 'array',
                            'items': {
                                'bsonType': 'objectId',
                                'description': 'References to vulnerability IDs in the vulnerabilities collection'
                            }
                        }
                    }
                }
            },
            'validationLevel': 'strict',  # Ensures strict schema validation
            'validationAction': 'error'  # Prevents invalid data from being inserted
        })
        print("Schema updated successfully")
    except Exception as e:
        print(f"An error occurred while updating the schema: {e}")

# Run the function to update the schema
update_schema()
