from pymongo import MongoClient
from bson.objectid import ObjectId
import time

# MongoDB connection URI
uri = "mongodb+srv://lamjulienrd:3zgtpYc34JaYU9l3@projectv.sxtlx.mongodb.net/?retryWrites=true&w=majority&appName=projectv"

# Connect to MongoDB
client = MongoClient(uri)
db = client["projectv"]
users_collection = db["users"]

# Company ID for Big Corp (using its ObjectId)
BIG_CORP_COMPANY_ID = ObjectId("64b99f6e3f1e3b2b9f1e4d4c")  # Replace with the actual ObjectId for Big Corp

def add_user(username, email, role, company_id):
    if role not in ["admin", "view-only"]:
        raise ValueError("Invalid role. Must be either 'admin' or 'view-only'")

    user = {
        "username": username,
        "email": email,
        "role": role,
        "companyId": company_id
    }

    result = users_collection.insert_one(user)
    print(f"User '{username}' added with ID: {result.inserted_id}")

if __name__ == "__main__":
    while True:
        try:
            # Adding an admin for Big Corp
            add_user(username="bigcorp_admin", email="admin@bigcorp.com", role="admin", company_id=BIG_CORP_COMPANY_ID)
            
            # Adding a view-only user for Big Corp
            add_user(username="bigcorp_user", email="user@bigcorp.com", role="view-only", company_id=BIG_CORP_COMPANY_ID)
            break
        except Exception as e:
            print(f"An error occurred: {e}")
            time.sleep(5)  # Wait for 5 seconds before retrying