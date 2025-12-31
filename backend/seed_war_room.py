import json
import random
from datetime import datetime
from model_versions import ModelVersions as MV

# --- WAR ROOM PERSONA SCRIPTS (Pre-written High Quality Examples) ---

DEBATE_SCRIPTS = [
    # Match 1: Liverpool vs Arsenal
    [
        {"model": MV.CHATGPT, "confidence": 84, "logic": "A breakdown of the away defense is imminent. Data shows Liverpool is dominating possession metrics in the final third recently."},
        {"model": MV.GEMINI, "confidence": 85, "logic": "[Gemini 3 Pro] Liverpool is converting territory into clear-cut chances efficiently, which confirms that Liverpool is undervalued. Market correction likely pre-kickoff."},
        {"model": MV.DEEPSEEK, "confidence": 97, "logic": "[DeepSeek V3] Liverpool is converting territory into clear-cut chances efficiently, which confirms that Liverpool is undervalued. Market correction likely pre-kickoff."},
        {"model": MV.GROK, "confidence": 90, "logic": "A breakdown of the away defense is imminent. Data shows Liverpool is dominating possession metrics in the final third recently."},
        {"model": MV.CLAUDE, "confidence": 83, "logic": "[Claude Opus 4.5] The model output is definitive. Data shows Liverpool is benefiting from key player returns this week recently. (Kelly: 1.5u)"},
        {"model": MV.QWEN, "confidence": 78, "logic": "[Qwen 3 Max] Liverpool is converting territory into clear-cut chances efficiently, which confirms that Liverpool is undervalued. Market correction likely pre-kickoff."}
    ],
    # Match 2: Real Madrid vs Atletico Madrid
    [
        {"model": MV.CHATGPT, "confidence": 80, "logic": "Market inefficiencies are currently pricing Real Madrid incorrectly. Real Madrid is forcing errors in the opposition's build-up play. Market correction likely pre-kickoff."},
        {"model": MV.GEMINI, "confidence": 88, "logic": "[Gemini 3 Pro] Market inefficiencies are currently pricing Real Madrid incorrectly. Real Madrid is forcing errors in the opposition's build-up play. Market correction likely pre-kickoff."},
        {"model": MV.DEEPSEEK, "confidence": 95, "logic": "[DeepSeek V3] Deep-dive statistical review suggests a clear edge for Real Madrid. With Real Madrid creating high-quality chances from wide areas, expect a comfortable win."},
        {"model": MV.GROK, "confidence": 78, "logic": "Market inefficiencies are currently pricing Real Madrid incorrectly. Real Madrid is forcing errors in the opposition's build-up play. Market correction likely pre-kickoff."},
        {"model": MV.CLAUDE, "confidence": 75, "logic": "[Claude Opus 4.5] Market inefficiencies are currently pricing Real Madrid incorrectly. Real Madrid is forcing errors in the opposition's build-up play. Market correction likely pre-kickoff. (Kelly: 1.5u)"},
        {"model": MV.QWEN, "confidence": 87, "logic": "[Qwen 3 Max] Market correction likely pre-kickoff. Data shows Real Madrid is maintaining a clean sheet streak recently."}
    ],
     # Match 3: Inter Milan vs Juventus
    [
        {"model": MV.CHATGPT, "confidence": 86, "logic": "Inter Milan is capitalizing on set-piece variance at a high rate, which confirms that Inter Milan is undervalued. Attack output should overwhelm the visitors."},
        {"model": MV.GEMINI, "confidence": 78, "logic": "[Gemini 3 Pro] Inter Milan is capitalizing on set-piece variance at a high rate, which confirms that Inter Milan is undervalued. Attack output should overwhelm the visitors."},
        {"model": MV.DEEPSEEK, "confidence": 87, "logic": "[DeepSeek V3] Solid defensive shape ensures safety. Data shows Inter Milan is overloading the midfield zones effectively recently."},
        {"model": MV.GROK, "confidence": 95, "logic": "Inter Milan is capitalizing on set-piece variance at a high rate, which confirms that Inter Milan is undervalued. Attack output should overwhelm the visitors."},
        {"model": MV.CLAUDE, "confidence": 88, "logic": "[Claude Opus 4.5] The model output is definitive. Data shows Inter Milan is overloading the midfield zones effectively recently. (Kelly: 1.5u)"},
        {"model": MV.QWEN, "confidence": 98, "logic": "[Qwen 3 Max] Inter Milan is capitalizing on set-piece variance at a high rate, which confirms that Inter Milan is undervalued. Attack output should overwhelm the visitors."}
    ]
]

matches = [
    {
        "id": "match_live_001",
        "match_info": {"home_team": "Liverpool", "away_team": "Arsenal", "league": "Premier League (Sim)", "date": datetime.now().isoformat()},
        "consensus": {"signal": "No Trade / Wait", "target": "Home", "confidence": 52, "market_odds": 1.63, "ai_probability": 0.52, "edge_percent": -14.68, "kelly_stake": "0"},
        "models": DEBATE_SCRIPTS[0]
    },
    {
        "id": "match_live_002",
        "match_info": {"home_team": "Real Madrid", "away_team": "Atletico Madrid", "league": "La Liga (Sim)", "date": datetime.now().isoformat()},
        "consensus": {"signal": "Strong Value Home", "target": "Home", "confidence": 61, "market_odds": 1.97, "ai_probability": 0.62, "edge_percent": 21.59, "kelly_stake": "5.5%"},
        "models": DEBATE_SCRIPTS[1]
    },
    {
        "id": "match_live_003",
        "match_info": {"home_team": "Inter Milan", "away_team": "Juventus", "league": "Serie A (Sim)", "date": datetime.now().isoformat()},
        "consensus": {"signal": "Strong Value Home", "target": "Home", "confidence": 60, "market_odds": 1.95, "ai_probability": 0.6, "edge_percent": 17.3, "kelly_stake": "4.5%"},
        "models": DEBATE_SCRIPTS[2]
    }
]

with open('public/matches_data.json', 'w') as f:
    json.dump(matches, f, indent=2)

print("War Room data seeded successfully!")
