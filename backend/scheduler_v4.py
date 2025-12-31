import schedule
import time
import subprocess
import os
from datetime import datetime

def job():
    print(f"\n[SCHEDULER] Starting Cycle at {datetime.now().strftime('%H:%M:%S')}...")
    try:
        # Run the generation script as a subprocess
        result = subprocess.run(
            ["python", "backend/generate_v4_signals.py"], 
            capture_output=True, 
            text=True,
            cwd=os.getcwd() # Ensure we run from root
        )
        if result.returncode == 0:
            print("[SCHEDULER] ✅ Data Refresh Success.")
            # Optional: Print last line of output for confirmation
            lines = result.stdout.strip().split('\n')
            if lines: print(f"   └─ {lines[-1]}")
            
            # 2. Run Auto-Parlay Generator
            print("   └─ [Bot] Generating Daily System Picks...")
            subprocess.run(["python", "backend/generate_daily_parlays.py"], cwd=os.getcwd())

            # 3. Update Champion League (Simulated)
            print("   └─ [League] Simulating Daily Matchday...")
            subprocess.run(["python", "backend/champion_league_engine.py"], cwd=os.getcwd())
            
        else:
            print("[SCHEDULER] ❌ Data Refresh Failed.")
            print(result.stderr)
            
    except Exception as e:
        print(f"[SCHEDULER] Critical Error: {e}")

if __name__ == "__main__":
    print("--- QUANTGOAL V4.0 LIVE SCHEDULER ACTIVE ---")
    print("Refresh Rate: Every 2 Minutes (Demo Mode)")
    
    # Run immediately on start
    job()
    
    # Schedule frequency
    schedule.every(2).minutes.do(job)
    
    while True:
        schedule.run_pending()
        time.sleep(1)
