import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function GET() {
    try {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('matches')
            .select('*')
            .order('match_time', { ascending: true });

        if (error) throw error;

        // Transform back to V4 JSON structure if needed by frontend
        const transformed = data.map(m => ({
            id: m.external_id,
            match_info: {
                league: m.league,
                home_team: m.home_team,
                away_team: m.away_team,
                date: m.match_time,
                real_odds: m.odds_data
            },
            quant_analysis: m.quant_analysis,
            models: m.models_data
        }));

        return NextResponse.json(transformed);
    } catch (error) {
        console.error("Matches API Error:", error);
        return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
    }
}
