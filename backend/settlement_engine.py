import json
import os
import dotenv
from datetime import datetime
from supabase import create_client, Client

# Load Environment Variables
env_path = os.path.join(os.path.dirname(__file__), '.env')
dotenv.load_dotenv(dotenv_path=env_path)

url: str = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

def check_match_result(match_name, selection):
    """
    Mocking Result Check for V2 Prototype.
    In V3, this will query The-Odds-Api v4/sports/soccer/scores endpoint.
    """
    return "Pending"

def run_settlement():
    print(f"[{datetime.now()}] Starting Settlement Engine (Cloud)...")
    
    # 1. Fetch PENDING tickets from Supabase
    try:
        response = supabase.table('parlay_tickets').select('*').eq('status', 'PENDING').execute()
        tickets = response.data
    except Exception as e:
        print(f"Error fetching tickets: {e}")
        return

    if not tickets:
        print("No pending tickets to settle.")
        return

    updated_count = 0

    for ticket in tickets:
        print(f"Checking Ticket {ticket['ticket_id']}...")
        
        # Check all legs
        all_won = True
        any_lost = False
        
        new_legs = []
        original_legs = ticket['legs'] # It's already a dict/list from JSONB
        
        legs_changed = False
        
        for leg in original_legs:
            result = leg.get('result', 'Pending')
            if result == 'Pending':
                # Try to fetch result
                new_result = check_match_result(leg['match'], leg['selection'])
                if new_result != result:
                    leg['result'] = new_result
                    legs_changed = True
                    result = new_result
            
            new_legs.append(leg)

            if result == 'Lost':
                any_lost = True
            if result == 'Pending':
                all_won = False
        
        # Determine Status Change
        new_status = ticket['status']
        new_pnl = ticket['pnl']
        
        if any_lost:
            new_status = 'LOST'
            new_pnl = -float(ticket['stake'])
        elif all_won:
            new_status = 'WON'
            payout = float(ticket['stake']) * float(ticket['total_odds'])
            new_pnl = round(payout - float(ticket['stake']), 2)
            
        # Update DB if anything changed
        if new_status != ticket['status'] or legs_changed:
            payload = {
                "status": new_status,
                "pnl": new_pnl,
                "legs": new_legs
            }
            try:
                supabase.table('parlay_tickets').update(payload).eq('id', ticket['id']).execute()
                print(f" -> Ticket {ticket['ticket_id']} Updated: {new_status}")
                updated_count += 1
            except Exception as e:
                print(f"Failed to update ticket {ticket['ticket_id']}: {e}")

    print(f"Settlement Complete. Updated {updated_count} tickets.")

if __name__ == "__main__":
    run_settlement()
