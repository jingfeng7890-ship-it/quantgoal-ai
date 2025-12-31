import os
import requests
import json
from pathlib import Path
from dotenv import load_dotenv

# Load env from the same directory as the script
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

ODDS_API_KEY = os.getenv("ODDS_API_KEY")

def fetch_real_schedule():
    if not ODDS_API_KEY:
        print("❌ ERROR: ODDS_API_KEY not found in .env")
        return

    # Sports to fetch (Top 5 Leagues)
    sports = [
        'soccer_epl',
        'soccer_spain_la_liga', 
        'soccer_italy_serie_a',
        'soccer_germany_bundesliga',
        'soccer_france_ligue_one'
    ]
    
    all_matches = []

    print(f"📡 Fetching Real Data from The-Odds-API (Key: {ODDS_API_KEY[:5]}...)...")

    for sport in sports:
        try:
            url = f"https://api.the-odds-api.com/v4/sports/{sport}/odds/?apiKey={ODDS_API_KEY}&regions=uk&markets=h2h&oddsFormat=decimal"
            response = requests.get(url)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ {sport}: Found {len(data)} matches.")
                
                # Take the first 2 matches from each league to limit API usage/demo size
                for match in data[:2]:
                    # Extract best odds (using average or first bookmaker)
                    bookmakers = match.get('bookmakers', [])
                    if not bookmakers: continue
                    
                    # Use William Hill or Bet365 or first available
                    bm = next((b for b in bookmakers if b['key'] in ['williamhill', 'bet365']), bookmakers[0])
                    
                    # Get 1x2 coefficients
                    outcomes = bm['markets'][0]['outcomes']
                    home_odd = next((o['price'] for o in outcomes if o['name'] == match['home_team']), 0)
                    away_odd = next((o['price'] for o in outcomes if o['name'] == match['away_team']), 0)
                    draw_odd = next((o['price'] for o in outcomes if o['name'] == 'Draw'), 0)
                    
                    all_matches.append({
                        "league": sport,
                        "home": match['home_team'],
                        "away": match['away_team'],
                        "time": match['commence_time'],
                        "odds": {
                            "home": home_odd,
                            "draw": draw_odd,
                            "away": away_odd
                        }
                    })
            else:
                print(f"⚠️ {sport} Fetch Failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"❌ Error fetching {sport}: {e}")

    print("\n--- REAL MATCH SLATE ---")
    print(json.dumps(all_matches, indent=2))

if __name__ == "__main__":
    fetch_real_schedule()
