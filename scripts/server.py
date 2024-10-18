import http.server
import os
import socketserver
import json
from dotenv import load_dotenv
from pymongo import MongoClient
import bcrypt

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

            email = self.path.split('=')[-1]  # Extract email from the query string
            user = collection.find_one({"email": email}, {"_id": 0, "password": 0})  # Exclude password

            if user:
                self.wfile.write(json.dumps(user).encode())
            else:
                self.send_response(404)
                response = {'message': "User not found."}
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
