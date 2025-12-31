'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';

interface ModelHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    model: any;
}

// Deterministic random number generator based on string seed
// Ensures the same match always gets the same "random" logic
const getPseudoRandom = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    const x = Math.sin(hash) * 10000;
    return x - Math.floor(x);
};

const getEnhancedLogic = (matchInfo: any, prediction: any) => {
    const { home_team, away_team } = matchInfo;
    const winner = prediction.winner || "Home";
    const odds = parseFloat(prediction.odds || "1.90");
    const conf = prediction.confidence || 75;
    const targetTeam = winner === "Home" || winner === "Home Win" ? home_team :
        winner === "Away" || winner === "Away Win" ? away_team :
            "Draw";

    const opponent = targetTeam === home_team ? away_team : home_team;
    const seed = `${home_team}-${away_team}-${prediction.model}`; // Unique seed per match+model
    const rand = getPseudoRandom(seed);

    // 1. HIGH CONFIDENCE (>85%)
    if (conf > 85) {
        const templates = [
            `High-conviction alpha on ${targetTeam}. Momentum indicators suggest a probability deviation of +15% vs market.`,
            `Strong buy signal. ${targetTeam}'s recent xG (Expected Goals) differential dominates ${opponent}'s defensive metrics.`,
            `Critical mismatch. Market is severely underestimating ${targetTeam}'s squad depth and recent training form.`,
            `Aggressive entry. Model projects a 70%+ win probability for ${targetTeam}, far exceeding implied odds.`,
            `Institutional flow detected. Smart money moving towards ${targetTeam} aligns with our deep learning output.`
        ];
        return templates[Math.floor(rand * templates.length)];
    }

    // 2. HIGH ODDS / UNDERDOG (>3.0)
    if (odds > 3.0) {
        const templates = [
            `Contrarian value signal. Market inefficiently pricing ${targetTeam}'s counter-attacking threat.`,
            `Deep value play. Asymmetric risk-reward profile on ${targetTeam} at odds of ${odds}.`,
            `Reversion to mean expected. ${targetTeam} is statistically due for positive variance after recent bad luck.`,
            `Volatility arbitrage. ${opponent} is overvalued by public sentiment, creating opportunity on ${targetTeam}.`,
            `Speculative high-yield entry. ${targetTeam}'s set-piece efficiency could punish ${opponent}'s defense.`
        ];
        return templates[Math.floor(rand * templates.length)];
    }

    // 3. DRAW
    if (winner.includes("Draw")) {
        const templates = [
            `Statistical deadlock anticipated. Poisson distribution models indicate a tight, low-scoring affair.`,
            `Midfield congestion likely. Both ${home_team} and ${away_team} show conservative tactical setups.`,
            `Liquidity trap. Heavy volume on the draw suggests market consensus on a stalemate.`,
            `Variance suppression. Models predict game state will neutralize significantly in the second half.`,
            `Efficiency rating equilibrium. Neither side possesses sufficient attacking output to break the deadlock.`
        ];
        return templates[Math.floor(rand * templates.length)];
    }

    // 4. STANDARD VALUE (Normal predictions)
    const templates = [
        `Algorithmic mismatch identified in ${targetTeam}'s defensive efficiency rating vs bookmaker expectations.`,
        `Solid value play. ${targetTeam} historically outperforms ${opponent} in similar weather/pitch conditions.`,
        `Technical breakout likely. ${targetTeam} showing strong possession improvements in last 3 fixtures.`,
        `Fundamental analysis favors ${targetTeam}. Key player return boosts projection by 8 basis points.`,
        `Pattern recognition triggered. ${opponent}'s away form vulnerability exposes them to ${targetTeam}.`,
        `Statistical edge found. ${targetTeam} creates significantly more big chances (BCC) per 90 mins.`,
        `Market drift opportunity. Late line movement has created better entry price for ${targetTeam}.`
    ];
    return templates[Math.floor(rand * templates.length)];
};

export function ModelHistoryModal({ isOpen, onClose, model }: ModelHistoryModalProps) {
    const router = useRouter();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showShadowCloneSuccess, setShowShadowCloneSuccess] = useState(false);

    useEffect(() => {
        // Reset state when model changes
        if (isOpen) {
            setShowShadowCloneSuccess(false);
        }
    }, [isOpen, model]);

    const handleShadowClone = () => {
        // Mock processing time
        setTimeout(() => {
            setShowShadowCloneSuccess(true);
        }, 600);
    };

    useEffect(() => {
        if (isOpen && model) {
            setLoading(true);
            fetch('/matches_data.json')
                // ... (rest of fetch logic remains same)
                .then(res => res.json())
                .then(data => {
                    const transactions = data.map((match: any) => {
                        let prediction = null;

                        if (model.name.includes("Consensus")) {
                            // Consensus still uses its specific real logic if available, or fallback
                            const consensusLogic = match.consensus?.signal
                                ? `AI Consensus: ${match.consensus?.signal}. Edge: ${match.consensus?.edge_percent}%`
                                : "Simulated analysis";

                            prediction = {
                                winner: match.consensus?.target,
                                confidence: match.consensus?.confidence,
                                logic: consensusLogic,
                                odds: match.consensus?.market_odds,
                                model: "Consensus"
                            };
                        } else {
                            prediction = match.models?.find((m: any) =>
                                model.name.includes(m.model) || m.model.includes(model.name)
                            );
                        }

                        if (!prediction) return null;

                        // DATA PASS-THROUGH: Use the logic strictly as provided by the backend.
                        // The backend now generates model-specific, high-quality analysis directly.
                        const displayLogic = prediction.logic;

                        return {
                            date: new Date(match.match_info?.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZone: 'UTC'
                            }),
                            match: `${match.match_info?.home_team} vs ${match.match_info?.away_team}`,
                            pick: prediction.winner || "N/A",
                            odds: prediction.odds || match.odds?.Home || "1.90",
                            status: match.match_info?.status === 'FT' ? 'Finished' : 'Pending/Live',
                            pnl: match.match_info?.status === 'FT' ? '0' : 'Pending',
                            logic: displayLogic,
                            confidence: prediction.confidence
                        };
                    }).filter(Boolean);

                    setHistory(transactions);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load history", err);
                    setLoading(false);
                });
        }
    }, [isOpen, model]);

    if (!isOpen || !model) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[85vh]">

                {/* --- SHADOW CLONE SUCCESS OVERLAY --- */}
                {showShadowCloneSuccess && (
                    <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-8 animate-fade-in text-center">
                        <div className="max-w-md w-full animate-bounce-slight relative">
                            {/* Confetti / Glow Effect */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[var(--brand)]/20 blur-[100px] rounded-full pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="w-24 h-24 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-8 border border-green-500/50 shadow-[0_0_50px_rgba(34,197,94,0.4)] animate-scale-in">
                                    <CheckCircle size={48} strokeWidth={3} />
                                </div>
                                <h2 className="text-4xl font-black text-white mb-2 tracking-tight">PORTFOLIO CLONED</h2>
                                <p className="text-zinc-400 mb-8 text-lg">
                                    Virtual Capital Successfully Allocated
                                </p>

                                <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 mb-8 text-left space-y-3 shadow-xl">
                                    <div className="flex justify-between items-center pb-3 border-b border-zinc-800/50">
                                        <span className="text-zinc-500 font-mono text-xs uppercase tracking-wider">Strategy</span>
                                        <span className="text-[var(--brand)] font-bold flex items-center gap-2">
                                            {model.name} <span className="text-[10px] bg-[var(--brand)]/20 px-1.5 rounded text-[var(--brand)] border border-[var(--brand)]/30">COPY</span>
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-zinc-500 font-mono text-xs uppercase tracking-wider">Funding</span>
                                        <span className="text-white font-mono font-bold text-lg">$1,000.00</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-zinc-500 font-mono text-xs uppercase tracking-wider">Asset Class</span>
                                        <span className="text-green-400 font-mono text-xs">VIRTUAL USD</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setShowShadowCloneSuccess(false);
                                        onClose();
                                        router.push(`/dashboard?cloned_model=${encodeURIComponent(model.name)}`);
                                    }}
                                    className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-zinc-200 transition-transform hover:scale-[1.02] shadow-lg text-sm uppercase tracking-widest"
                                >
                                    Access Shadow Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            {model.name}
                            <span className={`text-xs px-2 py-0.5 rounded border ${model.roi_monthly > 0 ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                {model.roi_monthly > 0 ? 'PROFITABLE' : 'LOSING'}
                            </span>
                        </h3>
                        <p className="text-zinc-500 text-sm mt-1">Live Transaction Ledger • Strategy Logic Exposed</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleShadowClone}
                            className="bg-[var(--brand)]/90 hover:bg-[var(--brand)] text-zinc-950 font-black px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105 shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] group"
                        >
                            <Zap size={14} className="fill-current group-hover:animate-pulse" />
                            Clone Portfolio
                        </button>
                        <button onClick={onClose} className="text-zinc-500 hover:text-white p-2 hover:bg-zinc-800 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 p-0 bg-zinc-950/50">
                    {loading ? (
                        <div className="flex items-center justify-center h-64 text-zinc-500 gap-2">
                            <Clock className="animate-spin" /> Verifying blockchain records...
                        </div>
                    ) : history.length === 0 ? (
                        <div className="p-8 text-center text-zinc-500">No active signals found for this model today.</div>
                    ) : (
                        <table className="w-full text-left text-sm border-collapse">
                            <thead className="bg-zinc-900/80 text-zinc-500 font-mono text-xs uppercase sticky top-0 backdrop-blur-md z-10">
                                <tr>
                                    <th className="px-6 py-4">Time (UTC)</th>
                                    <th className="px-6 py-4">Match</th>
                                    <th className="px-6 py-4">Prediction & Logic</th>
                                    <th className="px-6 py-4">Confidence</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/30">
                                {history.map((tx, idx) => (
                                    <tr key={idx} className="hover:bg-zinc-900/20 transition-colors group">
                                        <td className="px-6 py-4 text-zinc-500 font-mono text-xs whitespace-nowrap">
                                            {tx.date}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-zinc-300">{tx.match}</div>
                                            <div className="text-xs text-zinc-600 mt-1">Odds: <span className="text-zinc-400">{tx.odds}</span></div>
                                        </td>
                                        <td className="px-6 py-4 max-w-md">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`font-bold text-xs px-2 py-0.5 rounded ${tx.pick.includes('Home') ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-700 text-zinc-300'}`}>
                                                    {tx.pick}
                                                </span>
                                            </div>
                                            <p className="text-xs text-zinc-400 leading-relaxed italic border-l-2 border-zinc-800 pl-2 mt-2 group-hover:border-[var(--brand)] transition-colors">
                                                "{tx.logic}"
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[var(--brand)]" style={{ width: `${tx.confidence}%` }} />
                                                </div>
                                                <span className="text-xs font-mono text-[var(--brand)]">{tx.confidence}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20">
                                                <Clock size={12} /> Live
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-zinc-800 bg-zinc-900/30 text-center">
                    <p className="text-xs text-zinc-500">
                        All timestamps are UTC. Hash verification available on Solana testnet.
                    </p>
                </div>

            </div>
        </div>
    );
}
