import json
import os
from datetime import datetime

DECISION_LEDGER_PATH = os.path.join(os.path.dirname(__file__), '../public/decision_ledger.json')

def log_decision(model_name, match, selection, odds, confidence, rationale):
    """
    Log a new prediction decision to the ledger.
    """
    entry = {
        "timestamp": datetime.now().isoformat(),
        "type": "PREDICTION",
        "model": model_name,
        "match": match,
        "selection": selection,
        "odds": odds,
        "confidence": confidence,
        "rationale": rationale,
        "status": "PENDING"
    }
    _write_to_ledger(entry)

def log_settlement(model_name, match, result, pnl):
    """
    Log the settlement of a prediction to the ledger.
    """
    entry = {
        "timestamp": datetime.now().isoformat(),
        "type": "SETTLEMENT",
        "model": model_name,
        "match": match,
        "result": result,
        "pnl": pnl
    }
    _write_to_ledger(entry)

def _write_to_ledger(entry):
    ledger = []
    if os.path.exists(DECISION_LEDGER_PATH):
        try:
            with open(DECISION_LEDGER_PATH, 'r', encoding='utf-8') as f:
                ledger = json.load(f)
        except:
            ledger = []
    
    # Append new entry
    ledger.append(entry)
    
    # Keep last 1000 entries for performance
    if len(ledger) > 1000:
        ledger = ledger[-1000:]
        
    with open(DECISION_LEDGER_PATH, 'w', encoding='utf-8') as f:
        json.dump(ledger, f, indent=2, ensure_ascii=False)
