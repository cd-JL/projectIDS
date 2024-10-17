import http.server
import socketserver
import json
from pymongo import MongoClient
import bcrypt
import os
from dotenv import load_dotenv

# Load environment variables from the .env.local file
parent_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'projectVD')
env_path = os.path.join(parent_directory, '.env.local')
load_dotenv(env_path)

# Fetch MongoDB URI
mongo_uri = os.getenv("MONGODB_URI")
client = MongoClient(mongo_uri)
db = client.projectv
collection = db.sign_in

class SignInHandler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
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
        else:
            self.send_response(404)
            self.end_headers()
            response = {'message': 'Not found'}
            print('api')
            self.wfile.write(json.dumps(response).encode())

PORT = 8000
with socketserver.TCPServer(("", PORT), SignInHandler) as httpd:
    print(f"Server running on port {PORT}")
    httpd.serve_forever()
