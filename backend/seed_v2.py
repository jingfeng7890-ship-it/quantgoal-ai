import json
import random
from datetime import datetime
import sys
import os

# Add parent dir to path to find adjacent modules if needed
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.model_versions import ModelVersions as MV
from backend.framework.prediction_engine import MultiDimensionalPredictionEngine
# from backend.framework.portfolio_engine import PortfolioOptimizationEngine # Future

def seed_complete_framework():
    print("Initializing Multi-Dimensional War Room V2...")
    
    # 1. Define Models
    models = [MV.CHATGPT, MV.DEEPSEEK, MV.CLAUDE, MV.GEMINI, MV.GROK, MV.QWEN]
    
    # 2. Define Matches (Restored Classics)
    match_list = [
        {"home": "Liverpool", "away": "Arsenal", "league": "Premier League", "odds_h": 2.15, "odds_d": 3.60, "odds_a": 3.10},
        {"home": "Real Madrid", "away": "Atletico Madrid", "league": "La Liga", "odds_h": 1.95, "odds_d": 3.40, "odds_a": 3.80},
        {"home": "Inter Milan", "away": "Juventus", "league": "Serie A", "odds_h": 2.05, "odds_d": 3.20, "odds_a": 3.75},
        {"home": "Bayern Munich", "away": "Dortmund", "league": "Bundesliga", "odds_h": 1.65, "odds_d": 4.20, "odds_a": 4.50},
        {"home": "PSG", "away": "Marseille", "league": "Ligue 1", "odds_h": 1.45, "odds_d": 4.80, "odds_a": 6.00}
    ]
    
    generated_matches = []
    
    for idx, m in enumerate(match_list):
        match_id = f"match_v2_{idx+1:03d}"
        
        # Base Match Info
        match_data = {
            "id": match_id,
            "match_info": {
                "home_team": m["home"],
                "away_team": m["away"],
                "league": m["league"],
                "date": datetime.now().isoformat(),
                "status": "Scheduled"
            },
            "market_odds": {
                "1x2": {"home": m["odds_h"], "draw": m["odds_d"], "away": m["odds_a"]}
            },
            "model_predictions": {} # New Structure: Keyed by Model ID
        }
        
        # Generate Multi-Dimensional Predictions for EACH model
        debate_scripts = [] # Legacy format for chat compatibility
        
        for model_id in models:
            engine = MultiDimensionalPredictionEngine(model_id)
            preds = engine.predict_match(m) # Passing simple match dict for now
            
            # Save structured prediction
            match_data["model_predictions"][model_id] = preds
            
            # Generate Legacy "Script" logic string based on these preds
            # This ensures Chat "Persona" aligns with "Data"
            logic_text = _generate_logic_text(model_id, preds, m)
            
            debate_scripts.append({
                "model": model_id,
                "confidence": preds['statistical']['confidence'],
                "logic": logic_text
            })
            
        match_data["models"] = debate_scripts # For frontend chat compatibility
        
        # Generate Consensus (Weighted Average of Models)
        match_data["consensus"] = _calculate_consensus(match_data["model_predictions"])
        
        generated_matches.append(match_data)
        
    # Write to File
    output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'matches_data.json')
    with open(output_path, 'w') as f:
        json.dump(generated_matches, f, indent=2)
        
    print(f"Seeded {len(generated_matches)} matches with Multi-Dimensional Data to {output_path}")

def _generate_logic_text(model_name, preds, match_info):
    """Generates the 'Chat' logic string consistent with the prediction data."""
    pick = preds['basic']['1x2']
    conf = preds['statistical']['confidence']
    
    if "DeepSeek" in model_name:
        return f"xG models indicate massive value on **{pick}**. Market implies {match_info.get('odds_h') if pick=='Home' else match_info.get('odds_a')} but my fair price is lower. Statistical dominance detected."
    if "Grok" in model_name:
        return f"Boring bets are for losers. **{pick}** is where the chaos is. Fading the public consensus. LFG!"
    if "Claude" in model_name:
        return f"While **{pick}** seems likely, variance is high. I recommend hedging with Asian Handicap {preds['basic']['asian_handicap']['line']}. Preserve capital."
    if "Qwen" in model_name:
        return f"Edge detected: +{preds['statistical']['value_edge'] * 100}%. Signal: **{pick}**. Kelly Stake: {preds['statistical']['kelly_fraction'] * 100}%."
    if "Gemini" in model_name:
        return f"I heard the {pick} captain just had a bust-up in training! The vibes are off for the opponent. Psychology points to **{pick}**."
    return f"We predict {pick} based on analyzing all factors."

def _calculate_consensus(all_preds):
    # Determine most popular pick
    picks = [d['basic']['1x2'] for d in all_preds.values()]
    target = max(set(picks), key=picks.count)
    count = picks.count(target)
    total = len(picks)
    conf = int((count/total) * 100)
    
    return {
        "signal": f"Value on {target}",
        "target": target,
        "confidence": conf,
        "market_odds": 2.0, # Mock
        "ai_probability": round(count/total, 2),
        "edge_percent": round((count/total * 2.0 - 1) * 100, 1),
        "kelly_stake": f"{round(conf/10, 1)}%"
    }

if __name__ == "__main__":
    seed_complete_framework()
