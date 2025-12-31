
import { createPortal } from 'react-dom';
import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Shield, AlertTriangle, Brain, TrendingUp, DollarSign, Send, Minimize2, Maximize2, Minus, Diamond, Lock, PlusCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { AI_MODELS } from '@/lib/modelVersions';
import { RadarChart } from '@/components/feature/RadarChart';
import { useBettingSlip } from '@/context/BettingSlipContext';

interface MatchDetailProps {
    match: any;
    isOpen: boolean;
    onClose: () => void;
    wallet?: any;
}

// --- TYPEWRITER COMPONENT ---
const TypewriterEffect = ({ text, className, shouldAnimate = true, onType }: { text: string, className?: string, shouldAnimate?: boolean, onType?: () => void }) => {
    const [display, setDisplay] = useState(shouldAnimate ? '' : text);

    useEffect(() => {
        if (!shouldAnimate) {
            setDisplay(text);
            return;
        }

        let i = 0;
        const speed = 20; // ms per char
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplay(text.substring(0, i + 1));
                i++;
                if (onType) onType();
            } else {
                clearInterval(timer);
            }
        }, speed);
        return () => clearInterval(timer);
    }, [text, shouldAnimate, onType]);

    return <p className={`${className} whitespace-pre-wrap`}>{display}</p>;
};


export function MatchDetailModal({ match, isOpen, onClose, wallet }: MatchDetailProps) {
    const { addToSlip } = useBettingSlip();
    const [userMessage, setUserMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [isMaximized, setIsMaximized] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [typingAgent, setTypingAgent] = useState<string | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [isClient, setIsClient] = useState(false);
    const [activeTab, setActiveTab] = useState<'thesis' | 'risk' | 'model' | 'audit'>('thesis');

    useEffect(() => {
        setIsClient(true);
    }, []);

    const matchId = match?.id || (match?.match_info ? `${match.match_info.home_team}_${match.match_info.away_team} ` : null);

    // SAFE DATA ACCESSORS (V4)
    const qa = match?.quant_analysis;
    const matchInfo = match?.match_info;
    const rec1x2 = qa?.recommendations?.['1x2'];
    const recAH = qa?.recommendations?.['asian_handicap'];
    const recOU = qa?.recommendations?.['over_under'];

    const isDiamond = qa?.portfolio_strategy?.diamond_pick;
    const causalChain = qa?.match_analysis?.causal_chain || "Processing deep dive...";
    const valueGap = rec1x2?.value_gap || "0%";

    // PARSE ASIAN HANDICAP (Infer Opposing Side)
    let ahHome = null;
    let ahAway = null;
    let ahHomeOdds = 1.90; // Default/Simulation
    let ahAwayOdds = 1.90; // Default/Simulation

    if (recAH?.selection) {
        // Format assumption: "Home -0.5" or "Away +0.5"
        const parts = recAH.selection.split(' ');
        const team = parts[0]; // "Home" or "Away" or TeamName
        const line = parts[1];

        if (team.includes('Home') || team === matchInfo?.home_team) {
            ahHome = { label: `Home ${line} `, odds: recAH.market_odds };
            // Inverse logic
            const invLine = line.startsWith('-') ? line.replace('-', '+') : line.replace('+', '-');
            ahAway = { label: `Away ${invLine} `, odds: 1.85 }; // Simulation Opposing Odds
        } else {
            ahAway = { label: `Away ${line} `, odds: recAH.market_odds };
            // Inverse logic
            const invLine = line.startsWith('-') ? line.replace('-', '+') : line.replace('+', '-');
            ahHome = { label: `Home ${invLine} `, odds: 1.85 }; // Simulation Opposing Odds
        }
    }

    // Initialize chat with Persistence
    useEffect(() => {
        if (!matchId || !qa) return;

        const newKey = `chat_history_v4_${matchId} `;
        let saved = localStorage.getItem(newKey);
        let parsed = saved ? JSON.parse(saved) : null;

        if (parsed) {
            setChatHistory(parsed);
        } else {
            // V4 INSTITUTIONAL WELCOME MESSAGE
            const initialLog = `CQIO, REPORTS GENERATED.\n\nTarget: ${matchInfo.home_team} vs ${matchInfo.away_team} \n\nCORE THESIS: ${causalChain} \n\nMARKET STATUS: ${qa.match_analysis.market_sentiment} \n\nThe Quantitative Council is seated.Awaiting your directive.`;

            setChatHistory([{
                model: 'SYSTEM',
                logic: initialLog,
                isUser: false,
                shouldAnimate: true
            }]);
        }
    }, [matchId, qa, matchInfo]);

    // Save to Persistence
    useEffect(() => {
        if (matchId && chatHistory.length > 0) {
            const key = `chat_history_v4_${matchId} `;
            localStorage.setItem(key, JSON.stringify(chatHistory));
        }
    }, [chatHistory, matchId]);

    const scrollToBottom = useCallback(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, typingAgent]);

    if (!isOpen || !match || !isClient) return null;

    const handleSendMessage = () => {
        if (!userMessage.trim()) return;
        const msg = { model: 'CQIO', logic: userMessage, isUser: true, shouldAnimate: false };
        setChatHistory(prev => [...prev, msg]);
        setUserMessage('');

        // Simulating Agent Response (Mock for now, would connect to API)
        setTimeout(() => {
            setTypingAgent("DeepSeek V3");
            setTimeout(() => {
                setTypingAgent(null);
                setChatHistory(prev => [...prev, {
                    model: 'DeepSeek V3',
                    logic: `Acknowledged.Re - running Monte Carlo simulations based on your input... The adjusted xG Delta confirms the Value Gap is broadening.`,
                    isUser: false,
                    shouldAnimate: true
                }]);
            }, 1000);
        }, 500);
    };

    const handleBet = (type: string, selection: string, odds: number) => {
        if (!wallet) return;
        const stake = 100;
        if (wallet.spend(stake, `Bet: ${selection} @${odds} (${type})`)) {
            // Add a system message to chat
            const betLog = `EXECUTION CONFIRMED: ${selection} @${odds} \nSTAKE: $${stake} \nSTATUS: OPEN`;
            setChatHistory(prev => [...prev, {
                model: 'SYSTEM',
                logic: betLog,
                isUser: false,
                shouldAnimate: false
            }]);
            // The original code had a duplicate `}]` here. Removed it.
        } else {
            alert("Insufficient Funds");
        }
    };

    const handleAddToSlip = (type: string, selection: string, odds: number) => {
        addToSlip({
            id: `${matchId} -${type} -${selection} `,
            matchId: matchId!,
            matchInfo: `${matchInfo?.home_team} vs ${matchInfo?.away_team} `,
            selection: selection,
            market: type,
            odds: odds
        });
    };

    // Helper for rendering a small market card
    const MarketCard = ({ title, data, highlight }: { title: string, data: any, highlight?: boolean }) => {
        if (!data) return null;
        return (
            <div className={`p-3 rounded border ${highlight ? 'bg-cyan-950/20 border-cyan-500/30' : 'bg-zinc-900/40 border-zinc-800'}`}>
                <div className="flex justify-between items-center mb-2">
                    <span className={`text-[10px] font-bold uppercase ${highlight ? 'text-cyan-400' : 'text-zinc-500'}`}>{title}</span>
                    {highlight && <Diamond size={8} className="text-cyan-400 animate-pulse" />}
                </div>
                <div className="text-sm font-black text-white truncate">{data.selection}</div>
                <div className="flex justify-between items-end mt-1">
                    <span className="text-[10px] font-mono text-zinc-400">@{data.fair_odds?.toFixed(2)}</span>
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] text-emerald-400 font-bold">+{data.value_gap}</span>
                        <div className="h-1 w-12 bg-zinc-800 rounded-full mt-0.5 overflow-hidden">
                            <div className={`h-full ${data.confidence >= 8 ? 'bg-cyan-400' : 'bg-emerald-500'}`} style={{ width: `${data.confidence * 10}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    // --- WINDOW RENDER ---

    if (isMinimized) {
        return createPortal(
            <div className="fixed bottom-4 right-4 z-[9999] w-72 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden animate-fade-in-up transition-all hover:bg-zinc-800 cursor-pointer" onClick={() => setIsMinimized(false)}>
                <div className="h-10 flex items-center justify-between px-3">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-white text-truncate max-w-[150px]">QUANT TERMINAL</span>
                    </div>
                </div>
            </div>,
            document.body
        );
    }

    const windowClasses = isMaximized
        ? "fixed inset-0 rounded-none border-none w-screen h-screen"
        : "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[85vh] rounded-xl shadow-2xl border border-zinc-800/50";

    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div className={`${windowClasses} z-[100] bg-zinc-950 flex flex-col overflow-hidden transition-all duration-300 ease-in-out`} onClick={(e) => e.stopPropagation()}>

                {/* HEADER */}
                <div className="h-10 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between px-4 shrink-0 select-none" onDoubleClick={() => setIsMaximized(!isMaximized)}>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600" />
                        <button onClick={() => setIsMinimized(true)} className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600" />
                        <button onClick={() => setIsMaximized(!isMaximized)} className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600" />
                    </div>
                    <div className="text-xs font-mono text-zinc-500 flex items-center gap-2">
                        <Diamond size={10} className={isDiamond ? "text-cyan-400 animate-pulse" : "text-zinc-600"} />
                        QUANT_ENGINE_V4.0 // {matchId}
                    </div>
                    <div className="w-16"></div>
                </div>

                {/* MAIN CONTENT */}
                <div className="flex-1 flex overflow-hidden">

                    {/* LEFT PANEL: THESIS & DATA (35%) */}
                    <div className="w-[35%] border-r border-zinc-900 bg-zinc-950/50 p-6 overflow-y-auto hidden lg:flex flex-col gap-6">

                        {/* Match Title */}
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{matchInfo?.league}</span>
                                <span className="text-[10px] font-mono text-zinc-500">{matchInfo?.date ? new Date(matchInfo.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                            </div>
                            <h1 className="text-2xl font-black text-white leading-none">{matchInfo?.home_team.toUpperCase()}</h1>
                            <div className="text-zinc-700 font-mono text-sm py-1">VS</div>
                            <h1 className="text-2xl font-black text-white leading-none">{matchInfo?.away_team.toUpperCase()}</h1>
                        </div>

                        {/* TRADING TERMINAL (Interactive Odds) */}
                        <div className="space-y-4">
                            {/* 1x2 Market */}
                            <div className="bg-zinc-900/40 rounded border border-zinc-800 p-3">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold uppercase text-zinc-500">Match Winner (1x2)</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {matchInfo?.real_odds?.['1x2'] && (
                                        <>
                                            <button
                                                className="p-2 rounded bg-zinc-800/50 hover:bg-zinc-700 hover:border-emerald-500/50 border border-transparent transition-all flex flex-col items-center group relative"
                                            >
                                                <div
                                                    onClick={(e) => { e.stopPropagation(); handleAddToSlip('1x2', matchInfo.home_team, matchInfo.real_odds['1x2'].home) }}
                                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 hover:text-emerald-400 transition-opacity"
                                                >
                                                    <PlusCircle size={12} />
                                                </div>
                                                <span className="text-[10px] text-zinc-400 group-hover:text-white">Home</span>
                                                <span className="text-sm font-bold text-white group-hover:text-emerald-400">@{matchInfo.real_odds['1x2'].home}</span>
                                            </button>
                                            <button
                                                className="p-2 rounded bg-zinc-800/50 hover:bg-zinc-700 hover:border-emerald-500/50 border border-transparent transition-all flex flex-col items-center group relative"
                                            >
                                                <div
                                                    onClick={(e) => { e.stopPropagation(); handleAddToSlip('1x2', 'Draw', matchInfo.real_odds['1x2'].draw) }}
                                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 hover:text-emerald-400 transition-opacity"
                                                >
                                                    <PlusCircle size={12} />
                                                </div>
                                                <span className="text-[10px] text-zinc-400 group-hover:text-white">Draw</span>
                                                <span className="text-sm font-bold text-white group-hover:text-emerald-400">@{matchInfo.real_odds['1x2'].draw}</span>
                                            </button>
                                            <button
                                                className="p-2 rounded bg-zinc-800/50 hover:bg-zinc-700 hover:border-emerald-500/50 border border-transparent transition-all flex flex-col items-center group relative"
                                            >
                                                <div
                                                    onClick={(e) => { e.stopPropagation(); handleAddToSlip('1x2', matchInfo.away_team, matchInfo.real_odds['1x2'].away) }}
                                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 hover:text-emerald-400 transition-opacity"
                                                >
                                                    <PlusCircle size={12} />
                                                </div>
                                                <span className="text-[10px] text-zinc-400 group-hover:text-white">Away</span>
                                                <span className="text-sm font-bold text-white group-hover:text-emerald-400">@{matchInfo.real_odds['1x2'].away}</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* O/U and HCP */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-zinc-900/40 rounded border border-zinc-800 p-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-bold uppercase text-zinc-500">Over/Under {matchInfo?.real_odds?.total?.point}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => handleBet('Total', `Over ${matchInfo?.real_odds?.total?.point} `, matchInfo?.real_odds?.total?.over)}
                                            className="p-2 rounded bg-zinc-800/50 hover:bg-zinc-700 border border-transparent hover:border-amber-500/50 transition-all text-center relative group"
                                        >
                                            <div
                                                onClick={(e) => { e.stopPropagation(); handleAddToSlip('Total', `Over ${matchInfo?.real_odds?.total?.point} `, matchInfo?.real_odds?.total?.over) }}
                                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 hover:text-amber-400 transition-opacity"
                                            >
                                                <PlusCircle size={12} />
                                            </div>
                                            <div className="text-[10px] text-zinc-400">Over</div>
                                            <div className="text-sm font-bold text-white">@{matchInfo?.real_odds?.total?.over}</div>
                                        </button>
                                        <button
                                            onClick={() => handleBet('Total', `Under ${matchInfo?.real_odds?.total?.point} `, matchInfo?.real_odds?.total?.under)}
                                            className="p-2 rounded bg-zinc-800/50 hover:bg-zinc-700 border border-transparent hover:border-amber-500/50 transition-all text-center relative group"
                                        >
                                            <div
                                                onClick={(e) => { e.stopPropagation(); handleAddToSlip('Total', `Under ${matchInfo?.real_odds?.total?.point} `, matchInfo?.real_odds?.total?.under) }}
                                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 hover:text-amber-400 transition-opacity"
                                            >
                                                <PlusCircle size={12} />
                                            </div>
                                            <div className="text-[10px] text-zinc-400">Under</div>
                                            <div className="text-sm font-bold text-white">@{matchInfo?.real_odds?.total?.under}</div>
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-zinc-900/40 rounded border border-zinc-800 p-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-bold uppercase text-zinc-500">Asian Handicap</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {ahHome && (
                                            <button
                                                onClick={() => handleBet('AH', ahHome.label, ahHome.odds)}
                                                className="p-2 rounded bg-zinc-800/50 hover:bg-zinc-700 border border-transparent hover:border-sky-500/50 transition-all text-center"
                                            >
                                                <div className="text-[10px] text-zinc-400">{ahHome.label}</div>
                                                <div className="text-sm font-bold text-white">@{ahHome.odds.toFixed(2)}</div>
                                            </button>
                                        )}
                                        {ahAway && (
                                            <button
                                                onClick={() => handleBet('AH', ahAway.label, ahAway.odds)}
                                                className="p-2 rounded bg-zinc-800/50 hover:bg-zinc-700 border border-transparent hover:border-sky-500/50 transition-all text-center"
                                            >
                                                <div className="text-[10px] text-zinc-400">{ahAway.label}</div>
                                                <div className="text-sm font-bold text-white">@{ahAway.odds.toFixed(2)}</div>
                                            </button>
                                        )}
                                        {!ahHome && <div className="col-span-2 text-xs text-zinc-500 text-center py-2">Market Closed</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* TABS */}
                        <div className="flex gap-4 border-b border-zinc-800">
                            <button onClick={() => setActiveTab('thesis')} className={`pb-2 text-xs font-bold uppercase transition-colors ${activeTab === 'thesis' ? 'text-white border-b-2 border-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Investment Thesis</button>
                            <button onClick={() => setActiveTab('model')} className={`pb-2 text-xs font-bold uppercase transition-colors ${activeTab === 'model' ? 'text-amber-400 border-b-2 border-amber-500' : 'text-zinc-500 hover:text-zinc-300'}`}>Model</button>
                            <button onClick={() => setActiveTab('audit')} className={`pb-2 text-xs font-bold uppercase transition-colors ${activeTab === 'audit' ? 'text-cyan-400 border-b-2 border-cyan-500' : 'text-zinc-500 hover:text-zinc-300'}`}>Audit Trail</button>
                            <button onClick={() => setActiveTab('risk')} className={`pb-2 text-xs font-bold uppercase transition-colors ${activeTab === 'risk' ? 'text-red-400 border-b-2 border-red-500' : 'text-zinc-500 hover:text-zinc-300'}`}>Risk</button>
                        </div>

                        {/* TAB CONTENT */}
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar text-sm leading-relaxed text-zinc-400">
                            {activeTab === 'thesis' ? (
                                <div className="space-y-4 animate-fade-in text-[13px]">
                                    <div className="p-3 bg-zinc-900/50 rounded border border-zinc-800">
                                        <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-xs uppercase">
                                            <Brain size={12} /> Causal Chain
                                        </div>
                                        {causalChain}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-zinc-900/30 rounded border border-zinc-800">
                                            <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Market Sentiment</div>
                                            <span className={`text-xs font-bold ${qa?.match_analysis?.market_sentiment?.includes('Trap') ? 'text-red-400' : 'text-zinc-300'}`}>
                                                {qa?.match_analysis?.market_sentiment}
                                            </span>
                                        </div>
                                        <div className="p-3 bg-zinc-900/30 rounded border border-zinc-800">
                                            <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Fundamental</div>
                                            <span className="text-xs text-zinc-300 font-bold">{qa?.match_analysis?.fundamental_rating}</span>
                                        </div>
                                    </div>
                                    {isDiamond && (
                                        <div className="p-3 bg-cyan-900/10 border border-cyan-500/20 rounded">
                                            <div className="text-[10px] text-cyan-500 uppercase font-bold mb-1 flex items-center gap-1"><Diamond size={10} /> Diamond Validation</div>
                                            <span className="text-xs text-cyan-100">{qa?.portfolio_strategy?.banker_reason}</span>
                                        </div>
                                    )}
                                </div>
                            ) : activeTab === 'model' ? (
                                <div className="h-full flex flex-col animate-fade-in">
                                    <div className="text-[10px] text-zinc-500 uppercase font-bold mb-4 text-center">Consensus Model Capability Fingerprint</div>
                                    <div className="h-[200px] w-full relative">
                                        <RadarChart stats={qa?.match_analysis?.radar_stats || {
                                            risk: 85,
                                            alpha: 92,
                                            accuracy: 78,
                                            recovery: 65,
                                            consist: 88
                                        }} />
                                    </div>
                                    <div className="mt-4 p-3 bg-zinc-900/30 rounded border border-zinc-800 text-xs text-zinc-400">
                                        <div className="flex justify-between mb-1">
                                            <span>Alpha Rating</span>
                                            <span className="text-white font-bold">{qa?.match_analysis?.alpha_rating || 'AA'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Chaos Resilience</span>
                                            <span className="text-white font-bold">{qa?.match_analysis?.market_chaos === 'HIGH' ? 'Low' : 'High'}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : activeTab === 'audit' ? (
                                <div className="space-y-6 pt-2 animate-fade-in font-mono">
                                    <div className="relative pl-6 border-l border-zinc-800 space-y-8">
                                        {/* Step 1 */}
                                        <div className="relative">
                                            <div className="absolute -left-[29px] top-0 w-3 h-3 rounded-full bg-zinc-800 border-2 border-zinc-950"></div>
                                            <div className="text-[10px] text-zinc-500 mb-1">T-4H 12M // RAW_INTEL</div>
                                            <div className="text-xs text-zinc-300 bg-zinc-900/50 p-2 rounded border border-zinc-800/50">
                                                <span className="text-cyan-500">SYSTEM:</span> 6 Independent Agents submitted 4,820 tactical data points. Primary divergence detected in xG volatility.
                                            </div>
                                        </div>
                                        {/* Step 2 */}
                                        <div className="relative">
                                            <div className="absolute -left-[29px] top-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-zinc-950 animate-pulse"></div>
                                            <div className="text-[10px] text-emerald-500/70 mb-1">T-3H 45M // SYNTHESIS</div>
                                            <div className="text-xs text-zinc-300 bg-emerald-900/5 border border-emerald-500/20 p-2 rounded">
                                                <span className="text-emerald-500">META-MODEL:</span> Dynamic weighting applied. <span className="text-white">DeepSeek (24%)</span>, <span className="text-white">GPT-4o (18%)</span>. Consensus locked at 0.78 confidence.
                                            </div>
                                        </div>
                                        {/* Step 3 */}
                                        <div className="relative">
                                            <div className="absolute -left-[29px] top-0 w-3 h-3 rounded-full bg-cyan-500 border-2 border-zinc-950 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                                            <div className="text-[10px] text-cyan-500/70 mb-1">T-3H 40M // RATING_ISSUED</div>
                                            <div className="text-xs font-bold text-white bg-cyan-950/20 border border-cyan-500/30 p-2 rounded">
                                                <span className="text-cyan-400">LEDGER:</span> Alpha Credit <span className="px-2 py-0.5 bg-cyan-500 text-black rounded ml-1">{qa?.match_analysis?.alpha_rating || 'AA'}</span> issued to protocol hash dx82k...92f.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-[9px] text-zinc-600 text-center uppercase tracking-tighter">
                                        End of Immutable Audit Log // Verifiable on QuantChain
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3 animate-fade-in">
                                    <div className="p-3 bg-red-900/10 border border-red-500/20 rounded">
                                        <div className="text-[10px] text-red-500 uppercase font-bold mb-1 flex items-center gap-1"><AlertTriangle size={10} /> Data Trap Risk</div>
                                        <span className="text-xs text-red-100">{qa?.risk_disclosure?.data_trap}</span>
                                    </div>
                                    <div className="p-3 bg-zinc-900/30 border border-zinc-800 rounded">
                                        <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Tactical Variable</div>
                                        <span className="text-xs text-zinc-400">{qa?.risk_disclosure?.tactical_variable}</span>
                                    </div>
                                    <div className="p-3 bg-zinc-900/30 border border-zinc-800 rounded">
                                        <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Contingency</div>
                                        <span className="text-xs text-zinc-400">{qa?.risk_disclosure?.contingency}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* FOOTER */}
                        <div className="mt-auto pt-4 border-t border-zinc-900">
                            <div className="flex items-center justify-between text-xs font-bold text-white bg-zinc-900 p-3 rounded">
                                <span className="flex items-center gap-2"><DollarSign size={14} className="text-emerald-500" /> KELLY ALLOCATION</span>
                                <span className="font-mono">{qa?.portfolio_strategy?.kelly_signal} UNITS</span>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT PANEL: CHAT TERMINAL (65%) */}
                    < div className="flex-1 bg-[#09090b] flex flex-col relative bg-dots-pattern" >
                        {/* CHAT HEADER */}
                        < div className="h-14 border-b border-zinc-900 flex items-center justify-between px-6 bg-zinc-950/80 backdrop-blur shrink-0" >
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-sm font-bold text-zinc-200 tracking-tight">WAR ROOM V4.0</span>
                            </div>
                            <div className="flex -space-x-2">
                                {['DS', 'CL', 'QW', 'GK'].map((initial, i) => (
                                    <div key={i} className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-950 flex items-center justify-center text-[8px] font-bold text-zinc-500">
                                        {initial}
                                    </div>
                                ))}
                            </div>
                        </div >

                        {/* CHAT MESSAGES */}
                        < div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar" >
                            {
                                chatHistory.map((msg, idx) => {
                                    const isSystem = msg.model === 'SYSTEM';
                                    const isUser = msg.isUser;

                                    return (
                                        <div key={idx} className={`flex gap-3 w-full animate-fade-in-up ${isUser ? 'justify-end' : 'justify-start'}`}>
                                            {/* Avatar Left */}
                                            {!isUser && (
                                                <div className={`mt-1 h-8 w-8 shrink-0 rounded flex items-center justify-center text-[9px] font-black border border-white/5 
                                                ${isSystem ? 'bg-zinc-800 text-emerald-500' : 'bg-cyan-900 text-cyan-400'}`}>
                                                    {msg.model.substring(0, 2)}
                                                </div>
                                            )}

                                            <div className={`max-w-[80%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                                                <span className="text-[9px] font-bold text-zinc-600 mb-1 ml-1">{msg.model}</span>
                                                <div className={`p-3 rounded-lg text-sm leading-relaxed font-light backdrop-blur-sm border 
                                                ${isUser ? 'bg-yellow-900/20 border-yellow-500/30 text-yellow-100 rounded-tr-none' :
                                                        isSystem ? 'bg-zinc-900/80 border-emerald-500/20 text-emerald-50 text-xs font-mono rounded-tl-none' :
                                                            'bg-zinc-900/80 border-zinc-800 text-zinc-300 rounded-tl-none'
                                                    } `}>
                                                    <TypewriterEffect
                                                        text={msg.logic}
                                                        shouldAnimate={msg.shouldAnimate}
                                                        onType={scrollToBottom}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                            {typingAgent && (
                                <div className="flex gap-3 w-full animate-pulse">
                                    <div className="mt-1 h-8 w-8 shrink-0 rounded flex items-center justify-center bg-zinc-800 border border-white/5 text-[9px] text-zinc-500">...</div>
                                    <div className="text-xs text-zinc-500 self-center">agent typing...</div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div >

                        {/* INPUT AREA */}
                        < div className="p-4 border-t border-zinc-900 bg-zinc-950 pt-2 pb-6" >
                            <div className="relative">
                                <input
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-4 pr-12 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors font-mono"
                                    placeholder="Issue directive to council..."
                                    value={userMessage}
                                    onChange={e => setUserMessage(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button onClick={handleSendMessage} className="absolute right-2 top-2 p-1.5 bg-white text-black rounded hover:bg-zinc-200 transition-colors">
                                    <Send size={14} />
                                </button>
                            </div>
                        </div >

                    </div >
                </div >
            </div >
        </div >,
        document.body
    );
}
