import os
import requests
import json
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime

env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

APIFOOTBALL_KEY = os.getenv("APIFOOTBALL_KEY")

def fetch_specific_date():
    if not APIFOOTBALL_KEY:
        print("❌ ERROR: APIFOOTBALL_KEY not found.")
        return

    # HARDCODING 2024-12-14 just to check if data exists for "Real World"
    # Assuming the user's system clock (2025) might be ahead of API reality.
    target_date = "2024-12-14" 
    
    print(f"📡 API-Football: Fetching matches for {target_date}...")
    
    url = "https://v3.football.api-sports.io/fixtures"
    headers = {
        'x-rapidapi-host': "v3.football.api-sports.io",
        'x-rapidapi-key': APIFOOTBALL_KEY
    }
    
    # Premier League (39)
    # Season 2024 (covers 2024-2025)
    params = {"date": target_date, "league": 39, "season": 2024}
    
    try:
        response = requests.get(url, headers=headers, params=params)
        data = response.json()
        
        print(f"Status: {response.status_code}")
        
        if 'errors' in data and data['errors']:
             print(f"❌ API Error: {data['errors']}")
             return

        results = data.get('response', [])
        print(f"✅ Found {len(results)} matches.")
        
        all_matches = []
        for match in results:
             all_matches.append({
                 "home": match['teams']['home']['name'],
                 "away": match['teams']['away']['name'],
                 "date": match['fixture']['date'],
                 "status": match['fixture']['status']['long']
             })
             
        print(json.dumps(all_matches, indent=2))
        
    except Exception as e:
        print(f"❌ Exception: {e}")

if __name__ == "__main__":
    fetch_specific_date()
