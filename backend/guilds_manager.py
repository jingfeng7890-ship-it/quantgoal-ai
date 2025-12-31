import json
import os
from datetime import datetime

GUILDS_DATA_PATH = os.path.join(os.path.dirname(__file__), '../public/guilds_data.json')

def get_guilds():
    if not os.path.exists(GUILDS_DATA_PATH):
        return {"guilds": []}
    with open(GUILDS_DATA_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def create_guild(name, founder, initial_capital=10000):
    data = get_guilds()
    new_guild = {
        "id": f"guild_{len(data['guilds']) + 1}",
        "name": name,
        "founder": founder,
        "created_at": datetime.now().isoformat(),
        "total_capital": initial_capital,
        "members": [{"user": founder, "contribution": initial_capital}],
        "stats": {
            "total_pnl": 0.0,
            "roi": 0.0,
            "rank": len(data['guilds']) + 1
        },
        "history": []
    }
    data['guilds'].append(new_guild)
    _save_guilds(data)
    return new_guild

def update_guild_performance(guild_id, daily_pnl):
    data = get_guilds()
    for guild in data['guilds']:
        if guild['id'] == guild_id:
            guild['stats']['total_pnl'] += daily_pnl
            guild['stats']['roi'] = round((guild['stats']['total_pnl'] / guild['total_capital']) * 100, 2)
            guild['history'].insert(0, {
                "date": datetime.now().strftime('%Y-%m-%d'),
                "pnl": daily_pnl,
                "capital": guild['total_capital'] + guild['stats']['total_pnl']
            })
            break
    _save_guilds(data)

def _save_guilds(data):
    with open(GUILDS_DATA_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
