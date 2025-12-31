'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const PLANS = [
    {
        name: 'Monthly Pro',
        price: '$29.90',
        frequency: '/month',
        desc: 'Better value than ChatGPT Plus.',
        features: [
            'Unlock All 6 Models',
            'Consensus Signals (High Accuracy)',
            'Real-time Odds Analysis',
            'Priority Support'
        ],
        cta: 'Start Investing',
        highlight: false
    },
    {
        name: 'Season Pass',
        price: '$79.90',
        frequency: '/quarter',
        desc: 'Lock in for the season. Save 20%.',
        features: [
            'Everything in Monthly',
            '3-Month Access',
            'Exclusive "Whale" Signals',
            'Bankroll Management Tools'
        ],
        cta: 'Get Season Pass',
        highlight: true
    },
    {
        name: 'Tournament Pass',
        price: '$49.90',
        frequency: 'one-time',
        desc: 'For the 2026 World Cup only.',
        features: [
            'World Cup 2026 Exclusive',
            'Group Stage to Finals',
            'Fun/Casual Metrics',
            'No Recurring Billing'
        ],
        cta: 'Pre-order 2026',
        highlight: false
    }
];

import { useWallet } from '@/hooks/useWallet';

// ... (PLANS array remains same) ...

export function Pricing() {
    const { user, isPro, upgradeToPro } = useAuth();
    const wallet = useWallet();
    const [chaosIndex, setChaosIndex] = useState(65);

    useEffect(() => {
        // Subtle drift for chaos index
        const timer = setInterval(() => {
            setChaosIndex((prev: number) => {
                const delta = Math.floor(Math.random() * 5) - 2;
                return Math.min(100, Math.max(0, prev + delta));
            });
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleUpgrade = () => {
        if (!user) {
            alert("Please log in first to upgrade.");
            return;
        }
        // Simulate payment process
        if (confirm("DEMO: Simulate Stripe Payment of $29.90?")) {
            upgradeToPro();
            alert("Payment Successful! You are now a Pro member.");
        }
    };

    const handlePurchaseCoins = (amount: number, price: string) => {
        if (confirm(`DEMO: Purchase ${amount} Coins for ${price}?`)) {
            wallet.earn(amount, `Coin Pack: ${amount} Units`);
            alert("Transaction Successful! Coins added to wallet.");
        }
    };

    const handleBuyOption = (name: string, cost: number) => {
        if (wallet.balance < cost) {
            alert("Insufficient Funds: Top up in the Coin Store.");
            return;
        }
        if (confirm(`Execute Strategic Hedge: Buy ${name} for ${cost} Coins?`)) {
            wallet.spend(cost, `Hedge: ${name}`);
            alert(`Hedge Activated! ${name} is now protecting your active positions.`);
        }
    };

    return (
        <section id="pricing" className="py-24 px-4 bg-zinc-950/30">
            <div className="max-w-5xl mx-auto space-y-16">

                {/* SUBSCRIPTIONS */}
                <div className="space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold">Invest in Probability</h2>
                        <p className="text-zinc-400">Stop guessing. Let the algorithms work for you.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {PLANS.map((plan) => (
                            <Card
                                key={plan.name}
                                className={`flex flex-col p-8 ${plan.highlight ? 'border-[var(--brand)] bg-zinc-900/40 relative' : 'bg-transparent border-zinc-800'}`}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--brand)] text-black text-xs font-bold rounded-full uppercase tracking-wider">
                                        Best Value
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className="font-bold text-lg text-zinc-300">{plan.name}</h3>
                                    <div className="mt-2 flex items-baseline gap-1">
                                        <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                                        <span className="text-sm text-zinc-500">{plan.frequency}</span>
                                    </div>
                                    <p className="mt-2 text-sm text-zinc-400">{plan.desc}</p>
                                </div>

                                <div className="flex-1 space-y-4 mb-6">
                                    {plan.features.map((feature) => (
                                        <div key={feature} className="flex items-center gap-3 text-sm">
                                            <div className={`flex h-5 w-5 items-center justify-center rounded-full ${plan.highlight ? 'bg-[var(--brand)] text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                                                <Check size={10} strokeWidth={4} />
                                            </div>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    variant={plan.highlight ? 'accent' : 'outline'}
                                    className="w-full"
                                    onClick={handleUpgrade}
                                    disabled={isPro}
                                >
                                    {isPro ? 'Plan Active' : plan.cta}
                                </Button>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* BLACK SWAN OPTIONS */}
                <div className="border-t border-zinc-800 pt-16">
                    <div className="text-center space-y-4 mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-500 uppercase tracking-widest animate-pulse">
                            Live Chaos Monitor
                        </div>
                        <h2 className="text-3xl font-black text-white">Black Swan Defense Market</h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto">
                            The higher the Chaos Index, the more "Black Swans" occur.
                            Buy low-cost protection to hedge against algorithmic anomalies.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-4 gap-6">
                        {/* Index Card */}
                        <Card className="lg:col-span-1 p-6 bg-zinc-900/50 border-zinc-800 flex flex-col justify-center items-center">
                            <div className="text-[10px] font-mono text-zinc-500 mb-2">ENTROPY_INDEX</div>
                            <div className="text-6xl font-black text-red-500 tracking-tighter">{chaosIndex}</div>
                            <div className="mt-4 w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-red-600 transition-all duration-1000" style={{ width: `${chaosIndex}%` }}></div>
                            </div>
                            <p className="mt-4 text-[10px] text-zinc-500 text-center leading-tight">
                                Volatility risk is currently <span className={chaosIndex > 70 ? 'text-red-400' : 'text-emerald-400'}>{chaosIndex > 70 ? 'CRITICAL' : 'MODERATE'}</span>.
                            </p>
                        </Card>

                        {/* Options Grid */}
                        <div className="lg:col-span-3 grid md:grid-cols-3 gap-4">
                            {[
                                { name: "Tail Risk Shield", price: 250, desc: "Protects against 90min+ upsets.", icon: "🛡️" },
                                { name: "Referee Anomaly Hub", price: 500, desc: "Hedge against VAR & Red Cards.", icon: "🚩" },
                                { name: "The 'Governor's Box'", price: 1200, desc: "Global protection for all active plays.", icon: "🏛️" },
                            ].map((option) => (
                                <Card key={option.name} className="p-5 bg-zinc-900/20 border-zinc-800 hover:border-red-500/30 transition-all group">
                                    <div className="text-2xl mb-3">{option.icon}</div>
                                    <h4 className="font-bold text-white mb-1">{option.name}</h4>
                                    <p className="text-xs text-zinc-500 mb-6">{option.desc}</p>
                                    <button
                                        onClick={() => handleBuyOption(option.name, option.price)}
                                        className="w-full py-2 rounded bg-zinc-800 text-[10px] font-bold text-zinc-300 hover:bg-red-600 hover:text-white transition-colors"
                                    >
                                        BUY OPTION: {option.price} COINS
                                    </button>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* COIN STORE */}
                <div className="border-t border-zinc-800 pt-16">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                            Virtual Coin Store
                        </h2>
                        <p className="text-zinc-400">Top up your betting bankroll for simulation.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <Card className="p-6 border-zinc-800 flex flex-col items-center text-center hover:border-emerald-500/50 transition-colors group cursor-pointer" onClick={() => handlePurchaseCoins(1000, '$0.99')}>
                            <div className="w-16 h-16 rounded-full bg-emerald-900/20 flex items-center justify-center mb-4 text-emerald-500 group-hover:scale-110 transition-transform">
                                <span className="font-bold text-xl">1K</span>
                            </div>
                            <h3 className="font-bold text-white mb-1">Starter Pack</h3>
                            <p className="text-xs text-zinc-500 mb-4">1,000 Coins</p>
                            <Button variant="outline" className="w-full border-zinc-700 bg-zinc-900 text-white hover:bg-emerald-600 hover:text-white hover:border-emerald-500">$0.99</Button>
                        </Card>

                        <Card className="p-6 border-emerald-500/30 bg-emerald-900/5 flex flex-col items-center text-center relative overflow-hidden group cursor-pointer" onClick={() => handlePurchaseCoins(5000, '$3.99')}>
                            <div className="absolute top-0 right-0 px-2 py-1 bg-emerald-600 text-[10px] font-bold text-black rounded-bl">POPULAR</div>
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
                                <span className="font-bold text-xl">5K</span>
                            </div>
                            <h3 className="font-bold text-white mb-1">Trader Pack</h3>
                            <p className="text-xs text-zinc-400 mb-4">5,000 Coins</p>
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-bold border-0">$3.99</Button>
                        </Card>

                        <Card className="p-6 border-zinc-800 flex flex-col items-center text-center hover:border-amber-500/50 transition-colors group cursor-pointer" onClick={() => handlePurchaseCoins(15000, '$9.99')}>
                            <div className="w-16 h-16 rounded-full bg-amber-900/20 flex items-center justify-center mb-4 text-amber-500 group-hover:scale-110 transition-transform">
                                <span className="font-bold text-xl">15K</span>
                            </div>
                            <h3 className="font-bold text-white mb-1">Whale Pack</h3>
                            <p className="text-xs text-zinc-500 mb-4">15,000 Coins</p>
                            <Button variant="outline" className="w-full border-zinc-700 bg-zinc-900 text-white hover:bg-amber-600 hover:text-black hover:border-amber-500">$9.99</Button>
                        </Card>
                    </div>
                </div>

            </div>
        </section>
    );
}
