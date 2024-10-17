from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables from the .env.local file
parent_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'projectVD')
env_path = os.path.join(parent_directory, '.env.local')
load_dotenv(env_path)

# Fetch MongoDB URI
uri = os.getenv("MONGODB_URI")
client = MongoClient(uri)

# Connect to MongoDB
db = client["projectv"]
vulnerabilities_collection = db["vulnerabilities"]

# Function to wipe the vulnerabilities collection
def wipe_vulnerabilities():
    try:
        result = vulnerabilities_collection.delete_many({})
        print(f"{result.deleted_count} documents were deleted from the vulnerabilities collection.")
    except Exception as e:
        print(f"An error occurred while wiping the vulnerabilities collection: {e}")

# Run the function to wipe the vulnerabilities collection
wipe_vulnerabilities()
