'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DollarSign, PieChart, TrendingUp, AlertTriangle, Calculator, RefreshCw, Save } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/components/ui/Button';

export default function BankrollPage() {
    const [bankroll, setBankroll] = useState(5000);
    const [riskProfile, setRiskProfile] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');

    const strategies = {
        conservative: { rate: 0.01, label: 'Conservative', desc: '1% per Unit. Capital Preservation.', color: 'bg-blue-500' },
        balanced: { rate: 0.025, label: 'Balanced', desc: '2.5% per Unit. Optimal Growth.', color: 'bg-[var(--brand)]' },
        aggressive: { rate: 0.05, label: 'Aggressive', desc: '5% per Unit. High Volatility.', color: 'bg-red-500' }
    };

    const unitSize = bankroll * strategies[riskProfile].rate;

    return (
        <div className="space-y-8 max-w-5xl">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <DollarSign size={24} className="text-[var(--brand)]" />
                    Bankroll Management
                </h2>
                <p className="text-zinc-400 mt-1">
                    Professional money management calculator based on the Kelly Criterion.
                </p>
            </div>

            {/* Setup Section */}
            <div className="grid md:grid-cols-3 gap-8">
                {/* Input Card */}
                <Card className="p-6 md:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg">Portfolio Configuration</h3>
                        <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white">
                            <RefreshCw size={14} className="mr-2" /> Reset
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Total Starting Capital ($)</label>
                        <div className="relative">
                            <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="number"
                                value={bankroll}
                                onChange={(e) => setBankroll(Number(e.target.value))}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-white font-mono text-lg focus:outline-none focus:border-[var(--brand)] transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-medium text-zinc-400">Risk Strategy</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {(Object.keys(strategies) as Array<keyof typeof strategies>).map((key) => (
                                <button
                                    key={key}
                                    onClick={() => setRiskProfile(key)}
                                    className={cn(
                                        "p-4 rounded-lg border text-left transition-all duration-200 relative overflow-hidden",
                                        riskProfile === key
                                            ? "bg-zinc-800 border-[var(--brand)]"
                                            : "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 opacity-60 hover:opacity-100"
                                    )}
                                >
                                    {riskProfile === key && <div className={`absolute top-0 right-0 p-1 ${strategies[key].color}`} />}
                                    <div className="font-bold text-sm mb-1">{strategies[key].label}</div>
                                    <div className="text-xs text-zinc-500">{strategies[key].desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-800 flex justify-end">
                        <Button variant="accent" className="gap-2">
                            <Save size={16} /> Save Configuration
                        </Button>
                    </div>
                </Card>

                {/* Results Card */}
                <Card className="p-6 bg-[var(--brand)]/5 border-[var(--brand)]/20 relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 text-[var(--brand)] opacity-5">
                        <Calculator size={150} />
                    </div>

                    <h3 className="font-bold text-lg mb-6 text-[var(--brand)]">Recommended Unit</h3>

                    <div className="space-y-8">
                        <div>
                            <div className="text-sm text-zinc-400 mb-1">Single Unit Size (1u)</div>
                            <div className="text-5xl font-black text-white tracking-tighter">
                                ${unitSize.toFixed(2)}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Allocation</span>
                                <span className="font-mono text-white">{(strategies[riskProfile].rate * 100).toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Max Exposure</span>
                                <span className="font-mono text-white">5 Units / Day</span>
                            </div>
                        </div>

                        <div className="p-3 bg-zinc-900/80 rounded border border-zinc-800 flex items-start gap-3">
                            <AlertTriangle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-zinc-400">
                                Never exceed 5 units on a single match day regardless of confidence.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Allocation Guide */}
            <div>
                <h3 className="font-bold text-lg mb-4">Today's Allocation Guide</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <AllocationCard
                        title="Strong Buy (High Conf.)"
                        units="1.5 Units"
                        amount={`$${(unitSize * 1.5).toFixed(2)}`}
                        color="text-green-400"
                    />
                    <AllocationCard
                        title="Standard Play"
                        units="1.0 Unit"
                        amount={`$${unitSize.toFixed(2)}`}
                        color="text-zinc-300"
                    />
                    <AllocationCard
                        title="Speculative / Lotto"
                        units="0.5 Units"
                        amount={`$${(unitSize * 0.5).toFixed(2)}`}
                        color="text-yellow-400"
                    />
                </div>
            </div>
        </div>
    );
}

function AllocationCard({ title, units, amount, color }: any) {
    return (
        <Card className="p-4 border-zinc-800 flex items-center justify-between">
            <div>
                <div className={`font-bold text-sm ${color}`}>{title}</div>
                <div className="text-xs text-zinc-500 mt-1">Recommended Stake</div>
            </div>
            <div className="text-right">
                <div className="font-mono font-bold text-lg">{amount}</div>
                <div className="text-xs text-zinc-500">{units}</div>
            </div>
        </Card>
    );
}
