'use client';

import { Brain, TrendingUp, ShieldAlert, Lock, Search, Fingerprint } from 'lucide-react';

export function HowItWorks() {
    const steps = [
        {
            icon: <Brain className="text-purple-400" size={32} />,
            title: "1. The AI Parliament",
            desc: "We don't rely on one opinion. DeepSeek (Tactics), Grok (Value), and Claude (Risk) debate every match. They analyze news, injuries, and 10,000+ data points to form a consensus."
        },
        {
            icon: <TrendingUp className="text-green-400" size={32} />,
            title: "2. Finding the 'Edge' (EV)",
            desc: "We calculate the True Probability vs. Bookmaker Odds. If Real Madrid has an 80% chance to win but is priced like a 60% chance, that's a discount. We only buy discounts."
        },
        {
            icon: <ShieldAlert className="text-amber-400" size={32} />,
            title: "3. Smart Sizing (Kelly)",
            desc: "Never go 'All In'. Our system uses the Kelly Criterion to tell you exactly how much to stake (e.g., $50 vs $200) based on the confidence level to protect your bankroll."
        },
        {
            icon: <Fingerprint className="text-blue-400" size={32} />,
            title: "4. Proof of Integrity",
            desc: "No retroactive editing. Every AI prediction is cryptographically hashed and timestamped before kickoff. You can verify our track record on the blockchain ledger."
        }
    ];

    return (
        <section className="py-24 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        Not Gambling. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Engineering.</span>
                    </h2>
                    <p className="text-zinc-400 text-lg">
                        Most people bet with their hearts. We invest with algorithms.
                        Here is the 4-step process behind every QuantGoal signal.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, idx) => (
                        <div key={idx} className="group p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10 space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    {step.icon}
                                </div>

                                <h3 className="text-xl font-bold text-white group-hover:text-[var(--brand)] transition-colors">
                                    {step.title}
                                </h3>

                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
