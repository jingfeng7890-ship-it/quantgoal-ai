import numpy as np

class ModelMultiDimensionalRating:
    """
    RATING SYSTEM UPGRADE: Multi-Axial Performance Scoring
    Replaces simple "ROI Ranking" with a weighted composite score (0-100).
    """

    def calculate_comprehensive_rating(self, model_perf):
        """
        Calculates the "QuantGoal Alpha Score" (0-100)
        Components:
        1. Core Accuracy (1x2, HDP, OU) - 50%
        2. Advanced Profits (Correct Score, BTTS) - 30%
        3. Statistical Edge (Consistency, Drawdown) - 20%
        """
        
        # 1. Core Competence (Mocked Metrics)
        core_score = (
            model_perf.get('acc_1x2', 0) * 0.4 +
            model_perf.get('acc_ah', 0) * 0.3 + 
            model_perf.get('acc_ou', 0) * 0.3
        )
        
        # 2. Advanced Competence
        adv_score = (
            min(model_perf.get('roi_cs', 0) / 10, 100) * 0.5 + # ROI Normalized
            model_perf.get('acc_btts', 0) * 0.5
        )
        
        # 3. Statistical (Risk Adjusted)
        stat_score = 100 - min(model_perf.get('drawdown_max', 0) * 2, 50) # Penalize drawdown
        
        # Weighted Total
        total_rating = (core_score * 0.5) + (adv_score * 0.3) + (stat_score * 0.2)
        
        return {
            "total_rating": round(total_rating, 1),
            "breakdown": {
                "Core": round(core_score, 1),
                "Advanced": round(adv_score, 1),
                "Stability": round(stat_score, 1)
            },
            "rank_tier": self._get_tier(total_rating)
        }

    def _get_tier(self, score):
        if score >= 90: return "Grandmaster"
        if score >= 80: return "Master"
        if score >= 70: return "Professional"
        return "Amateur"
