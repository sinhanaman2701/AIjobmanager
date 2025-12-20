import os
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import certifi

load_dotenv()

class Database:
    def __init__(self):
        self.uri = os.getenv("MONGO_URI")
        self.client = None
        self.db = None
        self.jobs_collection = None
        self.resumes_collection = None
        self.waitlist_collection = None

    def connect(self):
        if not self.uri:
            print("MongoDB URI not found in .env")
            return
        try:
            # Create a new client and connect to the server
            self.client = MongoClient(self.uri, server_api=ServerApi('1'), tlsCAFile=certifi.where())
            
            # Send a ping to confirm a successful connection
            self.client.admin.command('ping')
            print("Pinged your deployment. You successfully connected to MongoDB!")
            
            self.db = self.client.get_database("linkedin_jobs")
            self.jobs_collection = self.db.get_collection("jobs")
            self.resumes_collection = self.db.get_collection("resumes")
            self.waitlist_collection = self.db.get_collection("waitlistform")
            
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")

    def save_job(self, job_data):
        if self.jobs_collection is not None:
             # Basic schema validation could go here
            return self.jobs_collection.insert_one(job_data)
        return None
    
    def save_jobs(self, jobs_list):
        if self.jobs_collection is not None and jobs_list:
            # Use ordered=False to continue inserting if some duplicates fail (if unique index exists)
            try:
                return self.jobs_collection.insert_many(jobs_list, ordered=False)
            except Exception as e:
                print(f"Error bulk saving jobs: {e}")
                return None

    def save_resume(self, resume_data):
        if self.resumes_collection is not None:
            return self.resumes_collection.insert_one(resume_data)
        return None

    def save_waitlist_entry(self, entry_data):
        if self.waitlist_collection is None:
            print("Collection is None, attempting to reconnect...")
            self.connect()

        if self.waitlist_collection is not None:
            try:
                return self.waitlist_collection.insert_one(entry_data)
            except Exception as e:
                print(f"Error inserting waitlist entry: {e}")
                return None
        else:
            print("Error: waitlist_collection is still None after reconnect attempt.")
            return None

# Create a global instance
db = Database()
