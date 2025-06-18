import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()  

mongo_uri = os.getenv("MONGO_URI")
db_name = os.getenv("MONGO_DB_NAME")
collection_name = os.getenv("MONGO_COLLECTION_NAME")

client = MongoClient(mongo_uri)
db = client[db_name]
overlays_collection = db[collection_name]
