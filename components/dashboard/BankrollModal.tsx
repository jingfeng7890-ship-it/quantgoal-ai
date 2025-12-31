import { X, RefreshCw, PlusCircle, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface BankrollModalProps {
    isOpen: boolean;
    onClose: () => void;
    wallet: any;
}

export function BankrollModal({ isOpen, onClose, wallet }: BankrollModalProps) {
    if (!isOpen) return null;

    const handleTopUp = (amount: number) => {
        wallet.earn(amount, "Simulated Deposit: Liquidity Injection");
        onClose();
        alert(`Successfully added $${amount.toLocaleString()} to bankroll.`);
    };

    const handleReset = () => {
        if (confirm("Are you sure? This will wipe your history and reset balance to $5,000.")) {
            wallet.reset();
            onClose();
            alert("Bankroll reset to initial state.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl relative overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/50">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        Bankroll Manager
                    </h3>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Section 1: Inject Liquidity */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 uppercase tracking-wider">
                            <PlusCircle size={16} /> Inject Liquidity
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleTopUp(1000)}
                                className="py-3 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/50 rounded-lg text-white font-mono font-bold transition-all flex flex-col items-center gap-1 group"
                            >
                                <span className="text-lg group-hover:text-emerald-400">+$1,000</span>
                                <span className="text-[10px] text-zinc-500 uppercase">Standard Top-up</span>
                            </button>
                            <button
                                onClick={() => handleTopUp(10000)}
                                className="py-3 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-purple-500/50 rounded-lg text-white font-mono font-bold transition-all flex flex-col items-center gap-1 group"
                            >
                                <span className="text-lg group-hover:text-purple-400">+$10,000</span>
                                <span className="text-[10px] text-zinc-500 uppercase">Whale Injection</span>
                            </button>
                        </div>
                    </div>

                    <div className="h-px bg-zinc-900" />

                    {/* Section 2: Reset Protocol */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-red-400 uppercase tracking-wider">
                            <AlertTriangle size={16} /> Danger Zone
                        </div>
                        <div className="p-4 bg-red-950/10 border border-red-900/30 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-white">Reset Protocol</span>
                                <span className="text-[10px] text-red-500 font-mono bg-red-950/30 px-2 py-0.5 rounded">IRREVERSIBLE</span>
                            </div>
                            <p className="text-xs text-zinc-500 mb-4">
                                Wipes all transaction history and resets bankroll to initial $5,000 state. Use this to restart your simulation.
                            </p>
                            <button
                                onClick={handleReset}
                                className="w-full py-2 bg-red-950/30 hover:bg-red-900/50 border border-red-900/50 text-red-400 hover:text-red-300 rounded font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all"
                            >
                                <RefreshCw size={14} /> Reset System
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
