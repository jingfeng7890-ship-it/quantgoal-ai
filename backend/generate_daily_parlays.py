import json
import os
import random
from datetime import datetime

from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client, Client

env_path = 'backend/.env'
load_dotenv(dotenv_path=env_path)

url: str = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

# CONSTANTS - Now redundant but kept for logic
# MATCHES_FILE = 'public/matches_data_v4.json' 
# HISTORY_FILE = 'public/parlay_history.json'

def generate_daily_picks():
    print("[PARLAY_BOT] Auto-generating Daily Official Picks...")
    
    # 1. Load Matches
    # 1. Load Matches from DB
    response = supabase.table('matches').select('*').execute()
    matches = response.data

    if not matches:
        return
    
    # Pre-process matches to match old structure if needed
    # The DB structure is flat: {id, quant_analysis, ...}
    # My logic below expects 'quant_analysis' in m

    # 2. Strategy: Select Best "Safe" Picks (High Confidence, Positive Edge)
    candidates = []
    for m in matches:
        rec = m.get('quant_analysis', {}).get('recommendations', {}).get('1x2')
        if rec and rec.get('confidence', 0) >= 6 and float(rec.get('value_gap', '0').replace('%','')) > 0:
            candidates.append({
                'match': f"{m['match_info']['home_team']} vs {m['match_info']['away_team']}",
                'selection': rec['selection'],
                'market': 'Moneyline',
                'odds': rec['market_odds'],
                'confidence': rec['confidence']
            })
    
    # Sort by confidence
    candidates.sort(key=lambda x: x['confidence'], reverse=True)
    
    if len(candidates) < 2:
        print("[PARLAY_BOT] Not enough high-confidence matches for a parlay.")
        return

    # 3. Create Tickets for different strategies
    today_str = datetime.now().strftime('%Y-%m-%d')
    new_tickets = []

    # Strategy Configs
    strategies = [
        {"name": "Safe 2-Fold", "legs": 2, "risk": "Low"},
        {"name": "Balanced 3-Fold", "legs": 3, "risk": "Med"},
        {"name": "Degen 4-Fold", "legs": 4, "risk": "High"}
    ]

    for strat in strategies:
        try:
            count = strat["legs"]
            # Shuffle and pick 'count' candidates
            # (In a real engine, this would use specific correlation logic per strategy)
            available = candidates[:]
            if strat["risk"] == "Low":
                available = [c for c in candidates if c['odds'] < 1.8]
            elif strat["risk"] == "High":
                available = [c for c in candidates if c['odds'] > 2.0 or c['confidence'] < 8]
            
            if len(available) < count:
                available = candidates[:] # Fallback to all
                
            random.shuffle(available)
            selected = available[:count]
            
            if len(selected) < count:
                continue

            total_odds = 1.0
            for leg in selected:
                total_odds *= leg['odds']
            total_odds = round(total_odds, 2)

            new_ticket = {
                "id": f"tx_{strat['legs']}F_{random.randint(10000,99999)}",
                "date": today_str,
                "type": f"{strat['legs']}-Fold",
                "legs": [{
                    "match": l['match'], 
                    "selection": l['selection'], 
                    "result": "Pending"
                } for l in selected],
                "total_odds": total_odds,
                "stake": 100,
                "status": "PENDING",
                "pnl": 0,
                "roi": "0%",
                "verified_on": f"QuantChain {strat['risk']}"
            }
            new_tickets.append(new_ticket)
        except Exception as e:
            print(f"Skipping strategy {strat['name']}: {e}")

    # 4. Save to Supabase
    existing_today = supabase.table('parlay_tickets').select('*').eq('date', today_str).ilike('verified_on', '%QuantChain%').execute()
    
    if not existing_today.data:
        print(f"[PARLAY_BOT] 🆕 Generated {len(new_tickets)} System Tickets for {today_str}")
        for t in new_tickets:
            payload = {
                "ticket_id": t['id'],
                "date": t['date'],
                "type": t['type'],
                "legs": t['legs'],
                "total_odds": t['total_odds'],
                "stake": t['stake'],
                "status": "PENDING",
                "pnl": 0,
                "roi": "0%",
                "verified_on": t['verified_on']
            }
            try:
                supabase.table('parlay_tickets').insert(payload).execute()
            except Exception as e:
                print(f"Error inserting ticket: {e}")
    else:
        print("[PARLAY_BOT] ✅ System Tickets for today already exist. Skipping.")
        # Optional: Print existing for confirmation?
    else:
        print("[PARLAY_BOT] ✅ System Tickets for today already exist. Skipping.")

if __name__ == "__main__":
    generate_daily_picks()
