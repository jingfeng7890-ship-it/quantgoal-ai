'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { BadgeCheck, Lock, Fingerprint, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface Leg {
    match: string;
    selection: string;
    result: string;
}

interface Transaction {
    id: string;
    date: string;
    type: string;
    total_odds?: number | string;
    odds?: number | string;
    stake: number;
    status: string;
    pnl: number;
    legs: Leg[];
    verified_on?: string;
}

export default function LedgerPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    useEffect(() => {
        fetch('/parlay_history.json')
            .then(res => res.json())
            .then(data => {
                // Determine if data is array or object wrapped
                const txs = Array.isArray(data) ? data : [];
                setTransactions(txs.reverse()); // Show newest first
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load ledger", err);
                setLoading(false);
            });
    }, []);

    const toggleRow = (id: string) => {
        if (expandedRow === id) setExpandedRow(null);
        else setExpandedRow(id);
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                    <Fingerprint className="text-zinc-500" /> Immutable Decision Ledger
                </h1>
                <p className="text-zinc-400">
                    Public audit log of all AI decisions. Cryptographically verified on QuantChain.
                </p>
            </div>

            {/* Ledger Table */}
            <Card className="border-zinc-800 bg-zinc-900/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-zinc-950 border-b border-zinc-800 text-xs font-bold uppercase text-zinc-500">
                            <tr>
                                <th className="px-6 py-4">Transaction Hash</th>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Strategy Type</th>
                                <th className="px-6 py-4">Verification</th>
                                <th className="px-6 py-4 text-right">Status</th>
                                <th className="px-6 py-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-zinc-500">Loading Blockchain Data...</td></tr>
                            ) : transactions.map((tx) => (
                                <>
                                    <tr
                                        key={tx.id}
                                        onClick={() => toggleRow(tx.id)}
                                        className={`hover:bg-zinc-800/30 cursor-pointer transition-colors ${expandedRow === tx.id ? 'bg-zinc-800/20' : ''}`}
                                    >
                                        <td className="px-6 py-4 font-mono text-xs text-zinc-400">
                                            {tx.id.substring(0, 16)}...
                                        </td>
                                        <td className="px-6 py-4 text-zinc-300">
                                            {new Date(tx.date).toLocaleDateString()} <span className="text-zinc-600 text-xs">{new Date(tx.date).toLocaleTimeString()}</span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-white">
                                            {tx.type}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-500 bg-emerald-950/30 w-fit px-2 py-1 rounded border border-emerald-900">
                                                <Lock size={10} />
                                                {tx.verified_on || 'QuantChain'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`font-bold px-2 py-1 rounded text-xs uppercase
                                                ${tx.status === 'WON' ? 'bg-emerald-500 text-black' :
                                                    tx.status === 'LOST' ? 'bg-red-900/50 text-red-500' :
                                                        'bg-zinc-800 text-zinc-400'}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500">
                                            {expandedRow === tx.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </td>
                                    </tr>
                                    {/* Expandable Details */}
                                    {expandedRow === tx.id && (
                                        <tr className="bg-zinc-950/50">
                                            <td colSpan={6} className="px-6 py-4">
                                                <div className="ml-8 pl-4 border-l-2 border-zinc-800 space-y-2">
                                                    <div className="text-xs font-bold text-zinc-500 uppercase mb-2">Execution Legs (Smart Contract)</div>
                                                    {tx.legs.map((leg, i) => (
                                                        <div key={i} className="flex justify-between items-center text-sm p-2 rounded hover:bg-zinc-900 border border-transparent hover:border-zinc-800">
                                                            <span className="text-zinc-300">{leg.match}</span>
                                                            <span className="font-mono font-bold text-white">{leg.selection}</span>
                                                            <span className={`text-xs ${leg.result === 'WON' ? 'text-emerald-500' :
                                                                    leg.result === 'LOST' ? 'text-red-500' : 'text-zinc-500'
                                                                }`}>
                                                                {leg.result}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-zinc-800">
                                                        <span className="text-xs text-zinc-500">Total Odds: {tx.total_odds || tx.odds}</span>
                                                        <a href="#" className="flex items-center gap-1 text-[10px] text-blue-500 hover:underline">
                                                            View on Block Explorer <ExternalLink size={10} />
                                                        </a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
