import json
import os
import random
from datetime import datetime, timedelta

DATA_FILE = 'public/champion_league_data.json'

class ChampionLeagueEngine:
    def __init__(self):
        self.data_file = DATA_FILE
        self.data = self._load_data()

    def _load_data(self):
        if not os.path.exists(self.data_file):
            print("No data file found. Initializes externally.")
            return {}
        with open(self.data_file, 'r', encoding='utf-8') as f:
            return json.load(f)

    def _save_data(self):
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=2)

    def run_daily_simulation(self):
        """
        Simulate a full day of betting for all models using real AI signals.
        """
        today = datetime.now().strftime('%Y-%m-%d')
        print(f"[LEAGUE] Running simulation for {today}...")
        
        # Load real AI signals
        signals_path = 'public/matches_data_v4.json'
        if not os.path.exists(signals_path):
            print("No signal data found. Skipping simulation.")
            return
            
        with open(signals_path, 'r', encoding='utf-8') as f:
            signals = json.load(f)
            
        for model_name, model_data in self.data['models'].items():
            self._process_model_day(model_name, model_data, signals, today)

        # Update metadata
        self.data['meta']['last_updated'] = datetime.now().isoformat()
        self.data['meta']['day_counter'] += 1
        
        self._generate_daily_news()
        self._save_data()
        print("[LEAGUE] Simulation complete. Data saved.")

    def _process_model_day(self, name, model, signals, date_str):
        # Determine performance based on "Best Bet" in signals
        core_pnl = 0
        total_bets = 0
        
        for sig in signals:
            best_bet = sig.get('quant_analysis', {}).get('best_bet', {})
            if not best_bet: continue
            
            # Simulated outcome based on AI probability
            win_prob = best_bet.get('win_rate', 0.5)
            is_win = random.random() < win_prob
            
            # 1% Dynamic Stake
            stake = 100 
            odds = sig['quant_analysis']['recommendations'].get(best_bet['market'], {}).get('market_odds', 1.95)
            
            pnl = (stake * (odds - 1)) if is_win else -stake
            core_pnl += pnl
            total_bets += 1

        # Update Wallet
        model['wallets']['core'] += core_pnl

        
        # 2. Challenge / High Yield (Simplified simulation)
        # Random weekly/daily flux
        challenge_pnl = random.uniform(-50, 80)
        model['wallets']['challenge'] += challenge_pnl
        
        high_yield_pnl = random.uniform(-100, 150)
        model['wallets']['high_yield'] += high_yield_pnl

        # Log Day Summary
        total_day_pnl = core_pnl + challenge_pnl + high_yield_pnl
        
        summary_entry = {
            "date": date_str,
            "bets_placed": total_bets,
            "core_pnl": round(core_pnl, 2),
            "challenge_pnl": round(challenge_pnl, 2),
            "high_yield_pnl": round(high_yield_pnl, 2),
            "total_pnl": round(total_day_pnl, 2),
            "wallet_balance": round(model['wallets']['core'] + model['wallets']['challenge'] + model['wallets']['high_yield'], 2)
        }
        
        # Prepend to history
        model['history'].insert(0, summary_entry)
        
        # Update Stats (Simple Moving Average or similar)
        # Recalculate ROI
        initial_capital = 10000
        current_capital = summary_entry['wallet_balance']
        roi = ((current_capital - initial_capital) / initial_capital) * 100
        
        model['stats']['roi'] = round(roi, 2)
        model['stats']['total_pnl'] = round(current_capital - initial_capital, 2)

    def _generate_daily_news(self):
        # Identify Top Performer of the day (based on daily PnL from history)
        daily_performers = []
        for name, data in self.data['models'].items():
            last_entry = data['history'][0]
            daily_performers.append({
                "name": name, 
                "pnl": last_entry['total_pnl'],
                "roi": data['stats']['roi']
            })
        
        # Sort by Daily PnL
        daily_performers.sort(key=lambda x: x['pnl'], reverse=True)
        winner = daily_performers[0]
        loser = daily_performers[-1]

        # Generate Headline
        headlines = [
            f"{winner['name']} dominates the day with ${winner['pnl']} profit!",
            f"Market Update: {winner['name']} surges ahead while {loser['name']} struggles.",
            f"Alpha Alert: {winner['name']} captures significant edge in today's volatility.",
            f"League Report: {winner['name']} leads the pack with superior ROI."
        ]
        
        headline = random.choice(headlines)
        
        # Save to Meta
        self.data['news'] = {
            "headline": headline,
            "top_performer": winner['name'],
            "top_pnl": winner['pnl'],
            "updated_at": datetime.now().strftime('%H:%M')
        }
        print(f"[LEAGUE] News Generated: {headline}")

if __name__ == "__main__":
    engine = ChampionLeagueEngine()
    engine.run_daily_simulation()
