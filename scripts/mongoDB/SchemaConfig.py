from pymongo import MongoClient

# MongoDB connection URI
uri = "mongodb+srv://lamjulienrd:3zgtpYc34JaYU9l3@projectv.sxtlx.mongodb.net/?retryWrites=true&w=majority&appName=projectv"

# Create a MongoDB client
client = MongoClient(uri)

# Define the database
db = client["projectv"]

# Schema definitions
company_schema = {
    "bsonType": "object",
    "required": ["name", "users", "sensors"],
    "properties": {
        "name": {"bsonType": "string", "description": "Name of the company"},
        "users": {"bsonType": "array", "items": {"bsonType": "objectId", "description": "References to user IDs in the 'users' collection"}},
        "sensors": {"bsonType": "array", "items": {"bsonType": "objectId", "description": "References to sensor IDs in the 'sensors' collection"}}
    }
}

user_schema = {
    "bsonType": "object",
    "required": ["username", "email", "role", "companyId"],
    "properties": {
        "username": {"bsonType": "string", "description": "User's unique username"},
        "email": {"bsonType": "string", "pattern": "^.+@.+$", "description": "User's email address"},
        "role": {"bsonType": "string", "enum": ["admin", "view-only"], "description": "Role of the user in the company"},
        "companyId": {"bsonType": "objectId", "description": "Reference to the company the user belongs to"}
    }
}

sensor_schema = {
    "bsonType": "object",
    "required": ["companyId", "sensorId"],
    "properties": {
        "companyId": {"bsonType": "objectId", "description": "Reference to the company ID this sensor belongs to"},
        "sensorId": {"bsonType": "string", "description": "Unique ID for the sensor"},
        "sensorName": {"bsonType": "string", "description": "Name of the sensor"},
        "type": {"bsonType": "string", "description": "Type of sensor (e.g., network, application)"},
        "active": {"bsonType": "bool", "description": "Indicates if the sensor is active or inactive"},
        "vulnerabilities": {"bsonType": "array", "items": {"bsonType": "objectId", "description": "References to vulnerability IDs in the 'vulnerabilities' collection"}}
    }
}

port_details_schema = {
    "sensor_id": {
        "type": "string",
        "description": "UUID for the sensor, must be in the format 23c64bbe-1ecc-4401-a722-b9bbfe262a8a"
    },
    "services": [
        {
            "name": "string",
            "port": "int",
            "status": "string",
            "dangerous": "bool"
        }
    ],
    "all_open_ports": [
        {
            "type": "int",
            "minimum": 0,
            "maximum": 65535
        }
    ]
}

vulnerability_schema = {
    "bsonType": "object",
    "required": ["sensorId", "cve"],
    "properties": {
        "sensorId": {"bsonType": "objectId", "description": "Reference to the sensor ID this vulnerability is associated with"},
        "cve": {
            "bsonType": "object",
            "required": ["id", "sourceIdentifier", "published", "lastModified", "vulnStatus", "descriptions", "metrics", "weaknesses", "configurations", "references"],
            "properties": {
                "id": {"bsonType": "string", "description": "Unique CVE identifier (e.g., CVE-2024-0001)"},
                "sourceIdentifier": {"bsonType": "string", "description": "The source reporting the CVE"},
                "published": {"bsonType": "string", "description": "CVE publication date"},
                "lastModified": {"bsonType": "string", "description": "Date when the CVE was last modified"},
                "vulnStatus": {"bsonType": "string", "description": "Current status of the vulnerability"},
                "descriptions": {
                    "bsonType": "array",
                    "items": {
                        "bsonType": "object",
                        "properties": {
                            "lang": {"bsonType": "string", "description": "Language of the description (e.g., en)"},
                            "value": {"bsonType": "string", "description": "The description text of the CVE"}
                        }
                    }
                },
                "metrics": {"bsonType": "object"},
                "weaknesses": {"bsonType": "array"},
                "configurations": {"bsonType": "array"},
                "references": {
                    "bsonType": "array",
                    "items": {
                        "bsonType": "object",
                        "properties": {
                            "url": {"bsonType": "string"},
                            "source": {"bsonType": "string"}
                        }
                    }
                }
            }
        }
    }
}

 db.create_collection('network_traffic', validator={
        '$jsonSchema': {
            'bsonType': 'object',
            'required': ['sensorId', 'timestamp', 'trafficStats'],
            'properties': {
                'sensorId': {'bsonType': 'string'},
                'timestamp': {'bsonType': 'date'},
                'trafficStats': {
                    'bsonType': 'object',
                    'required': ['hourly'],
                    'properties': {
                        'hourly': {
                            'bsonType': 'object',
                            'patternProperties': {
                                '^[0-9]{1,2}$': {  # Hour keys (0-23)
                                    'bsonType': 'object',
                                    'properties': {
                                        'bytesIn': {'bsonType': 'long'},
                                        'bytesOut': {'bsonType': 'long'},
                                        'packetsIn': {'bsonType': 'long'},
                                        'packetsOut': {'bsonType': 'long'},
                                        'uniqueIPs': {'bsonType': 'array'},
                                        'protocols': {
                                            'bsonType': 'object',
                                            'properties': {
                                                'TCP': {'bsonType': 'int'},
                                                'UDP': {'bsonType': 'int'},
                                                'ICMP': {'bsonType': 'int'},
                                                'OTHER': {'bsonType': 'int'}
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        'daily': {
                            'bsonType': 'object',
                            'properties': {
                                'totalBytes': {'bsonType': 'long'},
                                'totalPackets': {'bsonType': 'long'},
                                'avgBytesPerSecond': {'bsonType': 'double'},
                                'avgPacketsPerSecond': {'bsonType': 'double'}
                            }
                        }
                    }
                }
            }
        }
    })

    # Create network_threats collection for storing detected threats
    db.create_collection('network_traffic', validator={
        '$jsonSchema': {
            'bsonType': 'object',
            'required': ['sensorId', 'timestamp', 'trafficStats'],
            'properties': {
                'sensorId': {'bsonType': 'string'},
                'timestamp': {'bsonType': 'date'},
                'trafficStats': {
                    'bsonType': 'object',
                    'required': ['hourly'],
                    'properties': {
                        'hourly': {
                            'bsonType': 'object',
                            'patternProperties': {
                                '^[0-9]{1,2}$': {  # Hour keys (0-23)
                                    'bsonType': 'object',
                                    'properties': {
                                        'bytesIn': {'bsonType': 'long'},
                                        'bytesOut': {'bsonType': 'long'},
                                        'packetsIn': {'bsonType': 'long'},
                                        'packetsOut': {'bsonType': 'long'},
                                        'uniqueIPs': {'bsonType': 'array'},
                                        'protocols': {
                                            'bsonType': 'object',
                                            'properties': {
                                                'TCP': {'bsonType': 'int'},
                                                'UDP': {'bsonType': 'int'},
                                                'ICMP': {'bsonType': 'int'},
                                                'OTHER': {'bsonType': 'int'}
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        'daily': {
                            'bsonType': 'object',
                            'properties': {
                                'totalBytes': {'bsonType': 'long'},
                                'totalPackets': {'bsonType': 'long'},
                                'avgBytesPerSecond': {'bsonType': 'double'},
                                'avgPacketsPerSecond': {'bsonType': 'double'}
                            }
                        }
                    }
                }
            }
        }
    })

    # Create network_threats collection for storing detected threats
    db.create_collection('network_threats', validator={
        '$jsonSchema': {
            'bsonType': 'object',
            'required': ['sensorId', 'timestamp', 'threatType'],
            'properties': {
                'sensorId': {'bsonType': 'string'},
                'timestamp': {'bsonType': 'date'},
                'threatType': {'bsonType': 'string'},
                'sourceIP': {'bsonType': 'string'},
                'destinationIP': {'bsonType': 'string'},
                'protocol': {'bsonType': 'string'},
                'port': {'bsonType': 'int'},
                'severity': {'bsonType': 'string'},
                'details': {
                    'bsonType': 'object',
                    'properties': {
                        'packetSize': {'bsonType': 'int'},
                        'flags': {'bsonType': 'string'},
                        'payload': {'bsonType': 'string'},
                        'matchedSignature': {'bsonType': 'string'}
                    }
                },
                'resolved': {'bsonType': 'bool'},
                'resolutionTime': {'bsonType': 'date'}
            }
        }
    })

    # Create indexes for efficient querying
    db.network_traffic.create_index([('sensorId', 1), ('timestamp', -1)])
    db.network_traffic.create_index([('timestamp', -1)])
    
    db.network_threats.create_index([('sensorId', 1), ('timestamp', -1)])
    db.network_threats.create_index([('threatType', 1)])
    db.network_threats.create_index([('sourceIP', 1)])
    db.network_threats.create_index([('severity', 1)])
    db.network_threats.create_index([('resolved', 1)])

programs_schema = {
    "bsonType": "object",
    "required": ["sensorId", "programs"],
    "properties": {
        "sensorId": {
            "bsonType": "objectId",
            "description": "Reference to the sensor ID reporting these programs"
        },
        "programs": {
            "bsonType": "array",
            "items": {
                "bsonType": "object",
                "required": ["Name", "Version"],
                "properties": {
                    "Name": {
                        "bsonType": "string",
                        "description": "Name of the program (e.g., Catalyst Control Center)"
                    },
                    "Version": {
                        "bsonType": "string",
                        "description": "Version number of the program (e.g., 2017.0424.2119.36535)"
                    }
                }
            }
        }
    }
}

# Create collections with schema validation
try:
    db.create_collection("companies", validator={"$jsonSchema": company_schema})
    db.create_collection("users", validator={"$jsonSchema": user_schema})
    db.create_collection("sensors", validator={"$jsonSchema": sensor_schema})
    db.create_collection("vulnerabilities", validator={"$jsonSchema": vulnerability_schema})

    print("Collections created with schemas successfully!")
except Exception as e:
    print(f"Error creating collections: {e}")
