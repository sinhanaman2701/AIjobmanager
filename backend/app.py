from flask import Flask, request, jsonify
from flask_cors import CORS
import time
from database import db
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Connect to Database
print("Connecting to Database...")
db.connect()
print("Database Connected!")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Backend is running"}), 200

@app.route('/api/waitlist', methods=['POST'])
def submit_waitlist():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        required_fields = ['first_name', 'email']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400
                
        # Add timestamp
        data['timestamp'] = time.strftime("%Y-%m-%d %H:%M:%S")
        
        # Save to MongoDB
        result = db.save_waitlist_entry(data)
        
        if result:
            return jsonify({"message": "Successfully added to waitlist", "id": str(result.inserted_id)}), 201
        else:
            return jsonify({"error": "Failed to save to database - DB Error"}), 500
            
    except Exception as e:
        print(f"Waitlist submission error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/logs', methods=['GET'])
def get_logs():
    """Return the latest logs"""
    return jsonify({"logs": ["Logs functionality reset"]})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
