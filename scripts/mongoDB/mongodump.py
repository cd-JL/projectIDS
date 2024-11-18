from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
script_dir = os.path.dirname(os.path.abspath(__file__))
parent_directory = os.path.join(script_dir, '..','..', 'projectVD')
env_path = os.path.join(parent_directory, '.env.local')
load_dotenv(env_path)

# Connect to MongoDB
MONGODB_URI = os.getenv('MONGODB_URI')
if not MONGODB_URI:
    raise Exception("MONGODB_URI not found in environment variables.")

client = MongoClient(MONGODB_URI)
db = client['projectv']
sensors_collection = db['sensors']

