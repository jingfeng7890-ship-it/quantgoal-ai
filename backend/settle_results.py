import json
import os
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv
import decision_ledger

load_dotenv()

ODDS_API_KEY = os.getenv('ODDS_API_KEY')
PARLAY_HISTORY_PATH = os.path.join(os.path.dirname(__file__), '../public/parlay_history.json')
MATCHES_DATA_PATH = os.path.join(os.path.dirname(__file__), '../public/matches_data_v4.json')
LEAGUE_DATA_PATH = os.path.join(os.path.dirname(__file__), '../public/champion_league_data.json')
DAILY_TOP_PICKS_PATH = os.path.join(os.path.dirname(__file__), '../public/daily_top_picks.json')

def get_scores(sport="soccer_epl"):
    """
    Fetch scores from The-Odds-API.
    """
    if not ODDS_API_KEY:
        print("Warning: ODDS_API_KEY not found. Using simulation mode.")
        return []
    
    url = f"https://api.the-odds-api.com/v4/sports/{sport}/scores/?apiKey={ODDS_API_KEY}&daysFrom=3"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error fetching scores: {response.status_code}")
            return []
    except Exception as e:
        print(f"Exception fetching scores: {e}")
        return []

def settle_parlays(scores_list):
    """
    Settle bets in parlay_history.json.
    """
    if not os.path.exists(PARLAY_HISTORY_PATH):
        return
    
    with open(PARLAY_HISTORY_PATH, 'r', encoding='utf-8') as f:
        history = json.load(f)
    
    updated = False
    for entry in history:
        if entry.get('status') != 'Pending':
            continue
        
        all_legs_won = True
        any_leg_lost = False
        all_legs_settled = True
        
        for leg in entry.get('legs', []):
            if leg.get('result') != 'Pending':
                continue
            
            # Find match in scores_list
            match_score = None
            home_team = leg['fullMatch'].get('home')
            away_team = leg['fullMatch'].get('away')
            
            for s in scores_list:
                if s['home_team'] == home_team and s['away_team'] == away_team:
                    if s.get('completed'):
                        match_score = s
                        break
            
            if match_score:
                scores = match_score.get('scores', [])
                if not scores:
                    continue
                
                h_score = int(next((x['score'] for x in scores if x['name'] == home_team), 0))
                a_score = int(next((x['score'] for x in scores if x['name'] == away_team), 0))
                
                outcome = ""
                if h_score > a_score: outcome = "Home Win"
                elif a_score > h_score: outcome = "Away Win"
                else: outcome = "Draw"
                
                prediction = leg['team']
                # Basic settlement for 1x2 and O/U
                won = False
                pnl_factor = 1.0 # 1.0 = Full win/loss, 0.5 = Half win/loss
                
                if prediction == home_team or prediction == "Home Win":
                    won = (h_score > a_score)
                elif prediction == away_team or prediction == "Away Win":
                    won = (a_score > h_score)
                elif prediction == "Draw":
                    won = (h_score == a_score)
                elif "Over" in prediction:
                    line = float(prediction.split()[-1])
                    won = (h_score + a_score > line)
                elif "Under" in prediction:
                    line = float(prediction.split()[-1])
                    won = (h_score + a_score < line)
                elif any(x in prediction for x in ["-", "+"]):
                    # Asian Handicap Logic
                    # Examples: "Manchester City -1.5", "Arsenal +0.25"
                    try:
                        line_str = prediction.split()[-1]
                        line = float(line_str)
                        is_home_bet = home_team in prediction
                        
                        diff = h_score - a_score if is_home_bet else a_score - h_score
                        result_margin = diff + line
                        
                        if result_margin > 0.25: # Full Win
                            won = True
                        elif result_margin == 0.25: # Half Win
                            won = True
                            pnl_factor = 0.5
                        elif result_margin == 0: # Push (Draw)
                            won = True 
                            pnl_factor = 0 # Refund
                        elif result_margin == -0.25: # Half Loss
                            won = False
                            pnl_factor = 0.5
                        else: # Full Loss
                            won = False
                    except:
                        pass

                leg['result'] = 'WON' if won else 'LOST'
                if pnl_factor != 1.0:
                    leg['result'] += f" ({'HALF' if pnl_factor == 0.5 else 'PUSH'})"
                
                leg['score'] = f"{h_score}-{a_score}"
                
                if not won and pnl_factor == 1.0: any_leg_lost = True
                updated = True
            else:
                all_legs_settled = False
        
        if any_leg_lost:
            entry['status'] = 'LOST'
            entry['pnl'] = -entry['stake']
        elif all_legs_settled:
            # Calculate PnL based on pnl_factors (simplified for single leg bets here)
            # In a real parlay, math is multiplicative, but we'll assume single for now
            if all_legs_won:
                entry['status'] = 'WON'
                entry['pnl'] = entry['potentialReturn'] - entry['stake']
            else:
                entry['status'] = 'LOST'
                entry['pnl'] = -entry['stake']


    if updated:
        with open(PARLAY_HISTORY_PATH, 'w', encoding='utf-8') as f:
            json.dump(history, f, indent=2, ensure_ascii=False)
        print("Settled user parlays.")

def calculate_sharpe(history):
    """
    Calculate annualized Sharpe Ratio based on daily total_pnl.
    Simplified: (Mean Daily PnL / Std Dev of Daily PnL) * sqrt(365)
    We'll treat each history entry as one day.
    """
    import math
    if len(history) < 2:
        return 0.0
    
    pnls = [h['total_pnl'] for h in history]
    mean_pnl = sum(pnls) / len(pnls)
    
    variance = sum((x - mean_pnl) ** 2 for x in pnls) / len(pnls)
    std_dev = math.sqrt(variance)
    
    if std_dev == 0:
        return 0.0
        
    # Annualized Sharpe (assuming 1 year = 365 days of picks)
    sharpe = (mean_pnl / std_dev) * math.sqrt(365)
    return round(sharpe, 2)

def calculate_max_drawdown(history):
    """
    Calculate Maximum Drawdown percentage from daily wallet balances.
    """
    if not history:
        return 0.0
    
    # History is usually reverse chronological, reverse it to get time series
    balances = [h['wallet_balance'] for h in reversed(history)]
    if not balances:
        return 0.0
        
    max_drawdown = 0.0
    peak = balances[0]
    
    for balance in balances:
        if balance > peak:
            peak = balance
        
        drawdown = (peak - balance) / peak if peak > 0 else 0
        if drawdown > max_drawdown:
            max_drawdown = drawdown
            
    return round(max_drawdown * 100, 2) # convert to percentage

def settle_ai_models(force=False):
    """
    Settle AI Model histories in champion_league_data.json.
    Aggregates real results from daily_top_picks.json.
    """
    if not os.path.exists(LEAGUE_DATA_PATH) or not os.path.exists(DAILY_TOP_PICKS_PATH):
        return
    
    with open(LEAGUE_DATA_PATH, 'r', encoding='utf-8') as f:
        league_data = json.load(f)
    with open(DAILY_TOP_PICKS_PATH, 'r', encoding='utf-8') as f:
        picks_data = json.load(f)
    
    any_updated = False
    
    for model_name, model in league_data['models'].items():
        model_updated = False
        # Get picks for this model
        model_picks = picks_data.get(model_name, [])
        if not model_picks:
            if not force: continue
            
        # Group by date to settle specific days
        dates_to_settle = sorted(list(set(p['date'] for p in model_picks if p.get('status') != 'PENDING')))
        
        for date_str in dates_to_settle:
            # Check if this date is already in history
            history = model.get('history', [])
            if any(h['date'] == date_str for h in history):
                continue
                
            day_picks = [p for p in model_picks if p['date'] == date_str]
            total_pnl = sum(p.get('pnl', 0) for p in day_picks)
            bets_placed = len(day_picks)
            
            # Sub-PnL based on categories (Diamond 4 logic)
            core_pnl = sum(p.get('pnl', 0) for p in day_picks if p['category'] in ['1X2', 'Asian Handicap'])
            challenge_pnl = sum(p.get('pnl', 0) for p in day_picks if p['category'] == 'Over/Under')
            high_yield_pnl = sum(p.get('pnl', 0) for p in day_picks if p['category'] == '2-Leg Parlay')
            
            # Initial balance for calculation if history empty
            last_balance = history[0]['wallet_balance'] if history else 10000.0
            new_balance = round(last_balance + total_pnl, 2)
            
            new_entry = {
                "date": date_str,
                "bets_placed": bets_placed,
                "core_pnl": round(core_pnl, 2),
                "challenge_pnl": round(challenge_pnl, 2),
                "high_yield_pnl": round(high_yield_pnl, 2),
                "total_pnl": round(total_pnl, 2),
                "wallet_balance": new_balance
            }
            
            # Insert at beginning (descending order)
            model['history'].insert(0, new_entry)
            
            # Update wallets
            model['wallets']['core'] += core_pnl
            model['wallets']['challenge'] += challenge_pnl
            model['wallets']['high_yield'] += high_yield_pnl
            
            model_updated = True
            any_updated = True

        # Recalculate stats if updated OR force
        if model_updated or force:
            history = model.get('history', [])
            model['stats']['total_pnl'] = round(sum(h['total_pnl'] for h in history), 2)
            model['stats']['roi'] = round((model['stats']['total_pnl'] / 10000) * 100, 2)
            model['stats']['sharpe_ratio'] = calculate_sharpe(history)
            model['stats']['max_drawdown'] = calculate_max_drawdown(history)
            
            # Recalculate Win Rate
            wins = sum(1 for p in model_picks if p.get('status') == 'WON')
            total = sum(1 for p in model_picks if p.get('status') in ['WON', 'LOST'])
            if total > 0:
                model['stats']['win_rate'] = round((wins / total) * 100, 2)
            
            any_updated = True

    if any_updated:
        league_data['meta']['last_updated'] = datetime.now().isoformat()
        with open(LEAGUE_DATA_PATH, 'w', encoding='utf-8') as f:
            json.dump(league_data, f, indent=2, ensure_ascii=False)
        print("Settled AI model stats (Recalculated).")

def settle_daily_top_picks(scores_list):
    """
    Settle Daily Top Picks in daily_top_picks.json.
    """
    if not os.path.exists(DAILY_TOP_PICKS_PATH):
        return
    
    with open(DAILY_TOP_PICKS_PATH, 'r', encoding='utf-8') as f:
        history_db = json.load(f)
        
    updated = False
    for model_name, picks in history_db.items():
        for entry in picks:
            if entry.get('status') != 'PENDING':
                continue
                
            # Daily Top Picks can be Single or Parlay (Double)
            legs = []
            if 'legs' in entry:
                legs = entry['legs']
            else:
                # Construct a virtual leg for single bets
                legs = [{
                    "match": entry['match'],
                    "selection": entry['selection'],
                    "odds": entry['odds']
                }]
                
            all_settled = True
            all_won = True
            
            for leg in legs:
                # Parse teams
                try:
                    teams = leg['match'].replace("Combo: ", "").split(" vs ")
                    home_team, away_team = teams[0].strip(), teams[1].strip()
                except:
                    continue
                    
                match_score = None
                for s in scores_list:
                    if s['home_team'] == home_team and s['away_team'] == away_team:
                        if s.get('completed'):
                            match_score = s
                            break
                
                if not match_score:
                    all_settled = False
                    break
                    
                scores = match_score.get('scores', [])
                h_score = int(next((x['score'] for x in scores if x['name'] == home_team), 0))
                a_score = int(next((x['score'] for x in scores if x['name'] == away_team), 0))
                
                prediction = leg['selection']
                won = False
                
                # Use same logic as settle_parlays
                if prediction == home_team or prediction == "Home Win":
                    won = (h_score > a_score)
                elif prediction == away_team or prediction == "Away Win":
                    won = (a_score > h_score)
                elif prediction == "Draw":
                    won = (h_score == a_score)
                elif "Over" in prediction:
                    try:
                        line = float(prediction.split()[-1])
                        won = (h_score + a_score > line)
                    except: pass
                elif "Under" in prediction:
                    try:
                        line = float(prediction.split()[-1])
                        won = (h_score + a_score < line)
                    except: pass
                elif any(x in prediction for x in ["-", "+"]):
                    try:
                        line_str = prediction.split()[-1]
                        line = float(line_str)
                        is_home_bet = home_team in prediction
                        diff = h_score - a_score if is_home_bet else a_score - h_score
                        won = (diff + line > 0) # Simplified AH for Daily Top Picks
                    except: pass
                    
                if not won:
                    all_won = False
                    
            if all_settled:
                entry['status'] = 'WON' if all_won else 'LOST'
                entry['pnl'] = (100 * (entry['odds'] - 1)) if all_won else -100
                
                # Log to Decision Ledger
                decision_ledger.log_settlement(
                    model_name, 
                    entry['match'], 
                    entry['status'], 
                    entry['pnl']
                )
                
                updated = True
                
    if updated:
        with open(DAILY_TOP_PICKS_PATH, 'w', encoding='utf-8') as f:
            json.dump(history_db, f, indent=2, ensure_ascii=False)
        print("Settled Daily Top Picks for all models.")

if __name__ == "__main__":
    scores = get_scores()
    settle_parlays(scores)
    settle_daily_top_picks(scores)
    settle_ai_models(force=True)
