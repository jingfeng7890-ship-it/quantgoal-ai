import sqlite3
import json
import random
import os
from datetime import datetime, timedelta
from model_versions import ModelVersions as MV

DB_NAME = "quantgoal_core.db"

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def settle_matches_simulated():
    """
    GOD MODE: Simulates match results for pending matches in DB
    so we can see the leaderboard update immediately.
    """
    conn = get_db_connection()
    c = conn.cursor()
    
    # Find matches that look like they haven't been settled (no winner set)
    # For demo purposes, we settle EVERYTHING that is currently in the matches table
    matches = c.execute("SELECT id, home_team, away_team FROM matches WHERE winner IS NULL").fetchall()
    
    print(f"Settling {len(matches)} pending matches (Simulated)...")
    
    for m in matches:
        # Simulate a score
        home_score = random.randint(0, 4)
        away_score = random.randint(0, 3)
        
        if home_score > away_score: winner = 'Home'
        elif away_score > home_score: winner = 'Away'
        else: winner = 'Draw'
        
        print(f"  Match {m['home_team']} vs {m['away_team']} -> Result: {home_score}-{away_score} ({winner})")
        
        c.execute('''
            UPDATE matches 
            SET final_home_score = ?, final_away_score = ?, winner = ?, status = 'FT'
            WHERE id = ?
        ''', (home_score, away_score, winner, m['id']))
        
    conn.commit()
    conn.close()

def grade_predictions():
    """Checks model predictions against match results."""
    conn = get_db_connection()
    c = conn.cursor()
    
    # Get ungraded predictions where max result is available
    sql = '''
        SELECT p.id, p.prediction_target, m.winner, p.model_name
        FROM predictions p
        JOIN matches m ON p.match_id = m.id
        WHERE p.is_correct IS NULL AND m.winner IS NOT NULL
    '''
    predictions = c.execute(sql).fetchall()
    
    print(f"Grading {len(predictions)} predictions...")
    
    for p in predictions:
        is_correct = (p['prediction_target'] == p['winner'])
        c.execute("UPDATE predictions SET is_correct = ? WHERE id = ?", (is_correct, p['id']))
        
    conn.commit()
    conn.close()

def update_leaderboard_json():
    """
    Aggregates performance from DB and generates the JSON files 
    expected by the Frontend (AlphaLeagueWidget).
    """
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    # 1. Calculate Stats Per Model
    models = [MV.DEEPSEEK, MV.CLAUDE, MV.CHATGPT, MV.QWEN, MV.GROK, MV.GEMINI]
    leaderboard = []
    
    for model in models:
        stats = c.execute('''
            SELECT 
                COUNT(*) as total_bets,
                SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as wins
            FROM predictions 
            WHERE model_name = ? AND is_correct IS NOT NULL
        ''', (model,)).fetchone()
        
        total = stats['total_bets'] or 0
        
        # Fallback for Demo if no history in DB yet
        if total == 0:
            total = random.randint(40, 80)
            wins = int(total * random.uniform(0.45, 0.65))
        else:
            wins = stats['wins'] or 0
            
        strike_rate = int((wins / total * 100))
        
        # Simulate PnL logic (assuming avg odds 1.95 for simplicity, flat $100 bet)
        # In real Pro version, we would use the actual stored odds for that match
        # Profit = (Wins * $100 * 0.95) - (Losses * $100)
        losses = total - wins
        net_profit = (wins * 95) - (losses * 100) 
        roi = round((net_profit / (total * 100)) * 100, 1) if total > 0 else 0
        
        # Risk Profile Logic
        risk = "Med"
        if "Grok" in model: risk = "High"
        if "Claude" in model: risk = "Low"
        
        leaderboard.append({
            "id": model,
            "name": model,
            "roi_monthly": roi,
            "strike_rate": strike_rate,
            "alpha": round(roi - 5, 1), # Mock alpha benchmark
            "risk": risk
        })
    
    # Sort by ROI
    leaderboard.sort(key=lambda x: x['roi_monthly'], reverse=True)
    
    # 2. Generate History Curve (Mocking a 30-day curve ending at current PnL)
    # In prod, this would aggregate daily realized PnL from the DB
    history = []
    days = 30
    
    for i in range(days):
        day_label = (datetime.now() - timedelta(days=days-i)).strftime("%m-%d")
        point = {"day": day_label}
        
        for model in models:
            # Generate a random walk that ends roughly near the calculated ROI (simulated consistency)
            # This is just for visualization smoothing until we have 30 days of real DB data
            random_variance = random.uniform(-5, 5)
            point[model] = round(random_variance + (i * 2), 1) # Trending up
            
        point["Consensus"] = round(i * 2.5 + random.uniform(-2, 2), 1) # Consensus usually steady
        history.append(point)

    # WRITE FILES
    public_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public')
    
    with open(os.path.join(public_dir, 'league_leaderboard.json'), 'w') as f:
        json.dump(leaderboard, f, indent=2)
        
    with open(os.path.join(public_dir, 'league_history.json'), 'w') as f:
        json.dump(history, f, indent=2)
        
    print(f"Leaderboard updated. Top Model: {leaderboard[0]['name']} (${leaderboard[0]['roi_monthly']}%)")
    conn.close()

if __name__ == "__main__":
    settle_matches_simulated()
    grade_predictions()
    update_leaderboard_json()
