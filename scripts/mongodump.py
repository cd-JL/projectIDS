from pymongo import MongoClient
from bson import ObjectId

# MongoDB connection details
uri = "mongodb+srv://lamjulienrd:3zgtpYc34JaYU9l3@projectv.sxtlx.mongodb.net/?retryWrites=true&w=majority&appName=projectv"
client = MongoClient(uri)
db = client["projectv"]
companies_collection = db["companies"]

# Define the company document for Big Corp
big_corp_document = {
    "name": "Big Corp",
    "users": [],  # Add any user ObjectIds if available
    "sensors": []  # Add any sensor ObjectIds if available
}

try:
    # Insert the Big Corp document into the companies collection
    result = companies_collection.insert_one(big_corp_document)
    print(f"Big Corp added to the companies collection with ID: {result.inserted_id}")
except Exception as e:
    print(f"Error adding Big Corp to the companies collection: {e}")