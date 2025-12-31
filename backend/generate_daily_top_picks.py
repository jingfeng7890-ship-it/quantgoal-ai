import json
import os
from datetime import datetime
from pathlib import Path

SIGNAL_PATH = Path('c:/Users/nirva/quantgoal.ai/public/matches_data_v4.json')
TOP_PICKS_PATH = Path('c:/Users/nirva/quantgoal.ai/public/daily_top_picks.json')

# 7 AI Participants (6 models + consensus)
MODELS = [
    "DeepSeek V3",
    "GPT-4o", 
    "Claude 3.5 Sonnet",
    "Gemini 1.5 Pro",
    "Qwen 3 Max",
    "ChatGPT-4.5 Sonnet",
    "Consensus"  # Weighted average
]

def get_model_recommendations(signal, model_name):
    """Extract model-specific recommendations from signal data"""
    if model_name == "Consensus":
        # Use quant_analysis (weighted consensus)
        return signal.get('quant_analysis', {}).get('recommendations', {})
    else:
        # Use model-specific predictions
        models_data = signal.get('models', {})
        model_data = models_data.get(model_name, {})
        return model_data.get('recommendations', {})

def generate_model_picks(signals, model_name, today):
    """Generate 4 picks for a specific model"""
    picks = []
    
    # 1. 1X2 - Model's highest probability
    valid_1x2 = []
    for sig in signals:
        recs = get_model_recommendations(sig, model_name)
        rec_1x2 = recs.get('1x2', {})
        prob = rec_1x2.get('probability') or 0
        if prob > 0:
            valid_1x2.append({
                'signal': sig,
                'rec': rec_1x2,
                'prob': prob
            })
    
    if valid_1x2:
        top = max(valid_1x2, key=lambda x: x['prob'])
        sig = top['signal']
        rec = top['rec']
        picks.append({
            "id": f"{model_name}_1x2_{today}",
            "model": model_name,
            "date": today,
            "category": "1X2",
            "match": f"{sig['match_info']['home_team']} vs {sig['match_info']['away_team']}",
            "selection": rec.get('selection', 'N/A'),
            "odds": rec.get('market_odds', 1.0),
            "probability": rec.get('probability', 0),
            "status": "PENDING",
            "pnl": 0
        })
    
    # 2. Over/Under - Model's highest probability
    valid_ou = []
    for sig in signals:
        recs = get_model_recommendations(sig, model_name)
        rec_ou = recs.get('over_under', {})
        prob = rec_ou.get('probability') or 0
        if prob > 0:
            valid_ou.append({
                'signal': sig,
                'rec': rec_ou,
                'prob': prob
            })
    
    if valid_ou:
        top = max(valid_ou, key=lambda x: x['prob'])
        sig = top['signal']
        rec = top['rec']
        picks.append({
            "id": f"{model_name}_ou_{today}",
            "model": model_name,
            "date": today,
            "category": "Over/Under",
            "match": f"{sig['match_info']['home_team']} vs {sig['match_info']['away_team']}",
            "selection": rec.get('selection', 'N/A'),
            "odds": rec.get('market_odds', 1.0),
            "probability": rec.get('probability', 0),
            "status": "PENDING",
            "pnl": 0
        })
    
    # 3. Asian Handicap - Model's highest probability
    valid_hcp = []
    for sig in signals:
        recs = get_model_recommendations(sig, model_name)
        rec_hcp = recs.get('asian_handicap', {})
        prob = rec_hcp.get('probability') or 0
        if prob > 0:
            valid_hcp.append({
                'signal': sig,
                'rec': rec_hcp,
                'prob': prob
            })
    
    if valid_hcp:
        top = max(valid_hcp, key=lambda x: x['prob'])
        sig = top['signal']
        rec = top['rec']
        picks.append({
            "id": f"{model_name}_hcp_{today}",
            "model": model_name,
            "date": today,
            "category": "Asian Handicap",
            "match": f"{sig['match_info']['home_team']} vs {sig['match_info']['away_team']}",
            "selection": rec.get('selection', 'N/A'),
            "odds": rec.get('market_odds', 1.0),
            "probability": rec.get('probability', 0),
            "status": "PENDING",
            "pnl": 0
        })
    
    # 4. 2-Leg Parlay - Model's top 2 picks across all markets
    all_legs = []
    for sig in signals:
        recs = get_model_recommendations(sig, model_name)
        for mkt in ['1x2', 'over_under', 'asian_handicap']:
            rec = recs.get(mkt, {})
            prob = rec.get('probability') or 0
            if prob > 0:
                all_legs.append({
                    "match": f"{sig['match_info']['home_team']} vs {sig['match_info']['away_team']}",
                    "selection": rec.get('selection', 'N/A'),
                    "odds": rec.get('market_odds', 1.0),
                    "prob": prob
                })
    
    if len(all_legs) >= 2:
        best_legs = sorted(all_legs, key=lambda x: x['prob'], reverse=True)[:2]
        total_odds = best_legs[0]['odds'] * best_legs[1]['odds']
        total_prob = best_legs[0]['prob'] * best_legs[1]['prob']
        picks.append({
            "id": f"{model_name}_parlay_{today}",
            "model": model_name,
            "date": today,
            "category": "2-Leg Parlay",
            "match": "Combo: " + " | ".join([l['match'] for l in best_legs]),
            "selection": " | ".join([l['selection'] for l in best_legs]),
            "odds": round(total_odds, 2),
            "probability": round(total_prob, 3),
            "status": "PENDING",
            "pnl": 0,
            "legs": best_legs
        })
    
    return picks

def generate_top_picks():
    if not os.path.exists(SIGNAL_PATH):
        print("Error: matches_data_v4.json not found.")
        return

    with open(SIGNAL_PATH, 'r', encoding='utf-8') as f:
        signals = json.load(f)

    if not signals:
        print("Error: No signals found.")
        return

    today = datetime.now().strftime('%Y-%m-%d')
    
    # Load existing history
    history = {}
    if os.path.exists(TOP_PICKS_PATH):
        with open(TOP_PICKS_PATH, 'r', encoding='utf-8') as f:
            try:
                history = json.load(f)
                if not isinstance(history, dict):
                    history = {}
            except:
                history = {}
    
    # Generate picks for each model
    for model_name in MODELS:
        model_picks = generate_model_picks(signals, model_name, today)
        
        # Initialize model's history list if needed
        if model_name not in history:
            history[model_name] = []
        
        # Update or add new picks
        for new_pick in model_picks:
            idx = next((i for i, item in enumerate(history[model_name]) if item["id"] == new_pick["id"]), None)
            if idx is not None:
                history[model_name][idx] = new_pick
            else:
                history[model_name].insert(0, new_pick)
        
        print(f"{model_name}: {len(model_picks)} picks generated")
    
    # Save all picks
    with open(TOP_PICKS_PATH, 'w', encoding='utf-8') as f:
        json.dump(history, f, indent=2, ensure_ascii=False)
    
    print(f"\nDaily Diamond 4 generated for {today}")
    print(f"Total: {len(MODELS)} models × 4 picks = {len(MODELS) * 4} picks")

if __name__ == "__main__":
    generate_top_picks()
