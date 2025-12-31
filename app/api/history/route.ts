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
        // Fetch raw data from Supabase
        const supabase = getSupabase();
        const { data: rawData, error } = await supabase
            .from('parlay_tickets')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase Scan Error:", error);
            return NextResponse.json({ history: [] });
        }

        // Aggregate by Date for the Dashboard (Logic preserved)
        const aggregation: { [key: string]: { date: string, bets_placed: number, total_pnl: number } } = {};

        rawData?.forEach((bet: any) => {
            // Extract YYYY-MM-DD
            const dateStr = bet.date;

            if (!aggregation[dateStr]) {
                aggregation[dateStr] = { date: dateStr, bets_placed: 0, total_pnl: 0 };
            }

            aggregation[dateStr].bets_placed += 1;
            aggregation[dateStr].total_pnl += (Number(bet.pnl) || 0);
        });

        const history = Object.values(aggregation).sort((a, b) => b.date.localeCompare(a.date));

        return NextResponse.json({ history, raw: rawData });
    } catch (error) {
        console.error("History API Error:", error);
        return NextResponse.json({ history: [] });
    }
}

export async function POST(request: Request) {
    try {
        const parlay = await request.json();

        // Create new entry
        const newEntry = {
            ticket_id: `tx_usr_${Math.random().toString(16).substr(2, 6)}`,
            date: new Date().toISOString().split('T')[0],
            type: `${parlay.legs.length}-Fold Parlay`,
            legs: parlay.legs.map((leg: any) => ({
                match: leg.fullMatch || leg.team,
                selection: leg.market === 'Moneyline' ? leg.team : leg.selection || leg.market,
                result: "Pending"
            })),
            total_odds: parlay.odds,
            stake: parlay.stake || 100,
            status: "PENDING",
            pnl: 0,
            roi: "0%",
            verified_on: "User Action"
        };

        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('parlay_tickets')
            .insert(newEntry)
            .select();

        if (error) throw error;

        return NextResponse.json({ success: true, entry: data[0] });

    } catch (error) {
        console.error('Failed to save parlay:', error);
        return NextResponse.json({ success: false, error: 'Failed to save parlay' }, { status: 500 });
    }
}
