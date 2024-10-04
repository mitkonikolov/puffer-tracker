import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')

    MONGO_URI = os.getenv('MONGO_URI')

    WEB3_PROVIDER_URI = os.getenv('WEB3_PROVIDER_URI')

    PUFFERVAULT_ADDRESS = os.getenv('PUFFERVAULT_ADDRESS')

    ABI_FILE = 'abi.json'
