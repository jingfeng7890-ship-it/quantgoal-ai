import hashlib
import json
import time

def generate_prediction_signature(match_id, model_name, prediction, timestamp=None):
    """
    Creates a cryptographic signature (SHA-256) for a prediction record.
    Proof that this prediction existed at this time and hasn't been altered.
    """
    if timestamp is None:
        timestamp = int(time.time())
    
    # The 'Payload' that we simulate putting on-chain
    # Format: MATCH_ID|MODEL|PREDICTION|TIMESTAMP
    payload = f"{match_id}|{model_name}|{prediction}|{timestamp}"
    
    # Create Hash
    signature_hash = hashlib.sha256(payload.encode('utf-8')).hexdigest()
    
    return {
        "hash": signature_hash,
        "payload": payload,
        "timestamp": timestamp
    }

def verify_signature(signature_data):
    """
    Verifies if a hash matches its payload.
    """
    payload = signature_data.get('payload')
    claimed_hash = signature_data.get('hash')
    
    recalc_hash = hashlib.sha256(payload.encode('utf-8')).hexdigest()
    
    return recalc_hash == claimed_hash
