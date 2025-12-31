'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BadgeCheck, TrendingUp, AlertTriangle, Shield, Brain, ChevronDown, ChevronUp, Lock, LayoutList, Scale, Activity, Quote, Star, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ChampionLeague } from './ChampionLeague';

import { FootballDataService } from '../../services/FootballDataService';

// Mock Data Removed - Handled by Service

export function Arena() {
    const [matches, setMatches] = useState<any[]>([]);

    useEffect(() => {
        const loadMatches = async () => {
            const data = await FootballDataService.getMatches();
            setMatches(data);
        };
        loadMatches();
    }, []);

    if (matches.length === 0) return <div>Loading Intelligence...</div>;

    return (
        <section id="arena" className="relative overflow-hidden mb-8">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/30 via-black to-black pointer-events-none" />

            <div className="relative z-10 w-full">
                {/* Section Header */}
                <div className="max-w-5xl mx-auto text-center space-y-4 mb-12 pt-8">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                        Upcoming Alpha Signals
                    </h2>
                    <p className="text-zinc-400 max-w-[600px] mx-auto">
                        Real-time predictions from our Multi-Dimensional Engine.
                        <br />
                        <span className="text-yellow-500 font-bold">VIP Members</span> see the exact Target & Stake.
                    </p>
                </div>

                {/* DAILY AI PARLAY (New Feature) */}
                <DailyParlayCard matches={matches} />

                {/* Match Grid (List of Cards) */}
                <div className={cn(
                    "grid gap-6 px-4",
                    matches.length > 2 ? "lg:grid-cols-2 max-w-7xl mx-auto" : "max-w-4xl mx-auto"
                )}>
                    {matches.map((match) => (
                        <MatchCard key={match.id} match={match} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function MatchCard({ match }: { match: any }) {
    const { isPro } = useAuth();
    // Use raw analysis if available (V4), else fallback logic would be needed but we assume V4
    const analysis = match.raw_analysis;
    const rec1x2 = analysis?.recommendations?.["1x2"];
    const recAH = analysis?.recommendations?.["asian_handicap"];
    const recOU = analysis?.recommendations?.["over_under"];

    const isStrongBuy = match.consensus?.signal?.includes('Value') || match.consensus?.confidence > 80;
    const isHighEdge = (match.consensus?.edge_percent || 0) > 10;
    const isDiamond = analysis?.portfolio_strategy?.diamond_pick;

    // Physiological Arousal Effect (Heartbeat)
    useEffect(() => {
        if (isPro && isHighEdge) {
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate([60, 40, 60, 400]);
            }
        }
    }, [isPro, isHighEdge]);

    return (
        <Card className="p-0 overflow-hidden border-zinc-800 relative group transition-all duration-300 hover:border-zinc-600 bg-black/40 backdrop-blur-sm">
            {/* Header / Main Content */}
            <div className="p-5 grid md:grid-cols-[1fr_1.5fr] gap-6 items-start">

                {/* Left Col: Fixture Details */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                        <span className="flex items-center gap-1"><Brain size={10} /> {match.league}</span>
                        <span>{match.time}</span>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xl md:text-2xl font-black text-white">{match.home}</span>
                        </div>
                        <div className="text-zinc-600 font-mono text-[10px] pl-1">vs</div>
                        <div className="flex items-center justify-between">
                            <span className="text-xl md:text-2xl font-black text-white text-right">{match.away}</span>
                        </div>
                    </div>

                    {/* Logic Teaser */}
                    <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                        <div className="flex items-start gap-2">
                            <Quote size={12} className="text-zinc-600 shrink-0 mt-0.5" />
                            <div className="space-y-1.5">
                                <p className="text-xs text-zinc-300 italic leading-relaxed">
                                    "{match.models?.[0]?.logic || 'Analyzing market data...'}"
                                </p>
                                <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-mono uppercase tracking-wider">
                                    <span>— DeepSeek V3 Analysis</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: The Signals (Hero + List) */}
                <div className="relative flex flex-col gap-3">

                    {/* PAYWALL OVERLAY */}
                    {!isPro && (
                        <div className="absolute inset-0 z-20 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center rounded-xl border border-zinc-800/50">
                            <Lock className="text-[var(--brand)] mb-3" size={32} />
                            <div className="text-xl font-black text-white mb-1">SIGNALS LOCKED</div>
                            <Link href="#pricing">
                                <Button size="sm" className="bg-[var(--brand)] text-black font-bold">
                                    Unlock Full Analysis
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Pro Badge */}
                    {(isDiamond || isHighEdge) && (
                        <div className="self-start inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-cyan-950 text-cyan-400 border border-cyan-800">
                            <Star size={8} fill="currentColor" className="animate-pulse" />
                            Diamond Pick (Institutional)
                        </div>
                    )}

                    {/* MAIN HERO SIGNAL (Refined Design) */}
                    <div className={cn(
                        "relative overflow-hidden rounded-xl bg-zinc-900 border transition-all duration-300",
                        isHighEdge && isPro ? "border-red-500/50 shadow-[0_0_30px_rgba(220,38,38,0.2)]" : "border-zinc-800",
                        !isPro && "blur-xl opacity-20 select-none"
                    )}>
                        {/* High Alpha Badge (Absolute Top Right) */}
                        {isHighEdge && (
                            <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest py-0.5 px-2 rounded-bl-lg shadow-lg z-10 flex items-center gap-1">
                                <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                                High Alpha Alert
                            </div>
                        )}

                        <div className="p-4 relative z-0">
                            {/* Main Selection */}
                            <div className="mb-3">
                                <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold mb-0.5">
                                    Recommended Bet
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl md:text-3xl font-black text-white tracking-tighter">
                                        {rec1x2?.selection || "No Signal"}
                                    </span>
                                    <span className="text-lg text-zinc-500 font-medium">
                                        @{rec1x2?.market_odds?.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-zinc-800 w-full mb-3" />

                            {/* 3-Column Stats */}
                            <div className="grid grid-cols-3 gap-2">
                                {/* Confidence */}
                                <div>
                                    <div className="text-[9px] text-zinc-600 uppercase tracking-wider font-bold mb-0.5">Conf.</div>
                                    <div className="text-lg font-black text-white">
                                        {match.consensus?.confidence || 0}%
                                    </div>
                                </div>

                                {/* Kelly Stake */}
                                <div>
                                    <div className="text-[9px] text-zinc-600 uppercase tracking-wider font-bold mb-0.5">Kelly Stake</div>
                                    <div className="text-lg font-black text-amber-500">
                                        {match.consensus?.kelly_stake}
                                    </div>
                                </div>

                                {/* Edge */}
                                <div>
                                    <div className="text-[9px] text-zinc-600 uppercase tracking-wider font-bold mb-0.5">Edge</div>
                                    <div className="text-lg font-black text-red-400">
                                        +{rec1x2?.value_gap}
                                    </div>
                                </div>
                            </div>

                            {/* INSTITUTIONAL RATINGS (Added Upgrade) */}
                            <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-bold">Alpha Rating</div>
                                    <div className={`text-xs font-black px-1.5 py-0.5 rounded ${match.raw_analysis?.match_analysis?.alpha_rating === 'AAA' ? "bg-emerald-500 text-black" :
                                            match.raw_analysis?.match_analysis?.alpha_rating === 'AA' ? "bg-emerald-900/50 text-emerald-400 border border-emerald-800" :
                                                "bg-zinc-800 text-zinc-400"
                                        }`}>
                                        {match.raw_analysis?.match_analysis?.alpha_rating || 'B'}
                                    </div>
                                </div>

                                {match.raw_analysis?.match_analysis?.black_swan_option && (
                                    <div className="flex items-center gap-1 text-[9px] text-purple-400 font-bold uppercase tracking-widest animate-pulse">
                                        <AlertTriangle size={10} />
                                        Black Swan Hedge
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SECONDARY MARKETS (Compact List) */}
                    <div className={cn("grid gap-2", !isPro && "blur-xl opacity-20 select-none")}>
                        {/* Asian Handicap */}
                        <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-1 rounded bg-zinc-800 text-zinc-400"><Scale size={12} /></div>
                                <div>
                                    <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Asian Handicap</div>
                                    <div className="font-bold text-sm text-zinc-200">
                                        {recAH?.selection || "Pass"}
                                        <span className="text-zinc-500 font-normal ml-2">@{recAH?.market_odds?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            {recAH?.value_gap && parseFloat(recAH.value_gap.replace('%', '')) > 0 && (
                                <span className="text-emerald-400 font-mono text-[10px] font-bold">+{recAH.value_gap}</span>
                            )}
                        </div>

                        {/* Over / Under */}
                        <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-1 rounded bg-zinc-800 text-zinc-400"><Activity size={12} /></div>
                                <div>
                                    <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Total Goals</div>
                                    <div className="font-bold text-sm text-zinc-200">
                                        {recOU?.selection || "Pass"}
                                        <span className="text-zinc-500 font-normal ml-2">@{recOU?.market_odds?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            {recOU?.value_gap && parseFloat(recOU.value_gap.replace('%', '')) > 0 && (
                                <span className="text-emerald-400 font-mono text-[10px] font-bold">+{recOU.value_gap}</span>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </Card>
    );
}

function DailyParlayCard({ matches }: { matches: any[] }) {
    // Logic: Find top 2 "Diamond Picks" or highest edge matches
    const bestPicks = matches
        .filter(m => {
            const analysis = m.raw_analysis;
            const isDiamond = analysis?.portfolio_strategy?.diamond_pick;
            const edge = m.consensus?.edge_percent || 0;
            return isDiamond || edge > 8; // Filter for quality
        })
        .sort((a, b) => (b.consensus?.edge_percent || 0) - (a.consensus?.edge_percent || 0))
        .slice(0, 2); // Take Top 2

    if (bestPicks.length < 2) return null; // Need at least 2 for a parlay

    const combinedOdds = bestPicks.reduce((acc, curr) => {
        const odds = curr.raw_analysis?.recommendations?.["1x2"]?.market_odds || 1;
        return acc * odds;
    }, 1);

    const stake = 100;
    const potentialReturn = (stake * combinedOdds).toFixed(0);

    return (
        <div className="max-w-4xl mx-auto px-4 mb-10">
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-zinc-900 via-black to-zinc-950 shadow-[0_0_40px_rgba(245,158,11,0.15)] group hover:shadow-[0_0_60px_rgba(245,158,11,0.25)] transition-all duration-500">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-600/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 p-6 md:p-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-amber-500 text-black">
                                    AI Daily Double
                                </span>
                                <span className="text-zinc-400 text-xs font-mono uppercase tracking-wider">
                                    High Value Combo
                                </span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter">
                                TODAY'S <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">SMART PARLAY</span>
                            </h3>
                        </div>

                        {/* Big Odds Display */}
                        <div className="flex items-center gap-4 bg-zinc-900/80 border border-zinc-800 p-3 rounded-xl backdrop-blur-md">
                            <div className="text-right">
                                <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Combined Odds</div>
                                <div className="text-3xl font-black text-amber-500 leading-none">@{combinedOdds.toFixed(2)}</div>
                            </div>
                            <div className="h-8 w-px bg-zinc-700" />
                            <div className="text-right">
                                <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Est. Return ($100)</div>
                                <div className="text-xl font-bold text-white leading-none">${potentialReturn}</div>
                            </div>
                        </div>
                    </div>

                    {/* The Legs */}
                    <div className="grid md:grid-cols-2 gap-4 relative">
                        {/* Connector Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-zinc-900 p-1.5 rounded-full border border-zinc-700 text-zinc-500">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                        </div>

                        {bestPicks.map((pick, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50 hover:bg-zinc-800/60 transition-colors">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                                        <Brain size={10} /> {pick.league}
                                    </div>
                                    <div className="font-bold text-lg text-white">
                                        {pick.home} <span className="text-zinc-600 font-normal text-sm">vs</span> {pick.away}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-xs font-bold text-amber-400">
                                            Bet: {pick.raw_analysis?.recommendations?.["1x2"]?.selection}
                                        </div>
                                        <span className="text-[10px] text-zinc-500">@{pick.raw_analysis?.recommendations?.["1x2"]?.market_odds?.toFixed(2)}</span>
                                    </div>
                                </div>
                                {pick.consensus?.edge_percent > 0 && (
                                    <div className="text-[10px] font-mono text-emerald-500 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900/50">
                                        +{pick.consensus?.edge_percent}% Edge
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
