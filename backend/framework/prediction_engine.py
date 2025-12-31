import random
import numpy as np

class MultiDimensionalPredictionEngine:
    """
    CORE ENGINE UPGRADE: Multi-Market Prediction System
    Generates probabilities and predictions for:
    1. 1x2 (Win/Draw/Loss) - Core
    2. Asian Handicap - Spread
    3. Over/Under - Totals
    4. BTTS (Both Teams To Score)
    5. Correct Score (Matrix)
    """

    def __init__(self, model_name):
        self.model_name = model_name

    def predict_match(self, match_info):
        """
        Generates a Full-Depth Prediction Profile for a given match.
        In a real system, this would infer from a trained ML model.
        Here, we simulate realistic probabilistic outputs based on model "personas".
        """
        
        # 1. Base Probabilities (Simulated based on team strength in match_info)
        # Assuming match_info has 'home_strength' and 'away_strength' or we random gen
        home_strength = random.uniform(0.4, 0.8) # Mock strength
        away_strength = random.uniform(0.3, 0.7)
        
        # Adjust based on Model Persona
        if "DeepSeek" in self.model_name:
            # DeepSeek relies on xG - tends to favor underdogs if stats align
            home_strength *= 0.95
        elif "Grok" in self.model_name:
            # Grok favors volatility/high scoring
            home_strength *= 1.05 
            
        prob_home, prob_draw, prob_away = self._simulate_1x2_probs(home_strength, away_strength)
        
        return {
            'basic': {
                '1x2': self._predict_1x2(prob_home, prob_draw, prob_away),
                'asian_handicap': self._predict_asian_handicap(home_strength, away_strength),
                'over_under': self._predict_over_under(home_strength, away_strength),
            },
            'advanced': {
                'btts': self._predict_btts(home_strength, away_strength),
                'correct_score': self._predict_correct_score_probs(prob_home, prob_away),
                'half_full': self._predict_ht_ft(prob_home, prob_draw, prob_away)
            },
            'statistical': {
                'confidence': random.randint(55, 95), # Model confidence Score
                'kelly_fraction': round(random.uniform(0.01, 0.08), 3), # Recommended Stake
                'value_edge': round(random.uniform(-0.05, 0.15), 3) # Perceived Edge vs Market
            }
        }

    def _simulate_1x2_probs(self, h_str, a_str):
        total = h_str + a_str + 0.5 # 0.5 for draw weight
        p_h = h_str / total
        p_a = a_str / total
        p_d = 1 - p_h - p_a
        return p_h, p_d, p_a

    def _predict_1x2(self, p_h, p_d, p_a):
        # Determine the "Pick" based on highest prob
        if p_h > p_a and p_h > p_d: return "Home"
        if p_a > p_h and p_a > p_d: return "Away"
        return "Draw"

    def _predict_asian_handicap(self, h_str, a_str):
        # Mock logic for Handicap
        diff = h_str - a_str
        line = round(diff * 2) / 2 # Round to nearest 0.5
        if line == 0: line = -0.0
        return {"line": line, "pick": "Home" if diff > 0 else "Away", "odds": round(random.uniform(1.85, 2.05), 2)}

    def _predict_over_under(self, h_str, a_str):
        # Mock logic for Totals
        expected_goals = (h_str + a_str) * 3.5
        line = 2.5
        pick = "Over" if expected_goals > 2.5 else "Under"
        return {"line": 2.5, "pick": pick, "prob": round(random.uniform(0.51, 0.65), 2)}

    def _predict_btts(self, h_str, a_str):
        prob = (h_str * a_str) * 2 # Crude approx
        return {"pick": "Yes" if prob > 0.5 else "No", "prob": round(prob, 2)}
        
    def _predict_correct_score_probs(self, p_h, p_a):
        # Generate top 3 likely scores
        scores = ["1-0", "1-1", "0-1", "2-1", "2-0", "0-0", "1-2"]
        # In real engine, use Poisson distribution
        return sorted([{"score": s, "prob": round(random.uniform(0.05, 0.20), 3)} for s in random.sample(scores, 3)], key=lambda x: x['prob'], reverse=True)

    def _predict_ht_ft(self, p_h, p_d, p_a):
        # Halftime/Fulltime
        return {"pick": "Draw/Home", "odds": 4.50}

