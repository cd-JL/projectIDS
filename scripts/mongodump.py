from pymongo import MongoClient

# MongoDB connection details
uri = "mongodb+srv://lamjulienrd:3zgtpYc34JaYU9l3@projectv.sxtlx.mongodb.net/?retryWrites=true&w=majority&appName=projectv"
client = MongoClient(uri)
db = client["projectv"]

# Modified schema for the programs collection
programs_schema = {
    "bsonType": "object",
    "required": ["sensorId", "programs"],
    "properties": {
        "sensorId": {"bsonType": "string", "description": "Reference to the sensor ID reporting these programs"},
        "programs": {
            "bsonType": "array",
            "items": {
                "bsonType": "object",
                "required": ["Name", "Version"],
                "properties": {
                    "Name": {
                        "bsonType": ["string", "null"],
                        "description": "Name of the program (e.g., Catalyst Control Center)"
                    },
                    "Version": {
                        "bsonType": ["string", "null"],
                        "description": "Version number of the program (e.g., 2017.0424.2119.36535)"
                    }
                }
            },
            "description": "List of programs installed on the sensor"
        }
    }
}

# Modified schema for the vulnerabilities collection
vulnerabilities_schema = {
    "bsonType": "object",
    "required": ["sensorId"],
    "properties": {
        "sensorId": {"bsonType": "string", "description": "Reference to the sensor ID this vulnerability is associated with"},
        "vulnerabilities": {
            "bsonType": "array",
            "items": {
                "bsonType": "object",
                "properties": {
                    "cve": {
                        "bsonType": "object",
                        "properties": {
                            "id": {"bsonType": "string", "description": "CVE identifier"},
                            "description": {"bsonType": "string", "description": "Description of the CVE"},
                            "published": {"bsonType": "string", "description": "Publication date of the CVE"}
                        }
                    }
                }
            },
            "description": "List of vulnerabilities associated with the sensor"
        }
    }
}

# Update the programs collection with the new schema
try:
    db.command({
        "collMod": "programs",
        "validator": {
            "$jsonSchema": programs_schema
        }
    })
    print("Programs schema updated successfully.")
except Exception as e:
    print(f"Error updating programs schema: {e}")

# Update the vulnerabilities collection with the new schema
try:
    db.command({
        "collMod": "vulnerabilities",
        "validator": {
            "$jsonSchema": vulnerabilities_schema
        }
    })
    print("Vulnerabilities schema updated successfully.")
except Exception as e:
    print(f"Error updating vulnerabilities schema: {e}")
