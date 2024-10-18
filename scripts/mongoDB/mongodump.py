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
