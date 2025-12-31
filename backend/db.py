import sqlite3
import json
import os
from datetime import datetime
import integrity # Import Integrity Module

DB_NAME = "quantgoal_core.db"

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes the database schema."""
    conn = get_db_connection()
    c = conn.cursor()
    
    # 1. Matches Table (The ground truth)
    c.execute('''
    CREATE TABLE IF NOT EXISTS matches (
        id TEXT PRIMARY KEY, -- fixture_id
        league TEXT,
        home_team TEXT,
        away_team TEXT,
        date TEXT,
        status TEXT,
        final_home_score INTEGER,
        final_away_score INTEGER,
        winner TEXT -- 'Home', 'Away', 'Draw'
    )
    ''')
    
    # 2. Predictions Table ( The AI Votes )
    # MODIFIED: Added integrity_hash and integrity_ts
    c.execute('''
    CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        match_id TEXT,
        model_name TEXT,
        prediction_target TEXT, -- 'Home', 'Away', 'Draw'
        confidence INTEGER,
        logic TEXT,
        is_correct BOOLEAN DEFAULT NULL,
        integrity_hash TEXT,
        integrity_ts INTEGER,
        FOREIGN KEY (match_id) REFERENCES matches (id)
    )
    ''')

    # 3. Consensus/Financial Table (The System's Call)
    c.execute('''
    CREATE TABLE IF NOT EXISTS consensus_signals (
        match_id TEXT PRIMARY KEY,
        signal_type TEXT,
        ev_percent REAL,
        kelly_stake REAL,
        market_odds_home REAL,
        market_odds_away REAL,
        market_odds_draw REAL,
        FOREIGN KEY (match_id) REFERENCES matches (id)
    )
    ''')

    # 4. Performance Ledger (The Leaderboard Source)
    c.execute('''
    CREATE TABLE IF NOT EXISTS model_performance (
        model_name TEXT,
        date TEXT,
        daily_pnl REAL,
        total_pnl REAL,
        strike_rate REAL,
        PRIMARY KEY (model_name, date)
    )
    ''')

    conn.commit()
    conn.close()
    print(f"Database {DB_NAME} initialized successfully.")

def save_match_and_predictions(match_data, models_data, consensus_data, odds_data):
    """Saves a fully analyzed match cycle to the DB."""
    conn = get_db_connection()
    c = conn.cursor()
    
    m = match_data
    match_id = str(m['fixture_id'])
    
    # Upsert Match
    c.execute('''
    INSERT OR REPLACE INTO matches (id, league, home_team, away_team, date, status)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', (match_id, m['league'], m['home'], m['away'], m.get('date'), m.get('status')))
    
    # Save Model Predictions WITH PROOF OF INTEGRITY
    for model in models_data:
        # Determine strict target
        raw = (model.get('winner', '') + " " + model.get('prediction', '')).lower()
        if 'home' in raw: target = 'Home'
        elif 'away' in raw: target = 'Away'
        else: target = 'Draw'
        
        # GENERATE HASH
        sig = integrity.generate_prediction_signature(match_id, model['model'], target)
        
        # Save hash along with data
        c.execute('''
        INSERT INTO predictions (match_id, model_name, prediction_target, confidence, logic, integrity_hash, integrity_ts)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            match_id, 
            model['model'], 
            target, 
            model['confidence'], 
            model['logic'],
            sig['hash'],
            sig['timestamp']
        ))
        
    # --- NEW: Save Consensus ITSELF as a generic "Model" for the Leaderboard ---
    # This ensures "QuantGoal v2.0" appears in the ranking list.
    cons_target = consensus_data.get('target', 'Draw')
    cons_model_name = "QuantGoal v2.0 (Consensus)"
    
    # Generate Hash for Consensus
    cons_sig = integrity.generate_prediction_signature(match_id, cons_model_name, cons_target)
    
    c.execute('''
    INSERT INTO predictions (match_id, model_name, prediction_target, confidence, logic, integrity_hash, integrity_ts)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        match_id, 
        cons_model_name, 
        cons_target, 
        consensus_data.get('confidence', 0), 
        "ACW Weighted Algorithm + Kelly Criterion (System Pick)",
        cons_sig['hash'],
        cons_sig['timestamp']
    ))
    # --------------------------------------------------------------------------
        
    # Save Consensus Financials
    c.execute('''
    INSERT OR REPLACE INTO consensus_signals 
    (match_id, signal_type, ev_percent, kelly_stake, market_odds_home, market_odds_away, market_odds_draw)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        match_id, 
        consensus_data['signal'], 
        consensus_data['edge_percent'], 
        consensus_data['kelly_stake'],
        odds_data.get('Home'),
        odds_data.get('Away'),
        odds_data.get('Draw')
    ))
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
