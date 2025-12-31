import os
import requests
import json
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

# Load env from the same directory as the script
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

APIFOOTBALL_KEY = os.getenv("APIFOOTBALL_KEY")

def fetch_football_api_fixtures():
    if not APIFOOTBALL_KEY:
        print("❌ ERROR: APIFOOTBALL_KEY not found in .env")
        return

    # Use today's date
    today = datetime.now().strftime("%Y-%m-%d")
    print(f"📡 Fetching Real Data from API-Football (Key: {APIFOOTBALL_KEY[:5]}...) for {today}...")

    url = "https://v3.football.api-sports.io/fixtures"
    headers = {
        'x-rapidapi-host': "v3.football.api-sports.io",
        'x-rapidapi-key': APIFOOTBALL_KEY
    }
    
    # Fetch 5 top leagues
    # 39: Premier League, 140: La Liga, 135: Serie A, 78: Bundesliga, 61: Ligue 1
    leagues = [39, 140, 135, 78, 61]
    
    all_matches = []
    
    for league_id in leagues:
        params = {"date": today, "league": league_id, "season": 2025} # Assuming current season is 2025 based on demo environment, but API might need 2024 or 2025. 
        # Actually usually it is 2024 for 24/25. Let's try 2024 first as 2025 might be future.
        # Wait, the simulated date in the JSON was 2025. This suggests the "World" is in 2025. 
        # But real API needs real year. Today is 2024 (in real life) or 2025? 
        # The user instructions timestamp says 2025-12-14. 
        # If the user's "local time" provided in system prompt is 2025, then I should use 2025.
        # System timestamp says: "The current local time is: 2025-12-14T10:06:13+08:00."
        # SO I MUST USE 2025.
        
        try:
            response = requests.get(url, headers=headers, params=params)
            
            if response.status_code == 200:
                data = response.json()
                results = data.get('response', [])
                print(f"✅ League {league_id}: Found {len(results)} matches.")
                
                for match in results[:2]:
                    fixture = match['fixture']
                    teams = match['teams']
                    all_matches.append({
                        "league_id": league_id,
                        "home": teams['home']['name'],
                        "away": teams['away']['name'],
                        "date": fixture['date'],
                        "status": fixture['status']['short']
                    })
            else:
                 print(f"⚠️ League {league_id} Fetch Failed: {response.status_code} - {response.text}")

        except Exception as e:
            print(f"❌ Error fetching league {league_id}: {e}")

    print("\n--- REAL API-FOOTBALL SLATE ---")
    print(json.dumps(all_matches, indent=2))

if __name__ == "__main__":
    fetch_football_api_fixtures()
