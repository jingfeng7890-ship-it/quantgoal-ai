'use client';

import { ChampionLeague } from '@/components/feature/ChampionLeague';

export function LeaguePreviewV2() {
    return (
        <section className="py-24 bg-zinc-950 border-b border-zinc-900" id="models">
            <div className="container mx-auto px-4 max-w-5xl">
                <ChampionLeague />
            </div>
        </section>
    );
}
