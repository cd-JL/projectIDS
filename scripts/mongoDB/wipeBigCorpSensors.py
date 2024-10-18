from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson.objectid import ObjectId

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
companies_collection = db["companies"]

# Function to get the companyId for "Big Corp"
def get_big_corp_id():
    try:
        company = companies_collection.find_one({"name": "Big Corp"})
        if company:
            return company["_id"]
        else:
            print("Company 'Big Corp' not found.")
            return None
    except Exception as e:
        print(f"An error occurred while fetching Big Corp's companyId: {e}")
        return None

# Function to clear the sensors array in Big Corp
def clear_big_corp_sensors():
    company_id = get_big_corp_id()
    if company_id:
        try:
            result = companies_collection.update_one(
                {"_id": ObjectId(company_id)},
                {"$set": {"sensors": []}}
            )
            if result.modified_count > 0:
                print("Sensors array cleared for Big Corp.")
            else:
                print("No changes made to Big Corp.")
        except Exception as e:
            print(f"An error occurred while clearing the sensors array for Big Corp: {e}")

# Run the function to clear the sensors array in Big Corp
clear_big_corp_sensors()
