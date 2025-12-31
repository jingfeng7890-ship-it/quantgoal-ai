'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Terminal, Lock, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/layout/AuthModal';

export function Header() {
    const { user, logout, isPro } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-[var(--brand)] text-black">
                            <Terminal size={20} className="font-bold" />
                        </div>
                        <Link href="/" className="flex flex-col leading-none">
                            <span className="text-lg font-bold tracking-tight text-white">QuantGoal</span>
                            <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Don't Bet. Invest.</span>
                        </Link>
                    </div>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="#arena" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                            The Arena
                        </Link>
                        <Link href="#models" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                            AI Models
                        </Link>
                        <Link href="#pricing" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                            Pricing
                        </Link>
                        <a
                            href="https://www.mysticseek.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs font-mono text-purple-400/70 hover:text-purple-400 transition-colors uppercase tracking-widest border border-purple-900/30 px-2 py-1 rounded bg-purple-900/10 hover:bg-purple-900/20 scroll-smooth"
                        >
                            🔮 Luck Cal.
                        </a>
                    </nav>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                <div className="flex items-center gap-2 text-sm text-zinc-300 mr-2 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800">
                                    <UserIcon size={14} className="text-[var(--brand)]" />
                                    <span className="hidden sm:inline font-mono text-xs">
                                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                    </span>
                                    {isPro && <span className="px-1.5 py-0.5 bg-[var(--brand)] text-black text-[9px] font-bold rounded uppercase">Pro</span>}
                                </div>

                                <Link href="/dashboard">
                                    <Button variant="outline" size="sm" className="hidden sm:inline-flex border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                                        Dashboard
                                    </Button>
                                </Link>

                                <Button variant="ghost" size="sm" onClick={logout} className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10" title="Log Out">
                                    <LogOut size={16} />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" size="sm" onClick={() => setShowAuthModal(true)} className="hidden sm:inline-flex text-zinc-400 hover:text-white">
                                    Log In
                                </Button>

                                <Button variant="accent" size="sm" onClick={() => setShowAuthModal(true)} className="gap-2 shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] transition-shadow">
                                    <Lock size={14} />
                                    <span>Go Pro</span>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </>
    );
}
