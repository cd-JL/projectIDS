import http.server
import socketserver
import json
from pymongo import MongoClient
import bcrypt

mongo_uri = "mongodb+srv://lamjulienrd:3zgtpYc34JaYU9l3@projectv.sxtlx.mongodb.net/?retryWrites=true&w=majority&appName=projectv"
client = MongoClient(mongo_uri)
db = client.projectv
collection = db.sign_in


class SignUpHandler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if self.path == '/signUp':
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
                    response = {'message': "Email already exist."}
                    self.wfile.write(json.dumps(response).encode())
                    print("email alrady exist")
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
            self.wfile.write(json.dumps(response).encode())
    


PORT = 8000
with socketserver.TCPServer(("", PORT), SignUpHandler) as httpd:
    print(f"Server running on port {PORT}")
    httpd.serve_forever()