import os
import requests
import json
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

APIFOOTBALL_KEY = os.getenv("APIFOOTBALL_KEY")

def fetch_next_fixtures():
    if not APIFOOTBALL_KEY:
        print("❌ ERROR: APIFOOTBALL_KEY not found.")
        return

    print(f"📡 API-Football: Fetching next 5 matches for EPL (League 39)...")
    
    url = "https://v3.football.api-sports.io/fixtures"
    headers = {
        'x-rapidapi-host': "v3.football.api-sports.io",
        'x-rapidapi-key': APIFOOTBALL_KEY
    }
    
    # Try getting NEXT 5 matches for Premier League (39)
    # We remove 'date' and 'season' to just get whatever is next.
    params = {"league": 39, "next": 5}
    
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
    fetch_next_fixtures()
