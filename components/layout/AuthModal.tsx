'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { X, Mail, Chrome, Apple } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const { loginWithGoogle, loginWithApple, loginWithEmail, registerWithEmail, loginWithDemo } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            setError('');
            await loginWithGoogle();
        } catch (e: any) {
            setError(e.message);
            setLoading(false);
        }
    };

    const handleAppleLogin = async () => {
        try {
            setLoading(true);
            setError('');
            await loginWithApple();
        } catch (e: any) {
            setError(e.message);
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        try {
            setLoading(true);
            setError('');
            if (isLogin) {
                await loginWithEmail(email, password);
            } else {
                await registerWithEmail(email, password);
            }
            onClose();
        } catch (e: any) {
            // Simple error handling
            if (e.code === 'auth/invalid-credential') setError('Invalid email or password.');
            else if (e.code === 'auth/email-already-in-use') setError('Email already registered.');
            else setError(e.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-6 sm:p-8 animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {isLogin ? 'Welcome Back' : 'Join QuantGoal'}
                    </h2>
                    <p className="text-zinc-400 text-sm">
                        {isLogin
                            ? 'Login to access your AI investment signals'
                            : 'Create an account to start investing with probability'
                        }
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <Button
                        variant="outline"
                        className="h-12 bg-white text-black hover:bg-zinc-200 border-transparent font-semibold gap-2"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        <Chrome size={20} />
                        Google
                    </Button>

                    <Button
                        variant="ghost"
                        className="h-12 bg-zinc-950 text-white hover:bg-zinc-800 border-zinc-800 font-semibold gap-2"
                        onClick={handleAppleLogin}
                        disabled={loading}
                    >
                        <Apple size={20} />
                        Apple
                    </Button>
                </div>

                <div className="space-y-4">

                    <Button
                        variant="ghost"
                        className="w-full h-10 text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-900 gap-2 mb-2"
                        onClick={() => {
                            if (loginWithDemo) loginWithDemo();
                            onClose();
                        }}
                    >
                        <Mail size={16} />
                        Try Demo Account (No Login)
                    </Button>

                    <div className="relative flex items-center gap-4 py-2">
                        <div className="h-px bg-zinc-800 flex-1" />
                        <span className="text-xs text-zinc-500 uppercase">Or continue with email</span>
                        <div className="h-px bg-zinc-800 flex-1" />
                    </div>

                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-zinc-400 ml-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-11 bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all placeholder:text-zinc-600"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-zinc-400 ml-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-11 bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-all placeholder:text-zinc-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-xs text-center bg-red-500/10 py-2 rounded">
                                {error}
                            </div>
                        )}

                        <Button
                            variant="accent"
                            className="w-full h-12 font-bold mt-2"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account')}
                        </Button>
                    </form>

                    <div className="text-center mt-6">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm text-zinc-500 hover:text-[var(--brand)] transition-colors"
                        >
                            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
