import os
from pymongo import MongoClient
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

# Define the updated schema with only 'sensor_id' as required
updated_schema = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["sensor_id"],
        "properties": {
            "sensor_id": {"bsonType": "string", "description": "Unique ID for the sensor"},
            "FTP": {"bsonType": ["string", "null"], "description": "Optional field for FTP"},
            "SSH": {"bsonType": ["string", "null"], "description": "Optional field for SSH"},
            "Telnet": {"bsonType": ["string", "null"], "description": "Optional field for Telnet"},
            "SMTP": {"bsonType": ["string", "null"], "description": "Optional field for SMTP"},
            "DNS": {"bsonType": ["string", "null"], "description": "Optional field for DNS"},
            "TFTP": {"bsonType": ["string", "null"], "description": "Optional field for TFTP"},
            "Finger": {"bsonType": ["string", "null"], "description": "Optional field for Finger"},
            "HTTP": {"bsonType": ["string", "null"], "description": "Optional field for HTTP"},
            "POP3": {"bsonType": ["string", "null"], "description": "Optional field for POP3"},
            "IMAP": {"bsonType": ["string", "null"], "description": "Optional field for IMAP"},
            "SNMP": {"bsonType": ["string", "null"], "description": "Optional field for SNMP"},
            "LDAP": {"bsonType": ["string", "null"], "description": "Optional field for LDAP"},
            "HTTPS": {"bsonType": ["string", "null"], "description": "Optional field for HTTPS"},
            "SMB": {"bsonType": ["string", "null"], "description": "Optional field for SMB"},
            "Microsoft SQL Server": {"bsonType": ["string", "null"], "description": "Optional field for Microsoft SQL Server"},
            "Oracle DB": {"bsonType": ["string", "null"], "description": "Optional field for Oracle DB"},
            "MySQL": {"bsonType": ["string", "null"], "description": "Optional field for MySQL"},
            "RDP": {"bsonType": ["string", "null"], "description": "Optional field for RDP"},
            "PostgreSQL": {"bsonType": ["string", "null"], "description": "Optional field for PostgreSQL"},
            "VNC": {"bsonType": ["string", "null"], "description": "Optional field for VNC"},
            "X11": {"bsonType": ["string", "null"], "description": "Optional field for X11"},
            "SIP": {"bsonType": ["string", "null"], "description": "Optional field for SIP"},
            "Rsync": {"bsonType": ["string", "null"], "description": "Optional field for Rsync"},
            "NFS": {"bsonType": ["string", "null"], "description": "Optional field for NFS"},
            "Redis": {"bsonType": ["string", "null"], "description": "Optional field for Redis"},
            "Elasticsearch": {"bsonType": ["string", "null"], "description": "Optional field for Elasticsearch"},
            "MongoDB": {"bsonType": ["string", "null"], "description": "Optional field for MongoDB"},
            "Cassandra": {"bsonType": ["string", "null"], "description": "Optional field for Cassandra"},
            "Memcached": {"bsonType": ["string", "null"], "description": "Optional field for Memcached"},
            "Docker": {"bsonType": ["string", "null"], "description": "Optional field for Docker"},
            "Kubernetes API": {"bsonType": ["string", "null"], "description": "Optional field for Kubernetes API"},
            "Kubernetes Etcd": {"bsonType": ["string", "null"], "description": "Optional field for Kubernetes Etcd"},
            "RADIUS": {"bsonType": ["string", "null"], "description": "Optional field for RADIUS"},
            "IPSec": {"bsonType": ["string", "null"], "description": "Optional field for IPSec"},
            "CUPS": {"bsonType": ["string", "null"], "description": "Optional field for CUPS"},
            "SMTPS": {"bsonType": ["string", "null"], "description": "Optional field for SMTPS"},
            "IMAPS": {"bsonType": ["string", "null"], "description": "Optional field for IMAPS"},
            "POP3S": {"bsonType": ["string", "null"], "description": "Optional field for POP3S"},
            "all_open_ports": {"bsonType": ["array", "null"], "description": "Optional array for all open ports"}
        }
    }
}

# Apply the schema to the collection
db.command({
    "collMod": "sensors",
    "validator": updated_schema,
    "validationLevel": "moderate"  # Set to "moderate" to apply only to new or updated documents
})

print("Schema updated successfully.")
