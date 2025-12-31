'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, AlertTriangle, TrendingUp, ShieldAlert, Diamond, Lock, Copy, Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { MatchDetailModal } from './MatchDetailModal';
import { useBettingSlip } from '@/context/BettingSlipContext';
import { PlusCircle } from 'lucide-react';


// Define V4 Data Types for Type Safety
interface Recommendation {
    selection: string;
    fair_odds: number;
    market_odds: number;
    value_gap: string;
    confidence: number;
    risk_note: string;
}

interface QuantAnalysis {
    match_analysis: {
        causal_chain: string;
        market_sentiment: "Normal" | "Luring Trap" | "Heavy Public";
        fundamental_rating: string;
        weather_referee_impact: string;
        alpha_rating?: string;
        black_swan_option?: any;
    };
    recommendations: {
        "1x2": Recommendation;
        asian_handicap: Recommendation;
        over_under: Recommendation;
    };
    portfolio_strategy: {
        diamond_pick: boolean;
        banker_reason?: string;
        kelly_signal: string;
        hedging_suggestion: string;
    };
    risk_disclosure: {
        data_trap: string;
        tactical_variable: string;
        contingency: string;
    };
}

interface MatchV4 {
    id: string;
    match_info: {
        home_team: string;
        away_team: string;
        league: string;
        date: string;
        status: string;
    };
    quant_analysis: QuantAnalysis;
}

interface Wallet {
    balance: number;
    spend: (amount: number, description: string) => boolean;
}

export function SignalTable({ wallet }: { wallet?: Wallet }) {
    const [matches, setMatches] = useState<MatchV4[]>([]);
    const [selectedMatch, setSelectedMatch] = useState<MatchV4 | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVip, setIsVip] = useState(true); // Default to True for Demo
    const { addToSlip } = useBettingSlip();

    const handleBet = (match: MatchV4, selection: string, market: string, odds: number) => {
        if (!wallet) return;

        const stake = 100; // Fixed Unit for Demo "Quick Bet"
        if (wallet.spend(stake, `Bet: ${selection} @ ${odds} (${market})`)) {
            alert(`Bet Placed: $${stake} on ${selection}`);
        } else {
            alert("Insufficient Funds");
        }
    };


    useEffect(() => {
        // Fetching V4 Data
        fetch('/matches_data_v4.json')
            .then(res => res.json())
            .then((data) => {
                if (Array.isArray(data)) setMatches(data);
                else console.error("Data format error", data);
            })
            .catch(err => console.error("Failed to load matches", err));
    }, []);

    const handleRowClick = (match: MatchV4) => {
        setSelectedMatch(match);
        setIsModalOpen(true);
    };

    return (
        <Card className="overflow-hidden border-zinc-800 bg-zinc-900/30">

            {/* V4 ENGINE STATUS HEADER */}
            <div className="p-4 bg-zinc-950/80 border-b border-zinc-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-emerald-400 tracking-wider">QUANT ENGINE V4.0 LIVE</div>
                        <div className="text-[10px] text-zinc-500">INSTITUTIONAL GRADE • CAUSAL INFERENCE ENABLED</div>
                    </div>
                </div>

                <button
                    onClick={() => setIsVip(!isVip)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all ${isVip ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                >
                    {isVip ? 'VIP: UNLOCKED' : 'VIP: LOCKED'}
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-950/50 text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Fixture</th>
                            <th className="px-6 py-4">Strategy / Signal</th>
                            <th className="px-6 py-4">Quant Conf. (0-10)</th>
                            <th className="px-6 py-4">Alpha / Hedge</th>
                            <th className="px-6 py-4">Value Gap</th>
                            <th className="px-6 py-4">Market Sentiment</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {matches.map((item) => {
                            const analysis = item.quant_analysis;
                            // Extract all markets
                            const rec1x2 = analysis.recommendations["1x2"];
                            const recAH = analysis.recommendations.asian_handicap;
                            const recOU = analysis.recommendations.over_under;
                            const markets = [
                                { label: "胜平负", data: rec1x2, key: '1x2' },
                                { label: "亚盘", data: recAH, key: 'AH' },
                                { label: "大小球", data: recOU, key: 'O/U' }
                            ];

                            // Determine primary signal (e.g. Diamond Pick)
                            const primarySignal = analysis.portfolio_strategy.diamond_pick ? "Diamond Pick" : rec1x2.selection; // Kept original primary signal logic for copy button
                            const isTrap = analysis.match_analysis.market_sentiment === "Luring Trap";

                            // Format date for display
                            const matchDate = new Date(item.match_info.date);
                            const timeStr = matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

                            return (
                                <tr
                                    key={item.id}
                                    onClick={() => handleRowClick(item)}
                                    className="border-b border-zinc-800/50 hover:bg-zinc-800/30 cursor-pointer transition-colors group"
                                >
                                    {/* 1. Fixture Info */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                                                {item.match_info.league} • <span className="text-zinc-400">{timeStr}</span>
                                            </span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="font-bold text-base text-zinc-200">{item.match_info.home_team}</span>
                                                <span className="text-zinc-600 text-xs">vs</span>
                                                <span className="font-bold text-base text-zinc-200">{item.match_info.away_team}</span>
                                            </div>
                                            {/* Signal Badge */}
                                            <div className="mt-2 flex items-center gap-2">
                                                {analysis.portfolio_strategy.diamond_pick && (
                                                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                                        <Star size={8} fill="currentColor" /> Diamond
                                                    </span>
                                                )}
                                                {isTrap && (
                                                    <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold uppercase tracking-wider">
                                                        Trap
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* 2. Strategy/Signal (Stacked Markets) */}
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex flex-col gap-2">
                                            {markets.map((m, idx) => (
                                                <div key={idx} className="flex items-center justify-between gap-4 text-sm">
                                                    <span className="text-zinc-500 text-xs w-12 text-right mr-2 font-mono">{m.label}</span>
                                                    <span className={`font-bold ${isTrap ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                                                        {m.data.selection}
                                                    </span>
                                                    <span className="text-zinc-500 font-mono text-xs w-10 text-right">
                                                        @{m.data.market_odds?.toFixed(2) || "-.--"}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>

                                    {/* 3. Quant Confidence (Stacked) */}
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex flex-col gap-3">
                                            {markets.map((m, idx) => (
                                                <div key={idx} className="flex items-center gap-2 h-5">
                                                    <div className={`w-6 text-[10px] font-mono font-bold text-center rounded
                                                        ${m.data.confidence >= 8 ? 'bg-cyan-900/50 text-cyan-400' :
                                                            m.data.confidence >= 5 ? 'bg-emerald-900/50 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}
                                                    `}>
                                                        {m.data.confidence}
                                                    </div>
                                                    <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${m.data.confidence >= 8 ? 'bg-cyan-500' : 'bg-emerald-500'}`}
                                                            style={{ width: `${m.data.confidence * 10}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </td>

                                    {/* 3.5. Alpha / Hedge (New Column) */}
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex flex-col gap-2">
                                            <div className="h-5 flex items-center gap-2">
                                                <div className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${analysis.match_analysis.alpha_rating === 'AAA' ? "bg-emerald-500 text-black border-emerald-400" :
                                                        analysis.match_analysis.alpha_rating === 'AA' ? "bg-emerald-900/50 text-emerald-400 border-emerald-800" :
                                                            "bg-zinc-800 text-zinc-500 border-zinc-700"
                                                    }`}>
                                                    {analysis.match_analysis.alpha_rating || 'B'}
                                                </div>
                                                {analysis.match_analysis.alpha_rating === 'AAA' && (
                                                    <span className="text-[9px] text-emerald-400 font-bold tracking-widest uppercase">Prime</span>
                                                )}
                                            </div>

                                            {/* Black Swan Alert (If chaos detected) */}
                                            {analysis.match_analysis.black_swan_option && (
                                                <div className="flex items-center gap-1.5 text-[10px] text-purple-400 font-bold uppercase tracking-wider animate-pulse mt-2 p-1 rounded bg-purple-900/20 border border-purple-500/30">
                                                    <AlertTriangle size={10} />
                                                    <span>Hedge Rec.</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* 4. Value Gap (Stacked) */}
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex flex-col gap-2">
                                            {markets.map((m, idx) => {
                                                const gapVal = parseFloat(m.data.value_gap.replace('%', ''));
                                                const isPos = gapVal > 0;

                                                return (
                                                    <div key={idx} className="h-5 flex items-center">
                                                        {!isVip ? (
                                                            <div className="flex items-center gap-1 blur-sm opacity-50 select-none">
                                                                <span className="text-emerald-400 font-mono text-xs">+??%</span>
                                                                <Lock size={10} className="text-amber-500" />
                                                            </div>
                                                        ) : (
                                                            <span className={`font-mono font-bold text-xs ${isPos ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                                                {isPos ? '+' : ''}{m.data.value_gap}
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </td>

                                    {/* 5. Market Sentiment */}
                                    <td className="px-6 py-4">
                                        {analysis.match_analysis.market_sentiment === "Luring Trap" ? (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-red-900/30 border border-red-500/30 text-red-400 text-xs font-bold">
                                                <ShieldAlert size={12} />
                                                TRAP ALERT
                                            </span>
                                        ) : analysis.match_analysis.market_sentiment === "Heavy Public" ? (
                                            <span className="text-xs text-amber-500 font-medium">High Public Load</span>
                                        ) : (
                                            <span className="text-xs text-zinc-500">Neutral Flow</span>
                                        )}
                                    </td>

                                    {/* 6. Action */}
                                    <td className="px-6 py-4 text-right">
                                        {!isVip ? (
                                            <button className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded transition-colors">
                                                Connect Wallet
                                            </button>
                                        ) : isTrap ? (
                                            <span className="text-xs font-mono text-red-500 font-bold">ABORT</span>
                                        ) : (

                                            <div className="flex flex-col items-end gap-2">
                                                {/* 3 Quick Bet Actions */}
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleBet(item, rec1x2.selection, '1x2', rec1x2.market_odds); }}
                                                        className="px-2 py-1 bg-emerald-900/40 hover:bg-emerald-600 border border-emerald-500/30 text-[10px] text-emerald-100 rounded transition-all"
                                                        title={`Bet 1x2: ${rec1x2.selection}`}
                                                    >
                                                        胜平负
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleBet(item, recAH.selection, 'AH', recAH.market_odds); }}
                                                        className="px-2 py-1 bg-sky-900/40 hover:bg-sky-600 border border-sky-500/30 text-[10px] text-sky-100 rounded transition-all"
                                                        title={`Bet AH: ${recAH.selection}`}
                                                    >
                                                        亚盘
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleBet(item, recOU.selection, 'O/U', recOU.market_odds); }}
                                                        className="px-2 py-1 bg-amber-900/40 hover:bg-amber-600 border border-amber-500/30 text-[10px] text-amber-100 rounded transition-all"
                                                        title={`Bet O/U: ${recOU.selection}`}
                                                    >
                                                        大小球
                                                    </button>
                                                </div>
                                                {/* ADD TO PARLAY Actions */}
                                                <div className="flex gap-1 justify-end mt-1">
                                                    {markets.map((m, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addToSlip({
                                                                    id: `${item.id}-${m.key}`,
                                                                    matchId: item.id,
                                                                    matchInfo: `${item.match_info.home_team} vs ${item.match_info.away_team}`,
                                                                    selection: m.data.selection,
                                                                    market: m.label,
                                                                    odds: m.data.market_odds
                                                                });
                                                            }}
                                                            className="p-1 rounded bg-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors"
                                                            title={`Add to Parlay: ${m.data.selection}`}
                                                        >
                                                            <PlusCircle size={10} />
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="flex items-center gap-2 font-mono text-xs text-white">
                                                    <span>Rec:</span>
                                                    <span className="font-bold text-cyan-400">{analysis.portfolio_strategy.kelly_signal}u</span>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Note: MatchDetailModal also needs updates to parse V4 data if we want the modal to work perfectly. 
                For now we keep it mounting but it might crash if accessed with V4 Object structure.
                This is acceptable for this step as per user instruction to focus on SignalTable first. 
            */}
            <MatchDetailModal
                match={selectedMatch}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                wallet={wallet}
            />
        </Card >
    );
}
