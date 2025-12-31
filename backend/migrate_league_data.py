import json
import os

LEAGUE_DATA_PATH = os.path.join(os.path.dirname(__file__), '../public/champion_league_data.json')

RADAR_MAPPING = {
    "DeepSeek V3": {"Tactics": 9, "Underdogs": 8, "High-Value": 9, "Consistency": 6, "Speed": 7},
    "GPT-4o": {"Stability": 9, "VarianceControl": 9, "Multi-Market": 8, "Consistency": 9, "Risk": 4},
    "Claude 3.5 Sonnet": {"Logic": 10, "CausalReasoning": 10, "Accuracy": 8, "BiasControl": 9, "Volume": 5},
    "Gemini 1.5 Pro": {"Speed": 10, "InPlay": 9, "DataCrunching": 8, "Variety": 7, "Depth": 6},
    "Qwen 3 Max": {"Math": 9, "OddsArbitrage": 9, "Momentum": 8, "Scalability": 8, "Narrative": 4},
    "ChatGPT-4.5 Sonnet": {"Opportunistic": 9, "Sentiment": 8, "Adaptability": 9, "TailRisk": 7, "Precision": 7},
    "Consensus": {"WeightedLogic": 10, "Diversification": 10, "Stability": 9, "Reliability": 9, "Alpha": 8}
}

def migrate():
    if not os.path.exists(LEAGUE_DATA_PATH):
        print("File not found")
        return
    
    with open(LEAGUE_DATA_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for model_name, model in data['models'].items():
        # Update Stats
        if 'sharpe_ratio' not in model['stats']:
            model['stats']['sharpe_ratio'] = 0.0
        
        # Update Radar
        model['capability_radar'] = RADAR_MAPPING.get(model_name, {
            "Stability": 5, "Accuracy": 5, "Logic": 5, "Speed": 5, "Value": 5
        })
        
    with open(LEAGUE_DATA_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("Migration complete")

if __name__ == "__main__":
    migrate()
