from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from email_validator import validate_email, EmailNotValidError
import time
from database import db
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize Rate Limiter
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

# Connect to Database
print("Connecting to Database...")
db.connect()
print("Database Connected!")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Backend is running"}), 200

@app.route('/api/waitlist', methods=['POST'])
@limiter.limit("5 per minute")
def submit_waitlist():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        required_fields = ['first_name', 'email']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Input Sanitization and Validation
        first_name = str(data.get('first_name', '')).strip()
        email = str(data.get('email', '')).strip()
        phone = str(data.get('phone', '')).strip()
        
        if len(first_name) > 100:
             return jsonify({"error": "Name is too long"}), 400
             
        if len(email) > 255:
             return jsonify({"error": "Email is too long"}), 400

        try:
            # Validate email
            valid = validate_email(email)
            email = valid.email 
        except EmailNotValidError as e:
            return jsonify({"error": str(e)}), 400

        # Prepare sanitized data
        entry = {
            "first_name": first_name,
            "email": email,
            "phone": phone, # Phone is optional
            "reason": data.get('reason', ''),
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        
        # Save to MongoDB
        result = db.save_waitlist_entry(entry)
        
        if result:
            return jsonify({"message": "Successfully added to waitlist", "id": str(result.inserted_id)}), 201
        else:
            return jsonify({"error": "Internal Server Error"}), 500
            
    except Exception as e:
        print(f"Waitlist submission error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route('/api/logs', methods=['GET'])
def get_logs():
    """Return the latest logs"""
    return jsonify({"logs": ["Logs functionality reset"]})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
