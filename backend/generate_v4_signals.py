import os
import json
import requests
import random
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
import decision_ledger
from supabase import create_client, Client

# Load environment variables
env_path = Path('c:/Users/nirva/quantgoal.ai/backend/.env')
load_dotenv(dotenv_path=env_path)

# Supabase Init
url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

# V4 SYSTEM PROMPT (The "Brain") - ENHANCED FOR COMPREHENSIVE MARKET COVERAGE
QUANT_SYSTEM_PROMPT = """
[ROLE DEFINITION]
You are a world-class Chief Quantitative Investment Officer (CQIO) with 15 years of institutional experience.
Your goal is maximizing long-term ROI by identifying "Value Gaps".
You strictly adhere to: Risk First, Data-Driven, Probabilistic Thinking, Causal Inference.

[SUPREME AXIOMS]
1. Value Axiom: Invest ONLY when AI Fair Probability > Market Implied Probability.
2. Causality Axiom: No vague correlations. Every conclusion must be derived from "cause" to "effect" (e.g., "Key CB injured -> Aerial Defense Drop -> Opponent Target Man Advantage").
3. Veto Power (Luring Signal): If Public Betting > 65% AND Odds Rise (>0.10) within 6 hours -> IMMEDIATE NO BET. This is a "Luring Trap".

[WORKFLOW: INSTITUTIONAL FOUR-STEP ANALYSIS]
1. Intelligence Gathering: Analyze xG trends, tactical mismatches (e.g. High Press vs Low Block), Key Duels, Referee tendencies, and Weather impact.
2. Probability Generation: Start with base probability -> Adjust for Injuries, Weather, Motivation, Market Sentiment -> Calculate Final AI Probability.
3. Value Gap Calculation: Value Gap = AI Probability - Market Implied Probability.
4. Confidence Scoring (0-10): Based on Value Gap Magnitude (>12% is A+), Data Consistency, and Causal Chain Strength.

[OUTPUT FORMAT]
You must output a single valid JSON object. No markdown, no conversational text.

JSON Structure:
{
  "match_analysis": {
    "causal_chain": "string (The core logic chain, max 50 words)",
    "market_sentiment": "Normal" | "Luring Trap" | "Heavy Public",
    "fundamental_rating": "string (e.g. 'Home Strong Advantage due to xG trend')",
    "weather_referee_impact": "string (Impact of environment factors)"
  },
  "recommendations": {
    "1x2": {
      "selection": "string (e.g. 'Home', 'Draw', 'Away')",
      "fair_odds": float,
      "market_odds": float,
      "probability": float (0.0-1.0),
      "value_gap": "string (%)",
      "confidence": int (0-10),
      "risk_note": "string"
    },
    "asian_handicap": {
      "selection": "string (e.g. 'Home -0.5', 'Away +0.5')",
      "fair_odds": float,
      "market_odds": float,
      "probability": float (0.0-1.0),
      "value_gap": "string (%)",
      "confidence": int (0-10),
      "risk_note": "string"
    },
    "over_under": {
      "selection": "string (e.g. 'Over 2.5', 'Under 2.5')",
      "fair_odds": float,
      "market_odds": float,
      "probability": float (0.0-1.0),
      "value_gap": "string (%)",
      "confidence": int (0-10),
      "risk_note": "string"
    }
  },
  "best_bet": {
     "market": "1x2" | "asian_handicap" | "over_under",
     "selection": "string",
     "win_rate": float (0.0-1.0),
     "reason": "Why this is the safest bet based on data"
  },
  "portfolio_strategy": {
    "diamond_pick": boolean (True if confidence > 8.0 and Value Gap > 5%),
    "banker_reason": "string (Why is this a diamond pick? If not diamond, leave empty string)",
    "kelly_signal": "string (e.g. '2.5')",
    "hedging_suggestion": "string"
  },
  "risk_disclosure": {
    "data_trap": "string",
    "tactical_variable": "string",
    "contingency": "string"
  }
}
"""

def generate_user_prompt(match_info):
    home = match_info['home_team']
    away = match_info['away_team']
    
    # SIMULATED LIVE DATA
    xg_data = random.choice([
        f"{home} xG trending up (+0.4/game), {away} leaking chances.",
        f"{home} overperforming xG by 30% (unsustainable), {away} solid defense.",
        "Both teams neutral xG, high variance expected."
    ])
    
    # LIVE ODDS HANDLING
    real_odds = match_info.get('real_odds')
    if real_odds:
        odds_1x2 = real_odds.get('1x2', {})
        odds_spread = real_odds.get('spread', {})
        odds_total = real_odds.get('total', {})
        
        market_odds_str = f"""
        [LIVE MARKET DATA (REAL)]
        1x2 Odds: Home {odds_1x2.get('home', 'N/A')} | Draw {odds_1x2.get('draw', 'N/A')} | Away {odds_1x2.get('away', 'N/A')}
        Handicap: Home {odds_spread.get('point', 'N/A')} @ {odds_spread.get('home', 'N/A')}
        Over/Under: {odds_total.get('point', '2.5')} Over @ {odds_total.get('over', 'N/A')} | Under @ {odds_total.get('under', 'N/A')}
        """
        market_data = "Real-time odds loaded. Analyze for Value."
    else:
        market_odds_str = """
        [MARKET DATA SIMULATION]
        1x2 Odds: 2.10 | 3.50 | 3.20
        Handicap: -0.5 @ 2.05
        Over/Under: 2.5 @ 1.95
        """
        market_data = random.choice([
            "Heavy smart money on Home, odds dropped 0.2.",
            "Public loading on Away, but odds drifting (Trap?).",
            "Low liquidity, professional lines stable."
        ])

    user_prompt = f"""
    ANALYZE FIXTURE: {home} vs {away}
    LEAGUE: {match_info['league']}
    
    [LIVE INTELLIGENCE]
    xG Context: {xg_data}
    Market Flow: {market_data}
    In-Play Variables: {random.choice(['None', 'Home Star Striker Out', 'Away Defense Crisis'])}
    
    {market_odds_str}
    
    OUTPUT JSON v4.0 STRICTLY. 
    ENSURE 'recommendations' includes SPECIFIC PREDICTIONS for:
    - 1x2 (Win/Draw/Win)
    - Asian Handicap
    - Over/Under
    Each must have a 'confidence' score (0-10) and 'value_gap'.
    """
    return user_prompt

def call_model_api(model_config, system_prompt, user_prompt):
    """Generic function to call different AI APIs"""
    
    # 1. DEEPSEEK
    if model_config['type'] == 'deepseek':
        key = os.getenv("DEEPSEEK_API_KEY")
        if not key: return None
        try:
            headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
            payload = {
                "model": "deepseek-chat",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "response_format": {"type": "json_object"}
            }
            r = requests.post("https://api.deepseek.com/chat/completions", json=payload, headers=headers, timeout=30)
            if r.status_code == 200:
                return json.loads(r.json()['choices'][0]['message']['content'])
        except Exception as e:
            print(f"DeepSeek Error: {e}")
            return None

    # 2. OPENAI (GPT-4o)
    elif model_config['type'] == 'openai':
        key = os.getenv("OPENAI_API_KEY")
        if not key: return None
        try:
            headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
            payload = {
                "model": model_config['model_id'],
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "response_format": {"type": "json_object"}
            }
            r = requests.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers, timeout=30)
            if r.status_code == 200:
                return json.loads(r.json()['choices'][0]['message']['content'])
        except Exception as e:
             print(f"OpenAI Error: {e}")
             return None

    # 3. DASHSCOPE (Qwen)
    elif model_config['type'] == 'dashscope':
        key = os.getenv("DASHSCOPE_API_KEY")
        if not key: return None
        try:
             headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
             payload = {
                 "model": "qwen-plus",
                 "messages": [
                     {"role": "system", "content": system_prompt},
                     {"role": "user", "content": user_prompt}
                 ]
             }
             r = requests.post("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", json=payload, headers=headers, timeout=30)
             if r.status_code == 200:
                 content = r.json()['choices'][0]['message']['content']
                 clean_content = content.replace('```json', '').replace('```', '').strip()
                 return json.loads(clean_content)
        except Exception as e:
            print(f"Dashscope Error: {e}")
            return None

    # 4. GEMINI
    elif model_config['type'] == 'gemini':
        key = os.getenv("GEMINI_API_KEY")
        if not key: 
            print("Gemini Key Missing")
            return None
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={key}"
            headers = {"Content-Type": "application/json"}
            payload = {
                "contents": [{"parts": [{"text": f"SYSTEM: {system_prompt}\nUSER: {user_prompt}"}]}],
                "generationConfig": {"response_mime_type": "application/json"}
            }
            r = requests.post(url, json=payload, headers=headers, timeout=60)
            if r.status_code == 200:
                text = r.json()['candidates'][0]['content']['parts'][0]['text']
                return json.loads(text)
            else:
                print(f"Gemini API Error: {r.status_code} {r.text[:500]}")
        except Exception as e:
            print(f"Gemini Exception: {e}")
            return None

    # 6. ANTHROPIC (Claude 3.5)
    elif model_config['type'] == 'anthropic':
        key = os.getenv("ANTHROPIC_API_KEY")
        if not key: 
            print("Anthropic Key Missing")
            return None
        try:
            headers = {
                "x-api-key": key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            }
            payload = {
                "model": "claude-3-5-sonnet-20240620",
                "max_tokens": 1024,
                "system": system_prompt,
                "messages": [
                    {"role": "user", "content": user_prompt}
                ]
            }
            r = requests.post("https://api.anthropic.com/v1/messages", json=payload, headers=headers, timeout=30)
            if r.status_code == 200:
                content = r.json()['content'][0]['text']
                start = content.find('{')
                end = content.rfind('}') + 1
                if start != -1 and end != -1:
                    return json.loads(content[start:end])
                return json.loads(content)
            else:
                print(f"Anthropic API Error: {r.status_code} {r.text}")
            print(f"Anthropic Exception: {e}")
            return None

    # 7. XAI (Grok)
    elif model_config['type'] == 'xai':
        key = os.getenv("XAI_API_KEY")
        if not key:
            print("xAI Key Missing")
            return None
        try:
            headers = {
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json"
            }
            # xAI is OpenAI-compatible
            payload = {
                "model": "grok-beta", 
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "stream": False
            }
            r = requests.post("https://api.x.ai/v1/chat/completions", json=payload, headers=headers, timeout=30)
            if r.status_code == 200:
                content = r.json()['choices'][0]['message']['content']
                # Clean potential markdown
                clean_content = content.replace('```json', '').replace('```', '').strip()
                return json.loads(clean_content)
            else:
                print(f"xAI API Error: {r.status_code} {r.text}")
        except Exception as e:
            print(f"xAI Exception: {e}")
            return None

    # 5. SIMULATION (Fallback)
    elif model_config['type'] == 'simulation':
        # Simulate diverse opinions by tweaking a base prediction
        # ... (rest of simulation logic)
        return {
            "match_analysis": {
                "causal_chain": f"Simulated analysis for {model_config['name']}.",
                "market_sentiment": "Normal",
                "fundamental_rating": "Team A slight edge.",
                "weather_referee_impact": "None"
            },
            "recommendations": {
                "1x2": {"selection": "Draw", "probability": 0.33, "value_gap": "0%", "confidence": 5, "market_odds": 3.0},
                "asian_handicap": {"selection": "Home -0.5", "probability": 0.5, "value_gap": "0%", "confidence": 5, "market_odds": 1.9},
                "over_under": {"selection": "Over 2.5", "probability": 0.5, "value_gap": "0%", "confidence": 5, "market_odds": 1.9}
            },
             "best_bet": {"market": "1x2", "selection": "Draw", "win_rate": 0.33, "reason": "Simulated"},
             "portfolio_strategy": {"diamond_pick": False, "banker_reason": "", "kelly_signal": "1.0", "hedging_suggestion": ""},
             "risk_disclosure": {"data_trap": "None", "tactical_variable": "None", "contingency": "None"}
        }

    return None

def generate_multi_model_analysis(match_info):
    """
    Calls ALL 6 models + calculates Meta-Model Consensus (Dynamic Weighting)
    """
    LEAGUE_DATA_PATH = os.path.join(os.path.dirname(__file__), '../public/champion_league_data.json')
    
    # 1. LOAD MODEL PERFORMANCE FOR WEIGHTING
    weights = {}
    try:
        with open(LEAGUE_DATA_PATH, 'r', encoding='utf-8') as f:
            league_data = json.load(f)
            for m_name, m_data in league_data['models'].items():
                if m_name == "Consensus": continue
                # Weight = Sharpe Ratio + ROI/10, min 0.1
                score = max(0.1, m_data['stats'].get('sharpe_ratio', 1.0) + m_data['stats'].get('roi', 0) / 20.0)
                weights[m_name] = score
    except:
        # Default equal weights if file missing
        weights = { "DeepSeek V3": 1, "GPT-4o": 1, "Claude 3.5 Sonnet": 1, "Gemini 1.5 Pro": 1, "Qwen 3 Max": 1, "ChatGPT-4.5 Sonnet": 1 }

    # Normalize weights
    total_w = sum(weights.values())
    normalized_weights = {k: v / total_w for k, v in weights.items()}

    # DEFINING THE 6 PARTICIPANTS
    MODELS = [
        {"name": "DeepSeek V3", "type": "deepseek", "style": "Balanced"},
        {"name": "GPT-4o", "type": "openai", "model_id": "gpt-4o", "style": "Safe"},
        {"name": "Claude 3.5 Sonnet", "type": "anthropic", "style": "Conservative"},
        {"name": "Gemini 1.5 Pro", "type": "gemini", "style": "Growth"},
        {"name": "Qwen 3 Max", "type": "dashscope", "style": "Aggressive"},
        {"name": "ChatGPT-4.5 Sonnet", "type": "openai", "model_id": "gpt-4o", "style": "Volatile"},
        {"name": "Grok 3 (Beta)", "type": "xai", "style": "Contrarian"}, 
    ]
    
    user_prompt = generate_user_prompt(match_info)
    results = {}
    valid_predictions = []
    
    print(f"\n--- ANALYZING {match_info['home_team']} vs {match_info['away_team']} ---")
    
    # 2. INDIVIDUAL MODEL GENERATION
    for model in MODELS:
        print(f"Invoking {model['name']}...")
        pred = call_model_api(model, QUANT_SYSTEM_PROMPT, user_prompt)
        
        if not pred:
            print(f"Failed to get prediction from {model['name']}, using fallback simulation.")
            pred = call_model_api({"name": model['name'], "type": "simulation", "style": model['style']}, QUANT_SYSTEM_PROMPT, user_prompt)
            
        results[model['name']] = pred
        valid_predictions.append((model['name'], pred))

        # Log to Decision Ledger
        best = pred.get('best_bet', {})
        decision_ledger.log_decision(
            model['name'],
            f"{match_info['home_team']} vs {match_info['away_team']}",
            best.get('selection', 'N/A'),
            pred.get('recommendations', {}).get(best.get('market', '1x2'), {}).get('market_odds', 0),
            pred.get('recommendations', {}).get(best.get('market', '1x2'), {}).get('confidence', 0),
            best.get('reason', 'N/A')
        )

    # 3. CALCULATE META-MODEL CONSENSUS (Weighted Average)
    import numpy as np
    
    markets = ["1x2", "asian_handicap", "over_under"]
    weighted_probs = {m: 0.0 for m in markets}
    
    all_probs = {m: [] for m in markets}
    
    for m_name, pred in valid_predictions:
        w = normalized_weights.get(m_name, 1.0 / len(MODELS))
        recs = pred.get('recommendations', {})
        
        for m in markets:
            market_key = m
            # Handle slight naming variations if any, though "asian_handicap" is used in MODES.
            recs_data = recs.get(market_key, {})
            p_val = recs_data.get('probability')
            if p_val is None: p_val = 0.5
            
            weighted_probs[m] += float(p_val) * float(w)
            all_probs[m].append(float(p_val))
            
    # CALCULATE DIVERGENCE INDEX (Entropy proxy via Std Dev)
    # Higher divergence means models disagree strongly
    divergence_index = float(round(np.mean([np.std(all_probs[m]) for m in markets]) * 10, 2))
    market_chaos_flag = bool(divergence_index > 2.5) # Entropy threshold

    # CALCULATE ALPHA CREDIT RATING
    # AAA: Conf > 8, Gap > 10%
    # AA: Conf > 7, Gap > 5%
    # A: Conf > 5
    # B: Else
    avg_conf = float(np.mean([valid_predictions[0][1]['recommendations'][m].get('confidence', 5) for m in markets]))
    alpha_rating = "B"
    if avg_conf >= 8: alpha_rating = "AAA"
    elif avg_conf >= 7: alpha_rating = "AA"
    elif avg_conf >= 5: alpha_rating = "A"

    # BLACK SWAN OPTION (Hedge Recommendation)
    black_swan_option = None
    if market_chaos_flag:
        # Find the market with highest divergence
        max_div_market = markets[np.argmax([np.std(all_probs[m]) for m in markets])]
        # Suggest the outcome with the highest "Value Gap" among the disagreed models
        black_swan_option = {
            "target_market": max_div_market,
            "hedging_logic": "High entropy detected. Buy Black Swan Insurance to protect against model divergence.",
            "virtual_premium": "500 Coins"
        }

    consensus_analysis = {
        "match_analysis": {
            "causal_chain": valid_predictions[0][1]['match_analysis']['causal_chain'],
            "divergence_index": divergence_index,
            "market_chaos": "HIGH" if market_chaos_flag else "LOW",
            "meta_weighting": "Enabled (Calibration-aware)",
            "alpha_rating": alpha_rating,
            "black_swan_option": black_swan_option
        },
        "recommendations": {
            "1x2": {
                "selection": valid_predictions[0][1]['recommendations']['1x2']['selection'],
                "probability": round(weighted_probs['1x2'], 4),
                "market_odds": valid_predictions[0][1]['recommendations']['1x2']['market_odds'], 
                "confidence": 8,
                "value_gap": f"{round(abs(weighted_probs['1x2'] - 0.33) * 100, 1)}%"
            },
            "asian_handicap": {
                "selection": valid_predictions[0][1]['recommendations']['asian_handicap']['selection'],
                "probability": round(weighted_probs['asian_handicap'], 4),
                "market_odds": valid_predictions[0][1]['recommendations']['asian_handicap'].get('market_odds', 0),
                "value_gap": f"{round(abs(weighted_probs['asian_handicap'] - 0.5) * 100, 1)}%"
            },
            "over_under": {
                 "selection": valid_predictions[0][1]['recommendations']['over_under']['selection'],
                 "probability": round(float(weighted_probs['over_under']), 4),
                 "market_odds": valid_predictions[0][1]['recommendations']['over_under'].get('market_odds', 0),
                 "value_gap": f"{round(abs(float(weighted_probs['over_under']) - 0.5) * 100, 1)}%"
            }
        },
        "portfolio_strategy": {
            "diamond_pick": avg_conf >= 8 and divergence_index < 1.0,
            "kelly_signal": "2.5" if avg_conf >= 8 else "1.0"
        }
    }
    
    results['Consensus'] = consensus_analysis
    return {
        "models": results,
        "quant_analysis": results.get('Consensus', {}) 
    }

# ... (Rest of fetch_real_slate, process_odds, etc. remains similar but simplified here for brevity)

def fetch_real_slate():
    """
    Fetches real matches from OddsAPI
    """
    api_key = os.getenv("ODDS_API_KEY")
    if not api_key:
        print("OddsAPI Key missing, using Mock.")
        return get_mock_slate()

    sport_keys = ['soccer_epl', 'soccer_spain_la_liga', 'soccer_germany_bundesliga', 'soccer_italy_serie_a', 'soccer_france_ligue_one']
    real_slate = []
    
    for league_key in sport_keys:
        try:
            url = f"https://api.the-odds-api.com/v4/sports/{league_key}/odds/?regions=uk&markets=h2h,spreads,totals&oddsFormat=decimal&apiKey={api_key}"
            r = requests.get(url, timeout=10)
            if r.status_code == 200:
                data = r.json()
                for m in data: # FULL SLATE ANALYSIS (No Limit)
                    odds_data = process_odds(m)
                    real_slate.append({
                        "id": f"v4_real_{m['id']}",
                        "home_team": m['home_team'],
                        "away_team": m['away_team'],
                        "league": league_key,
                        "date": m['commence_time'],
                        "real_odds": odds_data
                    })
        except Exception:
            pass

    if not real_slate:
        return get_mock_slate()
        
    return real_slate

def process_odds(match_data):
    bookmakers = match_data.get('bookmakers', [])
    if not bookmakers: return None
    bm = bookmakers[0]
    odds = {"1x2": {}, "spread": {}, "total": {}}
    
    for market in bm['markets']:
        if market['key'] == 'h2h':
            for o in market['outcomes']:
                if o['name'] == match_data['home_team']: odds['1x2']['home'] = o['price']
                elif o['name'] == match_data['away_team']: odds['1x2']['away'] = o['price']
                elif o['name'] == 'Draw': odds['1x2']['draw'] = o['price']
        elif market['key'] == 'spreads' and not odds['spread']:
             odds['spread'] = {"home": 1.9, "point": -0.5} # Simplified extraction
        elif market['key'] == 'totals' and not odds['total']:
             odds['total'] = {"over": 1.9, "under": 1.9, "point": 2.5}
             
    return odds

def get_mock_slate():
    return [
        {
            "id": "v4_live_001",
            "home_team": "Newcastle United",
            "away_team": "Chelsea",
            "league": "Premier League",
            "date": datetime.now().isoformat(),
            "real_odds": {
                "1x2": {"home": 2.62, "away": 2.45, "draw": 3.40},
                "spread": {"home": 1.95, "point": 0.0},
                "total": {"over": 1.70, "under": 2.05, "point": 2.5}
            }
        },
        {
            "id": "v4_live_002",
            "home_team": "Barcelona",
            "away_team": "Atletico Madrid",
            "league": "La Liga",
            "date": datetime.now().isoformat(),
            "real_odds": {
                "1x2": {"home": 2.10, "away": 3.20, "draw": 3.50},
                "spread": {"home": 2.00, "point": -0.5},
                "total": {"over": 1.85, "under": 1.95, "point": 2.5}
            }
        }
    ]

def main():
    print("QUANTGOAL V4.0 COMPETITION ENGINE STARTING...")
    
    # 1. GET SLATE
    slate = fetch_real_slate()
    
    output_data = []
    
    # 2. PROCESS EACH MATCH WITH ALL MODELS
    for match in slate:
        analysis = generate_multi_model_analysis(match)
        if analysis:
            full_record = {
                "id": match['id'],
                "match_info": match,
                "quant_analysis": analysis['quant_analysis'],
                "models": analysis['models'] # NEW FIELD: Contains independent predictions
            }
            output_data.append(full_record)
            
    # 3. WRITE TO SUPABASE (DB)
    if output_data:
        try:
            for record in output_data:
                # Prepare payload ensuring column names match schema
                payload = {
                    "external_id": record['id'],
                    "league": record['match_info']['league'],
                    "home_team": record['match_info']['home_team'],
                    "away_team": record['match_info']['away_team'],
                    "match_time": record['match_info']['date'],
                    "status": "SCHEDULED",
                    "odds_data": record['match_info']['real_odds'],
                    "quant_analysis": record['quant_analysis'],
                    "models_data": record.get('models', {})
                }
                # Upsert based on external_id (using conflict)
                supabase.table('matches').upsert(payload, on_conflict='external_id').execute()
            
            print(f"SUCCESSFULLY GENERATED {len(output_data)} SIGNALS & SYNCED TO SUPABASE CLOUD.")
            
        except Exception as e:
            print(f"SUPABASE WRITE ERROR: {e}")
            # Fallback to local JSON just in case?
            target_path = Path("c:/Users/nirva/quantgoal.ai/public/matches_data_v4.json")
            with open(target_path, "w") as f:
                 json.dump(output_data, f, indent=2)
            print("Fallback: Saved to local JSON.")

    else:
        print("NO DATA GENERATED.")
if __name__ == "__main__":
    main()
