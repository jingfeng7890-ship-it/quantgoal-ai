import random
import os
import json
import sqlite3
import sys

# Add parent dir to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.model_versions import ModelVersions as MV
from backend.framework.rating_system import ModelMultiDimensionalRating

def upgrade_leaderboard():
    """
    LEADERBOARD V2: Uses the new Rating System Class to generate multi-dimensional ranks.
    """
    print("Calculating V2 Leaderboards...")
    
    # Init Rating System
    rater = ModelMultiDimensionalRating()
    
    # Mock Performance Data (In real world, calculate from DB history)
    # We will generate this for each model
    
    models = [MV.CHATGPT, MV.DEEPSEEK, MV.CLAUDE, MV.GEMINI, MV.GROK, MV.QWEN]
    
    leaderboard = []
    
    for model_id in models:
        # Mock Performance Stats
        perf = {
            'acc_1x2': random.uniform(55, 75),
            'acc_ah': random.uniform(50, 70),
            'acc_ou': random.uniform(52, 68),
            'roi_cs': random.uniform(-10, 40), # High variance return
            'acc_btts': random.uniform(60, 80),
            'drawdown_max': random.uniform(5, 25)
        }
        
        # Calculate Rating
        rating = rater.calculate_comprehensive_rating(perf)
        
        # Construct Entry
        entry = {
            "id": model_id,
            "name": model_id,
            "rating": rating["total_rating"], # New Core Metric
            "tier": rating["rank_tier"],
            "breakdown": rating["breakdown"], # For radar charts
            
            # Legacy fields for compatibility (mapped from new stats)
            "roi_monthly": round(perf['roi_cs'] + random.uniform(-2, 5), 1),
            "strike_rate": int(perf['acc_1x2']), 
            "alpha": round(rating["total_rating"] - 70, 1), # Alpha over baseline 70
            "risk": "High" if perf['drawdown_max'] > 20 else "Low" if perf['drawdown_max'] < 10 else "Med"
        }
        
        leaderboard.append(entry)
        
    # Sort by Rating
    leaderboard.sort(key=lambda x: x['rating'], reverse=True)
    
    # Write to File
    output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'league_leaderboard.json')
    with open(output_path, 'w') as f:
        json.dump(leaderboard, f, indent=2)
        
    print(f"Leaderboard V2 Updated: Top Model is {leaderboard[0]['name']} ({leaderboard[0]['rating']})")

if __name__ == "__main__":
    upgrade_leaderboard()
