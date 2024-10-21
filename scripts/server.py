import http.server
import os
import socketserver
import json
from dotenv import load_dotenv
from pymongo import MongoClient
import bcrypt
import bson
from bson.json_util import dumps

# Load environment variables from the .env.local file
parent_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'projectVD')
env_path = os.path.join(parent_directory, '.env.local')
load_dotenv(env_path)

# Fetch MongoDB URI
mongo_uri = os.getenv("MONGODB_URI")
client = MongoClient(mongo_uri)
db = client.projectv
collection = db.sign_in

class ServerHandler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        # HANDLE SIGN IN FUNCTIONALITY
        if self.path == '/signIn':
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()

            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)

            try:
                user_data = json.loads(post_data)
            except json.JSONDecodeError:
                self.send_response(400)
                response = {'message': 'Invalid JSON format.'}
                self.wfile.write(json.dumps(response).encode())
                return

            user = collection.find_one({"email": user_data['email']})
            if not user:
                self.send_response(400)
                response = {'message': "User doesn't exist."}
                self.wfile.write(json.dumps(response).encode())
                print("User doesn't exist.")
                return
            
            if bcrypt.checkpw(user_data['password'].encode('utf-8'), user['password']):
                self.send_response(200)
                response = {'messagee': "Signed In"}
                print('signed in')
            else:
                self.send_response(400)
                response = {'message': "Incorrect password."}
                print('incorrect password')

            self.wfile.write(json.dumps(response).encode())
        
        # HANDLE SIGN UP FUNCTIONALITY
        elif self.path == '/signUp':
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()

            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)

            try:
                user_data = json.loads(post_data)
            except json.JSONDecodeError:
                self.send_response(400)
                response = {'message': 'Invalid JSON format.'}
                self.wfile.write(json.dumps(response).encode())
                return
            
            if collection.find_one({"email": user_data['email']}):
                self.send_response(409)
                response = {'message': "Email already exists."}
                self.wfile.write(json.dumps(response).encode())
                print("Email already exists")
                return
            
            try:
                hashed_password = bcrypt.hashpw(user_data['password'].encode('utf-8'), bcrypt.gensalt())
                user_data['password'] = hashed_password
                collection.insert_one(user_data)
                db.user.insert_one({
                    "username": user_data['name'],
                    "email": user_data['email'],
                    "role": "view-only",
                    # "companyId": bson.ObjectId(user_data['companyId'])
                })
                response = {'message': 'Account created successfully.'}
                self.send_response(200) 

            except Exception as e:
                print(f"Error inserting into MongoDB: {e}")
                self.send_response(500) 
                response = {'message': str(e)}

            self.wfile.write(json.dumps(response).encode())

        else:
            self.send_response(404)
            self.end_headers()
            response = {'message': 'Not found'}
            print('api')
            self.wfile.write(json.dumps(response).encode())

    def do_GET(self):
        # HANDLE GET USER FUNCTIONALITY
        if self.path.startswith('/getUser'):
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()

            email = self.path.split('=')[-1] 
            user = db.user.find_one({"email": email}, {"_id": 0}) 

            if user:
                self.wfile.write(json.dumps(user).encode())
            else:
                self.send_response(404)
                response = {'message': "User not found."}
                self.wfile.write(json.dumps(response).encode())

        elif self.path.startswith('/Users'):
            print("USERS FOUND3 - Processing request")  # Step 1: Debug entry point
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()

            try:
                # Step 2: Debugging before database query
                print("Attempting to query the database for users...")

                # Fetch users, excluding the _id field
                # Fetch all documents from the collection without any projection to verify data
                users = list(db.user.find())
                print(users)  # Output fetched users

                # Step 3: Debugging after fetching from DB
                print(f"Query successful. Users fetched: {users}")

                if users:
                    # Convert the user data to JSON format and send it in the response
                    json_data = dumps(users)  # Convert BSON to JSON

                    # Step 4: Debugging JSON conversion
                    print(f"Users data after JSON conversion: {json_data}")

                    self.wfile.write(json_data.encode())
                    print("USERS FOUND1 - Data sent to client")
                else:
                    # Step 5: Debugging when no users found
                    print("No users found in the database.")
                    self.send_response(404)
                    response = {'message': "Users not found."}
                    self.wfile.write(json.dumps(response).encode())
            except Exception as e:
                # Step 6: Debugging in case of an exception
                print(f"Error fetching users: {str(e)}")  # Log the actual error
                self.send_response(500)
                response = {'message': 'Internal server error.'}
                self.wfile.write(json.dumps(response).encode())
        
        # Make a user admin
        elif self.path.startswith('/makeAsAdmin'):

            email = self.path.split('=')[-1] 

            db.user.update_one({'email': email}, {"$set": {'role': "admin"}})
            self.send_response(200)

        # Dismiss a user view-only
        elif self.path.startswith('/dismissAsAdmin'):

            email = self.path.split("=")[-1]

            db.user.update_one({'email': email}, {"$set": {'role': "view-only"}})
            self.send_response(200)

        # Delete user
        elif self.path.startswith('/deleteUser'):

            email = self.path.split("=")[-1]

            db.user.delete_one({'email': email})
            collection.delete_one({'email': email})
            self.send_response(200)


        
        else:
            self.send_response(404)
            self.end_headers()
            response = {'message': 'Not found'}
            print('GET request not handled')
            self.wfile.write(json.dumps(response).encode())

PORT = 8000
with socketserver.TCPServer(("", PORT), ServerHandler) as httpd:
    print(f"Server running on port {PORT}")
    httpd.serve_forever()
