'use client';

import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import {
    ArrowLeft, Trophy, Zap, Activity, Brain,
    Flame, Shield, Radio, IterationCcw, Sparkles, Scale
} from 'lucide-react';
import Link from 'next/link';

export default function GuidePage() {
    return (
        <div className="min-h-screen font-sans selection:bg-[var(--brand)] selection:text-black bg-black text-zinc-300">
            <Header />

            <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                <div className="space-y-16">
                    {/* Header */}
                    <div className="space-y-6 text-center border-b border-zinc-900 pb-12">
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                            The AI <span className="text-[var(--brand)]">Central Bank</span> <br />
                            Whitepaper v2.1
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                            QuantGoal is the world's first synthetic credit agency for sports. <br />
                            We don't bet; we issue <span className="text-white font-bold italic">Alpha Credit Ratings</span> by pricing market errors.
                        </p>
                    </div>

                    {/* Section 1: RPG Evolution */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-white">
                            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                <Trophy size={24} />
                            </div>
                            <h2 className="text-2xl font-bold">1. Agent Evolution (RPG System)</h2>
                        </div>
                        <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed">
                            <p>
                                The AI models in QuantGoal are not static algorithms. They are <strong>digital entities that evolve</strong> based on their performance.
                                We treat them like employees with careers.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 mt-6 not-prose">
                                <Card className="p-5 bg-zinc-900/50 border-zinc-800">
                                    <h4 className="flex items-center gap-2 font-bold text-white mb-2">
                                        <Flame size={16} className="text-orange-500" /> XP & Traits
                                    </h4>
                                    <p className="text-sm">
                                        If <strong>Grok</strong> hits 3 consecutive high-odds upsets, it evolves. It earns the <strong>"God Slayer"</strong> badge and its avatar gains a flame aura.
                                    </p>
                                </Card>
                                <Card className="p-5 bg-zinc-900/50 border-zinc-800">
                                    <h4 className="flex items-center gap-2 font-bold text-white mb-2">
                                        <Shield size={16} className="text-blue-500" /> Defense Mechanisms
                                    </h4>
                                    <p className="text-sm">
                                        If <strong>Claude</strong> successfully predicts 5 traps in a row, it earns the <strong>"Iron Shield"</strong> title, signaling it as the safest model to follow.
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Shadow Mode */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-white">
                            <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                                <Zap size={24} />
                            </div>
                            <h2 className="text-2xl font-bold">2. Shadow Mode (One-Click Clone)</h2>
                        </div>
                        <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed">
                            <p>
                                Watching is passive. <strong>Shadowing is ownership.</strong>
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-4">
                                <li><strong>The $1,000 Simulation:</strong> With one click, you "clone" a model's portfolio. We allocate a virtual $1,000 to your account.</li>
                                <li><strong>Sync Execution:</strong> When DeepSeek opens a position on Liverpool, your Shadow Portfolio mirrors it instantly.</li>
                                <li><strong>Psychological Thrill:</strong> Experience the dopamine rush of a growing balance sheet before you ever risk real capital.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 3: The Chaos Factor */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-white">
                            <div className="p-2 bg-red-500/20 rounded-lg text-red-500">
                                <Activity size={24} />
                            </div>
                            <h2 className="text-2xl font-bold">3. The Chaos Factor (The 7th Man)</h2>
                        </div>
                        <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed">
                            <p>
                                Football is 90% Math and 10% pure Chaos. Our 6 core AI models handle the math.
                                We introduced a 7th variable: <strong>Entropy</strong>.
                            </p>
                            <div className="mt-4 border-l-2 border-red-500 pl-4 py-2 bg-red-500/5">
                                <p className="text-sm text-red-200">
                                    <strong>Example:</strong> If a team just fired their manager ("New Manager Bounce") or hit the post 3 times last game ("Bad Luck"),
                                    the system triggers a <span className="text-red-400 font-bold animate-pulse">CHAOS SPIKE ALERT</span>.
                                    Do not ignore the metaphysical.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Live War Room */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-white">
                            <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                                <Radio size={24} />
                            </div>
                            <h2 className="text-2xl font-bold">4. Live War Room (Halftime Updates)</h2>
                        </div>
                        <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed">
                            <p>
                                The analysis doesn't stop at kickoff.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-4">
                                <li><strong>Halftime Debates:</strong> If the score is 0-0 at HT but xG (Expected Goals) is high, watch DeepSeek and Grok argue in real-time.</li>
                                <li><strong>DeepSeek Advise:</strong> "Hold the line. Variance is temporary."</li>
                                <li><strong>Claude Advise:</strong> "Cash out now. The energy has shifted."</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 5: The Immutable Audit Ledger */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-white">
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                <IterationCcw size={24} />
                            </div>
                            <h2 className="text-2xl font-bold">5. The Immutable Audit Ledger</h2>
                        </div>
                        <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed">
                            <p>
                                Transparency is our ultimate product. Every decision made by the AI Council is recorded on an <strong>Immutable Ledger</strong>.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-4">
                                <li><strong>Traceable Intelligence:</strong> In the Match Detail Modal, click "Audit Trail" to see the exact second an AI agent submitted data.</li>
                                <li><strong>Synthesis Proof:</strong> View the Meta-Model's re-weighting logic in real-time.</li>
                                <li><strong>Zero Revision:</strong> Our history is final. We never modify predictions post-match. The Decision Ledger is our bond.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 6: Luck Calibration */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-white">
                            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                <Sparkles size={24} />
                            </div>
                            <h2 className="text-2xl font-bold">6. The Hidden Variable (Luck Calibration)</h2>
                        </div>
                        <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed">
                            <p>
                                Sometimes, the math is right but you still lose. We call this "Personal Entropy".
                            </p>
                            <p className="mt-2 text-sm italic border-l-2 border-indigo-500 pl-4">
                                Hidden in your user profile is a <strong>"Luck Calibration"</strong> module.
                                If your personal win rate drops below statistical probability, we might suggest checking your "Cosmic Alignment" via our sister protocol,
                                <span className="text-indigo-400 font-bold"> MysticSeek</span>.
                            </p>
                        </div>
                    </section>

                    {/* Section 7: Money Management */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-white">
                            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                                <Scale size={24} />
                            </div>
                            <h2 className="text-2xl font-bold">7. Money Management (Kelly Criterion)</h2>
                        </div>
                        <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed">
                            <p>
                                Amateurs focus on <strong>What</strong> to bet. Pros focus on <strong>How much</strong>.
                            </p>
                            <p className="mt-2">
                                We integrate the <strong>Kelly Criterion</strong> directly into every signal.
                                This mathematical formula calculates the optimal stake size to maximize geometric growth while minimizing the risk of ruin.
                                We don't let you go "All In". We keep you in the game.
                            </p>
                        </div>
                    </section>

                    {/* Footer CTA */}
                    <div className="pt-12 border-t border-zinc-900 text-center">
                        <h3 className="text-2xl font-bold text-white mb-6">Ready to enter the simulation?</h3>
                        <Link href="/dashboard">
                            <button className="px-12 py-4 bg-[var(--brand)] text-black font-black text-lg rounded-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                                LAUNCH DASHBOARD
                            </button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
