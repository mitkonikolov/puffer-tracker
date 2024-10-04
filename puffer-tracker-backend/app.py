import atexit
import json
import logging
from datetime import datetime, timezone

from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from web3 import Web3

from config import Config


# Initialize app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:5000"]}})
app.config.from_object(Config)

# Set logging level
logging.basicConfig(level=logging.INFO)

# Initialize MongoDB
mongo = PyMongo(app)

# Initialize Web3
web3 = Web3(Web3.HTTPProvider(app.config['WEB3_PROVIDER_URI']))

# Load contract ABI
with open(app.config['ABI_FILE'], 'r') as abi_file:
    contract_abi = json.load(abi_file)

# Setup contract
puffer_vault = web3.eth.contract(
    address=Web3.to_checksum_address(app.config['PUFFERVAULT_ADDRESS']),
    abi=contract_abi
)

# GET current conversion rate
@app.route('/conversion-rate', methods=['GET'])
def get_conversion_rate():
    try:
        conversion_rate = fetch_conversion_rate()
        return jsonify({
            'conversion_rate': conversion_rate,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 200
    except Exception as e:
        logging.exception(f"Error fetching conversion rate: {e}")
        return jsonify({'error': str(e)}), 500        

# GET historical rates
@app.route('/historical-rates', methods=['GET'])
def get_historical_rates():
    try:
        historical_rates = list(mongo.db.conversion_rates.find({}, {'_id': 0}).sort('timestamp', -1))
        return jsonify(historical_rates), 200
    except Exception as e:
        logging.exception(f"Error fetching historical rates: {e}")
        return jsonify({'error': str(e)}), 500

def fetch_conversion_rate():
    total_assets = puffer_vault.functions.totalAssets().call()
    total_supply = puffer_vault.functions.totalSupply().call()

    if total_supply:
        return (total_assets / total_supply)
    else:
        raise Exception(f"Failed fetching conversion rate. total_assets: {total_assets}\ntotal_supply: {total_supply}")

def save_conversion_rate():
    try:
        conversion_rate = fetch_conversion_rate()

        result = mongo.db.conversion_rates.insert_one({
            'conversion_rate': conversion_rate,
            'timestamp': datetime.now(timezone.utc).isoformat()
        })

        if result.inserted_id:
            logging.info(f"Successfully saved conversion rate {conversion_rate} at {datetime.now(timezone.utc).isoformat()}")
        else:
            logging.error("Failed to save data to MongoDB")
    except Exception as e:
        logging.exception(f"Error in save_conversion_rate: {e}")

def init_scheduler():
    try:
        scheduler = BackgroundScheduler()
        scheduler.add_job(func=save_conversion_rate, trigger="interval", minutes=1)
        scheduler.start()
        logging.info("Scheduler started.")
        return scheduler
    except Exception as e:
        logging.exception("Error initializing scheduler: %s", e)

scheduler = init_scheduler()

def shutdown_scheduler():
    if scheduler.running:
        try:
            logging.info("Scheduler shutting down...")
            scheduler.shutdown()
            logging.info("Scheduler successfully shut down.")
        except Exception as e:
            logging.exception(f"Error shutting down scheduler: {e}")

atexit.register(lambda: shutdown_scheduler())

if __name__ == '__main__':
    logging.info("Starting Flask app...")
    app.run(debug=False)
