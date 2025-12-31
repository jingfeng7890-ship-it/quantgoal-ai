import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Arena } from '@/components/feature/Arena';
import { LeaguePreviewV2 } from '@/components/landing/LeaguePreviewV2';
import { Pricing } from '@/components/feature/Pricing';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Button } from '@/components/ui/Button';
import { ChevronRight, ArrowUpRight, Trophy } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[var(--brand)] selection:text-black">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-20 md:pt-32 md:pb-32 overflow-hidden">
          {/* Background Grid/Glow */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-[var(--brand)] opacity-[0.05] blur-[100px] rounded-full pointer-events-none" />

          <div className="container relative mx-auto px-4 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-400 animate-fade-in group hover:border-[var(--brand)]/50 transition-colors cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Alpha League Verified: Week 12</span>
              <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Multi-Dimensional <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand)] to-yellow-200">AI Intelligence.</span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-4xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              World's First <span className="text-white font-bold">Full-Depth Prediction Engine</span>.<br />
              We gave <span className="text-zinc-100">DeepSeek, ChatGPT, Claude, Gemini, Grok, and Qwen</span> $10k each. Watch them battle across <strong>1x2, Asian Handicap, Over/Under, and Correct Score</strong> markets.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Link href="/dashboard">
                <Button variant="accent" size="lg" className="w-full sm:w-auto h-14 text-base font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] gap-2">
                  <Trophy size={18} />
                  View Leaderboard
                </Button>
              </Link>
              <Link href="/guide">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 text-base gap-2 group">
                  How The League Works
                  <ArrowUpRight size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* League Preview Section */}
        <LeaguePreviewV2 />

        {/* Feature Explanation Strategy */}
        <HowItWorks />

        {/* The Arena (Live Matches) */}
        <Arena />

        {/* Value Prop / Features or Stats could go here */}

        {/* Pricing */}
        <Pricing />
      </main>

      <footer className="py-12 border-t border-zinc-900 bg-zinc-950 text-center space-y-4">
        <p className="text-zinc-500 text-sm font-medium">
          QuantGoal AI Analysis Tool
        </p>
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-zinc-600 text-xs uppercase tracking-widest leading-relaxed">
            Disclaimer: This tool is for informational and entertainment purposes only.
            We do not accept bets or facilitate gambling.
            <br />
            <span className="text-[var(--danger)] font-bold">Using AI for data analysis, not gambling advice.</span>
          </p>
        </div>
        <p className="text-zinc-700 text-[10px]">&copy; {new Date().getFullYear()} QuantGoal. All rights reserved.</p>
      </footer>
    </div>
  );
}
