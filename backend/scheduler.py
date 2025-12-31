import time
import schedule
import subprocess
import sys
from datetime import datetime

def job_brain():
    print(f"\n[Scheduler] Running Brain Analysis at {datetime.now()}...")
    try:
        # Use simple subprocess to run the script in a fresh process environment
        # avoiding memory leaks or state pollution
        subprocess.run([sys.executable, "brain.py"], check=True)
    except Exception as e:
        print(f"[Scheduler] Brain Error: {e}")

def job_scorekeeper():
    print(f"\n[Scheduler] Running Scorekeeper Settlement at {datetime.now()}...")
    try:
        subprocess.run([sys.executable, "scorekeeper.py"], check=True)
    except Exception as e:
        print(f"[Scheduler] Scorekeeper Error: {e}")

def start_scheduler():
    print("--- QuantGoal AI Automation System v1.0 ---")
    print("Status: ONLINE")
    print("Schedule: \n - Brain: Every 1 hour \n - Scorekeeper: Every 2 hours (for Demo speed)")
    
    # Run immediately on startup
    job_brain()
    
    # Schedule
    schedule.every(1).hours.do(job_brain)
    schedule.every(2).hours.do(job_scorekeeper) 
    
    while True:
        schedule.run_pending()
        time.sleep(60) # check every minute

if __name__ == "__main__":
    start_scheduler()
