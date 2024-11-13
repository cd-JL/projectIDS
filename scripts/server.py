import http.server
import os
import socketserver
import json
from dotenv import load_dotenv
from pymongo import MongoClient
import bcrypt
import bson
from bson.json_util import dumps
from datetime import datetime

# Load environment variables from the .env.local file
# Referenced ChatGPT for directory structure and usage of dotenv for secure environment variables handling
parent_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'projectVD')
env_path = os.path.join(parent_directory, '.env.local')
load_dotenv(env_path)

# Fetch MongoDB URI
# ChatGPT provided guidance on setting up MongoDB connections with pymongo
mongo_uri = os.getenv("MONGODB_URI")
client = MongoClient(mongo_uri)
db = client.projectv
collection = db.sign_in

class ServerHandler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        # Setting CORS headers for OPTIONS method
        # Based on ChatGPT guidance for handling preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        # HANDLE SIGN IN FUNCTIONALITY
        if self.path == '/signIn':
            # CORS headers for POST
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()

            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)

            try:
                user_data = json.loads(post_data)  # Decoding JSON data received in POST request
            except json.JSONDecodeError:
                self.send_response(400)
                response = {'message': 'Invalid JSON format.'}
                self.wfile.write(json.dumps(response).encode())
                return
        
            # User authentication process
            # ChatGPT assisted in implementing bcrypt hashing check for password verification
            user = collection.find_one({"email": user_data['email']})
            if not user:
                self.send_response(400)
                response = {'message': "User doesn't exist."}
                self.wfile.write(json.dumps(response).encode())
                print("User doesn't exist.")
                return

            # Password and account status verification
            if user['status'] == 'active':
                if bcrypt.checkpw(user_data['password'].encode('utf-8'), user['password']):
                    self.send_response(200)
                    response = {'messagee': "Signed In"}
                    print('signed in')
                else:
                    self.send_response(400)
                    response = {'message': "Incorrect password."}
                    print('Incorrect password.')
            else:
                self.send_response(403)
                response = {'message': "This account is deactivated."}

            self.wfile.write(json.dumps(response).encode())
        
        # HANDLE SIGN UP FUNCTIONALITY
        elif self.path == '/signUp':
            # Referenced ChatGPT for CORS headers and response handling for POST requests
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
            
            # Check if user already exists
            if collection.find_one({"email": user_data['email']}):
                self.send_response(409)
                response = {'message': "Email already exists."}
                self.wfile.write(json.dumps(response).encode())
                print("Email already exists.")
                return
            
            try:
                # Using bcrypt for password hashing (ChatGPT suggested secure hashing practices)
                hashed_password = bcrypt.hashpw(user_data['password'].encode('utf-8'), bcrypt.gensalt())
                user_data['password'] = hashed_password
                collection.insert_one(user_data)

                new_user_data = collection.find_one({'email': user_data['email']}, {'_id': 1})

                db.user.insert_one({
                    "user_id": new_user_data["_id"],
                    "username": user_data['name'],
                    "email": user_data['email'],
                    "role": "view-only",
                    "company": user_data['company'],
                    "status": "active"
                })
                user_doc = db.user.find_one({'email': user_data['email']}, {'user_id': 1})
                response = {'message': f'User registered successfully.'}

                db.companies.update_one(
                    {'name': user_data['company']},
                    {
                        '$push': {'users': user_doc['user_id']}
                    }
                )

            except Exception as e:
                print(f"Error inserting into MongoDB: {e}")
                self.send_response(500) 
                response = {'message': str(e)}

            self.wfile.write(json.dumps(response).encode())
        
        # Adding a new company
        elif self.path == '/newCompany':
            # Referenced ChatGPT for CORS headers and response handling for POST requests
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()

            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)

            try:
                company = json.loads(post_data)
            except json.JSONDecodeError:
                self.send_response(400)
                response = {'message': 'Invalid JSON format.'}
                self.wfile.write(json.dumps(response).encode())
                return

            # Check if the company already exists
            if db.companies.find_one({"name": company['name']}):
                self.send_response(409)
                response = {'message': "Company already exists."}
                self.wfile.write(json.dumps(response).encode())
                print("Company already exists.")
                return
            
            try:
                db.companies.insert_one({
                    "name": company['name'],
                    "users": [],
                    "sensors": []
                })
                self.send_response(200)
                response = {'message': f'Company added successfully.'}


            except Exception as e:
                print(f"Error inserting into MongoDB: {e}")
                self.send_response(500) 
                response = {'message': str(e)}
            
            self.wfile.write(json.dumps(response).encode())
        
         # Deleting a company
        elif self.path == '/deleteCompany':
            # Referenced ChatGPT for CORS headers and response handling for POST requests
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()

            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)

            try:
                company = json.loads(post_data)
            except json.JSONDecodeError:
                self.send_response(400)
                response = {'message': 'Invalid JSON format.'}
                self.wfile.write(json.dumps(response).encode())
                return

            # Check if the company exist or not
            if db.companies.find_one({"name": company['name']}):
                db.user.delete_many({"company": company['name']})
                collection.delete_many({"company": company['name']})
                db.companies.delete_one({"name": company['name']})
                self.send_response(200)
                response = {'message': 'Company deleted successfully.'}



            else:
                self.send_response(404)
                response = {'message': "Company doesn't exist."}
                self.wfile.write(json.dumps(response).encode())
                print("Company doesn't exist.")
                return

            
            self.wfile.write(json.dumps(response).encode())

        # Send Message Endpoint
        elif self.path == '/sendMessage':
            # Referenced ChatGPT for CORS headers and response handling for POST requests
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()

            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)

            try:
                message_data = json.loads(post_data)
            except json.JSONDecodeError:
                self.send_response(400)
                response = {'message': 'Invalid JSON format.'}
                self.wfile.write(json.dumps(response).encode())
                return
            
            if message_data:
                message = {
                    "sender": message_data['userEmail'],
                    "receiver": message_data["selectedEmail"],
                    "message": message_data["message"],
                    "timestamp": datetime.now()
                }

                db.message.insert_one(message)
                print(message, "inserted.")

        elif self.path == '/getMessages':
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()

            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)


            try:
                message_data = json.loads(post_data)
            except json.JSONDecodeError:
                self.send_response(400)
                response = {'message': 'Invalid JSON format.'}
                self.wfile.write(json.dumps(response).encode())
                return
            
            print("api called")
        



        else:
            self.send_response(404)
            self.end_headers()
            response = {'message': 'Not found'}
            print('API endpoint not found.')
            self.wfile.write(json.dumps(response).encode())

    def do_GET(self):
        # HANDLE GET USER FUNCTIONALITY
        # Referenced ChatGPT for CORS headers and response handling for GET requests
        if self.path.startswith('/getUser'):
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()

            email = self.path.split('=')[-1] 
            user = db.user.find_one({"email": email}, {"_id": 0, "user_id": 0}) 

            if user:
                self.wfile.write(json.dumps(user).encode())
            else:
                self.send_response(404)
                response = {'message': "User not found."}
                self.wfile.write(json.dumps(response).encode())

        # Fetch all users
        elif self.path.startswith('/Users'):
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()

            try:
                users = list(db.user.find({}, {"_id": 0, "user_id": 0}))
                if users:
                    json_data = dumps(users)
                    self.wfile.write(json_data.encode())
                    print("User data sent to client.")
                else:
                    self.send_response(404)
                    response = {'message': "Users not found."}
                    self.wfile.write(json.dumps(response).encode())
            except Exception as e:
                print(f"Error fetching users: {str(e)}")
                self.send_response(500)
                response = {'message': 'Internal server error.'}
                self.wfile.write(json.dumps(response).encode())
        
        # Update user status to active
        elif self.path.startswith('/makeAsAdmin'):
            email = self.path.split('=')[-1] 
            db.user.update_one({'email': email}, {"$set": {'status': "active"}})
            collection.update_one({'email': email}, {"$set": {'status': "active"}})
            self.send_response(200)
            response = {'message': 'User role updated to admin.'}
            self.wfile.write(json.dumps(response).encode())

        # Revert user status to deactive
        elif self.path.startswith('/dismissAsAdmin'):
            email = self.path.split("=")[-1]
            db.user.update_one({'email': email}, {"$set": {'status': "deactive"}})
            collection.update_one({'email': email}, {"$set": {'status': "deactive"}})
            self.send_response(200)
            response = {'message': 'User role updated to view-only.'}
            self.wfile.write(json.dumps(response).encode())

        # Delete a user from the database
        elif self.path.startswith('/deleteUser'):
            email = self.path.split("=")[-1]
            user_doc = db.user.find_one({'email': email}, {'_id': 1, 'company': 1})
            db.companies.update_one(
                {'name': user_doc['company']},
                {
                    '$pull': {'users': user_doc['_id']}
                }
            )
            db.user.delete_one({'email': email})
            collection.delete_one({'email': email})
            self.send_response(200)
            response = {'message': 'User deleted successfully.'}
            self.wfile.write(json.dumps(response).encode())

        # Fetch all companies
        elif self.path.startswith('/companies'):
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            companies = list(db.companies.find({}, {"_id": 0, "name": 1}))

            if companies:
                self.wfile.write(json.dumps(companies).encode())
            else:
                self.send_response(404)
                response = {'message': "No companies found."}
                self.wfile.write(json.dumps(response).encode())

        # FETCHING USERS LIST FOR MESSAGING FUNCTION FOR REGULAR USER
        # Referenced ChatGPT for CORS headers and response handling for GET requests
        elif self.path.startswith('/usersListForMessage'):
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()

            email = self.path.split('=')[-1] 
            role = db.user.find_one({"email": email}, {"role": 1})

            if (role["role"] != "admin"):
                 user_company = db.user.find_one({"email": email}, {"company": 1}) 

                 if user_company:
                     users_list = list(db.user.find({"company": user_company["company"], "email": {"$ne": email}}, {"username": 1, "email": 1, "role": 1, "_id": 0}))
                     admin_data = list(db.user.find({"email":"Admin123@321.com"}, {"username": 1, "email": 1, "role": 1, "_id": 0 }))
     
                     users_list.extend(admin_data)
                     print("Users list for regular user")
                     print(users_list)
                     self.send_response(200)
                     self.wfile.write(json.dumps(users_list).encode())
     
                 else:
                     self.send_response(404)
                     response = {'message': "User not found."}
                     self.wfile.write(json.dumps(response).encode())
            
            else:
                users_list = list(db.user.find({"email": {"$ne": email}}, {"username": 1, "email": 1, "role": 1, "_id": 0}))
                print("users list for admin user")
                print(users_list)
                self.send_response(200)
                self.wfile.write(json.dumps(users_list).encode())
            
            

     
           
                

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
