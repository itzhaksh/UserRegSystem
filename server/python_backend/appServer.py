import os
import re
import bcrypt
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

load_dotenv()

app = Flask(__name__)
CORS(app)
limiter = Limiter(app, key_func=get_remote_address)

MONGO_URI = os.getenv("MONGO_URI")
NODEJS_URL = os.getenv("NODEJS_URL")

if not MONGO_URI:
    raise ValueError("No MONGO_URI environment variable set")
print(f"Connecting to MongoDB using URI: {MONGO_URI}")

try:
    client = MongoClient(MONGO_URI)
    db = client["user_auth_db"]
    users_collection = db["users"]
    client.admin.command("ping")
    print("Successfully connected to MongoDB")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

def is_valid_email(email):
    return bool(re.match(r"[^@]+@[^@]+\.[^@]+", email))

@app.route("/register", methods=["POST"])
@limiter.limit("5 per minute")
def register():
    try:
        data = request.get_json()
        firstName = data.get("firstName")
        lastName = data.get("lastName")
        email = data.get("email")
        password = data.get("password")

        if not firstName or not lastName:
            return jsonify({"error": "First name and last name are required"}), 400

        if not email or not is_valid_email(email):
            return jsonify({"error": "Invalid email format"}), 400

        if not password or len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters long"}), 400

        if users_collection.find_one({"email": email}):
            return jsonify({"error": "Email already exists"}), 400

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

        user = {"firstName": firstName, "lastName": lastName, "email": email, "password": hashed_password}
        users_collection.insert_one(user)

        response = requests.get(f"http://{NODEJS_URL}/random-message")
        message = response.json().get("message", "Welcome!")

        return jsonify({"message": "User registered successfully", "random_message": message}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/login", methods=["POST"])
@limiter.limit("5 per minute")
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        user = users_collection.find_one({"email": email})
        if not user:
            return jsonify({"error": "User not found"}), 404

        if bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
            response = requests.get(f"http://{NODEJS_URL}/random-message")
            message = response.json().get("message", "Welcome!")

            return jsonify({"message": "Login successful", "random_message": message}), 200
        else:
            return jsonify({"error": "Invalid password"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80, debug=True)
