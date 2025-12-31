'use client';

import { Card } from '@/components/ui/Card';
import { Activity, Filter, ArrowUpRight, Zap, Trophy, TrendingUp } from 'lucide-react';
import { SignalTable } from '@/components/dashboard/SignalTable';
import { Button } from '@/components/ui/Button';
import { useWallet } from '@/hooks/useWallet';

export default function LiveSignalsPage() {
    const wallet = useWallet();
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Live Market Signals</h1>
                <p className="text-zinc-400">Real-time alpha detection across all tracked leagues.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-zinc-800 bg-zinc-900/50">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                            <Zap size={20} />
                        </div>
                        <div>
                            <div className="text-sm text-zinc-500 uppercase font-bold tracking-wider">Active Signals</div>
                            <div className="text-3xl font-mono font-bold text-white">24</div>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-zinc-800 bg-zinc-900/50">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-[var(--brand)]/10 flex items-center justify-center text-[var(--brand)]">
                            <Trophy size={20} />
                        </div>
                        <div>
                            <div className="text-sm text-zinc-500 uppercase font-bold tracking-wider">Today's Best</div>
                            <div className="text-3xl font-mono font-bold text-white">+18.5%</div>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-zinc-800 bg-zinc-900/50">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <div className="text-sm text-zinc-500 uppercase font-bold tracking-wider">Avg. Confidence</div>
                            <div className="text-3xl font-mono font-bold text-white">72%</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="active:bg-zinc-800 bg-zinc-800 text-white border-zinc-700">All Markets</Button>
                    <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">Premier League</Button>
                    <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">La Liga</Button>
                    <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">Serie A</Button>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-zinc-800 gap-2">
                        <Filter size={14} /> Filters
                    </Button>
                    <Button variant="outline" size="sm" className="border-zinc-800 gap-2">
                        <ArrowUpRight size={14} /> Export CSV
                    </Button>
                </div>
            </div>

            {/* The Main Table */}
            <Card className="border-zinc-800 bg-zinc-950/50 overflow-hidden min-h-[500px]">
                {/* Reusing the dashboard SignalTable for consistency, but theoretically this page allows for a more complex version */}
                <SignalTable wallet={wallet} />
            </Card>
        </div>
    );
}
