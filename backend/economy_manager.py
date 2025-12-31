import json
import os
from datetime import datetime

ECONOMY_DATA_PATH = os.path.join(os.path.dirname(__file__), '../public/economy_data.json')

PRICING_MODEL = {
    "STARTER": {"price_usd": 0.99, "coins": 1000, "description": "Entry-level Black Swan hedging."},
    "PRO": {"price_usd": 4.99, "coins": 6000, "description": "The long-term strategist's toolkit."},
    "STRATEGIC": {"price_usd": 9.99, "coins": 13000, "description": "High-stakes Arena domination."}
}

INITIAL_GRANT = 10000

def get_economy_state():
    if not os.path.exists(ECONOMY_DATA_PATH):
        return {"users": {}, "global_stats": {"total_coins_issued": 0, "total_burn": 0}}
    with open(ECONOMY_DATA_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def initialize_user_economy(user_id):
    data = get_economy_state()
    if user_id not in data['users']:
        data['users'][user_id] = {
            "balance": INITIAL_GRANT,
            "transactions": [{
                "timestamp": datetime.now().isoformat(),
                "type": "GRANT",
                "amount": INITIAL_GRANT,
                "description": "Initial Central Bank Grant"
            }]
        }
        data['global_stats']['total_coins_issued'] += INITIAL_GRANT
        _save_economy(data)
    return data['users'][user_id]

def purchase_coins(user_id, package_type):
    if package_type not in PRICING_MODEL:
        return False
    
    data = get_economy_state()
    package = PRICING_MODEL[package_type]
    
    if user_id not in data['users']:
        initialize_user_economy(user_id)
        
    data['users'][user_id]['balance'] += package['coins']
    data['users'][user_id]['transactions'].append({
        "timestamp": datetime.now().isoformat(),
        "type": "PURCHASE",
        "package": package_type,
        "amount": package['coins'],
        "price_usd": package['price_usd']
    })
    data['global_stats']['total_coins_issued'] += package['coins']
    _save_economy(data)
    return True

def _save_economy(data):
    with open(ECONOMY_DATA_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
