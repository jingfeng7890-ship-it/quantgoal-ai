import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client

# Load Env
load_dotenv(dotenv_path='backend/.env')

url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Supabase Keys missing in backend/.env")
    exit()

supabase: Client = create_client(url, key)

def migrate_matches():
    print("Migrating Matches...")
    try:
        with open('public/matches_data_v4.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        count = 0
        for m in data:
            # Check if exists
            res = supabase.table('matches').select('*').eq('external_id', m['id']).execute()
            if not res.data:
                payload = {
                    "external_id": m['id'],
                    "league": m['match_info']['league'],
                    "home_team": m['match_info']['home_team'],
                    "away_team": m['match_info']['away_team'],
                    "match_time": m['match_info']['date'],
                    "status": "SCHEDULED", # Default
                    "odds_data": m['match_info']['real_odds'],
                    "quant_analysis": m['quant_analysis'],
                    "models_data": m.get('models', {})
                }
                supabase.table('matches').insert(payload).execute()
                count += 1
        print(f"✅ Migrated {count} new matches.")
    except Exception as e:
        print(f"Match Migration Failed: {e}")

def migrate_parlays():
    print("Migrating Parlay History...")
    try:
        with open('public/parlay_history.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        count = 0
        for t in data:
            res = supabase.table('parlay_tickets').select('*').eq('ticket_id', t['id']).execute()
            if not res.data:
                payload = {
                    "ticket_id": t['id'],
                    "date": t['date'],
                    "type": t['type'],
                    "legs": t['legs'],
                    "total_odds": t['total_odds'],
                    "stake": t['stake'],
                    "status": t['status'],
                    "pnl": t.get('pnl', 0),
                    "roi": t.get('roi', '0%'),
                    "verified_on": t.get('verified_on', 'QuantChain')
                }
                supabase.table('parlay_tickets').insert(payload).execute()
                count += 1
        print(f"✅ Migrated {count} parlay tickets.")
    except Exception as e:
        print(f"Parlay Migration Failed: {e}")

if __name__ == "__main__":
    confirm = input("Are you sure you want to write to Production DB? (y/n): ")
    if confirm.lower() == 'y':
        migrate_matches()
        migrate_parlays()
