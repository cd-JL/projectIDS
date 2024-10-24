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
            
            

            # if bcrypt.checkpw(user_data['password'].encode('utf-8'), user['password']):
            #     self.send_response(200)
            #     response = {'messagee': "Signed In"}
            #     print('signed in')
            # else:
            #     self.send_response(400)
            #     response = {'message': "Incorrect password."}
            #     print('Incorrect password.')


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
                print("Email already exists.")
                return
            
            try:
                hashed_password = bcrypt.hashpw(user_data['password'].encode('utf-8'), bcrypt.gensalt())
                user_data['password'] = hashed_password
                # user_data['status'] = 'active'
                collection.insert_one(user_data)
                db.user.insert_one({
                    "username": user_data['name'],
                    "email": user_data['email'],
                    "role": "view-only",
                    "company": user_data['company'],
                    "status": "active"
                })
                user_doc = db.user.find_one({'email': user_data['email']}, {'_id': 1})
                response = {'message': f'User registered successfully.'}

                db.companies.update_one(
                    {'name': user_data['company']},
                    {
                        '$push': {'users': user_doc['_id']}
                    }
                )

            except Exception as e:
                print(f"Error inserting into MongoDB: {e}")
                self.send_response(500) 
                response = {'message': str(e)}


            self.wfile.write(json.dumps(response).encode())

        else:
            self.send_response(404)
            self.end_headers()
            response = {'message': 'Not found'}
            print('API endpoint not found.')
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
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()

            try:
                # status_doc = list(collection.find({}, {"status": 1}))
                users = list(db.user.find({}, {"_id": 0}))

                # for i in range(len(users)):
                #     if i < len(status_doc):
                #         users[i]['status'] = status_doc[i]['status']
                #     i+=1

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
        
        elif self.path.startswith('/makeAsAdmin'):
            email = self.path.split('=')[-1] 
            db.user.update_one({'email': email}, {"$set": {'status': "active"}})
            collection.update_one({'email': email}, {"$set": {'status': "active"}})
            self.send_response(200)
            response = {'message': 'User role updated to admin.'}
            self.wfile.write(json.dumps(response).encode())

        elif self.path.startswith('/dismissAsAdmin'):
            email = self.path.split("=")[-1]
            db.user.update_one({'email': email}, {"$set": {'status': "deactive"}})
            collection.update_one({'email': email}, {"$set": {'status': "deactive"}})
            self.send_response(200)
            response = {'message': 'User role updated to view-only.'}
            self.wfile.write(json.dumps(response).encode())

        elif self.path.startswith('/deleteUser'):
            email = self.path.split("=")[-1]
            db.user.delete_one({'email': email})
            collection.delete_one({'email': email})
            self.send_response(200)
            response = {'message': 'User deleted successfully.'}
            self.wfile.write(json.dumps(response).encode())

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
