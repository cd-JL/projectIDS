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
sensors_collection = db["sensors"]

# Function to wipe the sensors collection
def wipe_sensors():
    try:
        result = sensors_collection.delete_many({})
        print(f"{result.deleted_count} documents were deleted from the sensors collection.")
    except Exception as e:
        print(f"An error occurred while wiping the sensors collection: {e}")

# Run the function to wipe the sensors collection
wipe_sensors()
