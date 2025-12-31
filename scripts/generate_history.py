
import json
import random
from datetime import datetime, timedelta

# Load existing data
with open('public/champion_league_data.json', 'r') as f:
    data = json.load(f)

models = data['models']
today = datetime(2025, 12, 14)

def generate_history(model_stats, days=30):
    history = []
    current_balance = 10000.0
    roi_target = model_stats['roi'] / 100.0
    
    # Calculate daily drift needed to hit target ROI roughly
    daily_drift = (roi_target * 10000) / days

    for i in range(days):
        date = (today - timedelta(days=days-1-i)).strftime('%Y-%m-%d')
        
        # Volatility based on ROI magnitude (higher ROI = higher variance)
        volatility = max(50, abs(daily_drift) * 2) 
        
        daily_pnl = random.gauss(daily_drift, volatility)
        
        # Ensure winning models trend up, losing trend down generally
        if roi_target > 0 and random.random() < 0.6:
            daily_pnl = abs(daily_pnl)
        elif roi_target < 0 and random.random() < 0.6:
             daily_pnl = -abs(daily_pnl)

        bets = random.randint(3, 12)
        current_balance += daily_pnl
        
        history.append({
            "date": date,
            "bets_placed": bets,
            "core_pnl": round(daily_pnl * 0.5, 2),
            "challenge_pnl": round(daily_pnl * 0.3, 2),
            "high_yield_pnl": round(daily_pnl * 0.2, 2),
            "total_pnl": round(daily_pnl, 2),
            "wallet_balance": round(current_balance, 2)
        })
    return history

# Apply to all models
for key, model in models.items():
    print(f"Generating history for {key}...")
    model['history'] = generate_history(model['stats'])

# Save back
with open('public/champion_league_data.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Done! History generated.")
