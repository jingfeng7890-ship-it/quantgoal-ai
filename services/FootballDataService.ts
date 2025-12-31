export interface MatchData {
    id: string;
    home: string;
    away: string;
    time: string;
    league: string;
    status: 'SCHEDULED' | 'LIVE' | 'FINISHED';
    score: { home: number, away: number };
    odds?: { home: number, draw: number, away: number };
    consensus?: any;
    models?: any[];
    raw_analysis?: any;
}

// MOCK DATA PROVIDER
const MOCK_PROVIDER = {
    getMatches: async (): Promise<MatchData[]> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        return [
            {
                id: 'm1', home: 'Arsenal', away: 'Liverpool', time: '12:30', league: 'EPL', status: 'SCHEDULED',
                score: { home: 0, away: 0 }, odds: { home: 2.45, draw: 3.40, away: 2.90 },
                consensus: { prediction: 'Home Win', confidence: 78, signal: 'Strong Buy', edge_percent: 12.5 },
                models: [{ name: 'DeepSeek V3', logic: 'High pressure on backline detected.' }]
            },
            {
                id: 'm2', home: 'Real Madrid', away: 'Barcelona', time: '20:00', league: 'La Liga', status: 'SCHEDULED',
                score: { home: 0, away: 0 }, odds: { home: 2.15, draw: 3.60, away: 3.10 },
                consensus: { prediction: 'Draw', confidence: 60, signal: 'Hold', edge_percent: 2.1 },
                models: [{ name: 'DeepSeek V3', logic: 'Midfield battle likely to stalemate.' }]
            },
            {
                id: 'm3', home: 'Bayern', away: 'Dortmund', time: '18:30', league: 'Bundesliga', status: 'LIVE',
                score: { home: 2, away: 1 }, odds: { home: 1.55, draw: 4.50, away: 5.50 }
            },
            {
                id: 'm4', home: 'Inter', away: 'Juventus', time: '20:45', league: 'Serie A', status: 'SCHEDULED',
                score: { home: 0, away: 0 }, odds: { home: 2.25, draw: 3.10, away: 3.40 }
            }
        ];
    }
};

// JSON FEED PROVIDER (Current Logic)
const JSON_PROVIDER = {
    getMatches: async (): Promise<MatchData[]> => {
        try {
            const res = await fetch('/matches_data_v4.json');
            const data = await res.json();
            return data.map((item: any, index: number) => {
                const matchDate = new Date(item.match_info.date);
                const today = new Date();
                const isToday = matchDate.getDate() === today.getDate() && matchDate.getMonth() === today.getMonth();

                const timeStr = matchDate.toLocaleTimeString('en-US', {
                    hour: '2-digit', minute: '2-digit', hour12: false
                });

                // Parse V4 Data
                const analysis = item.quant_analysis;
                const rec1x2 = analysis.recommendations["1x2"];
                const strategy = analysis.portfolio_strategy;
                const edgeVal = parseFloat(rec1x2.value_gap.replace('%', ''));

                return {
                    id: index.toString(),
                    league: item.match_info.league,
                    home: item.match_info.home_team,
                    away: item.match_info.away_team,
                    time: `${timeStr} ${isToday ? 'Today' : 'Tomorrow'}`,
                    status: 'SCHEDULED', // Default to Scheduled for feed
                    score: { home: 0, away: 0 },
                    // Map odds from feed or default
                    odds: {
                        home: item.odds?.home_win || 2.0,
                        draw: item.odds?.draw || 3.0,
                        away: item.odds?.away_win || 2.0
                    },
                    // Consensus & Models mapped for Arena
                    consensus: {
                        prediction: rec1x2.selection,
                        confidence: rec1x2.confidence * 10,
                        signal: strategy.diamond_pick ? 'High Alpha Alert' : 'Strong Buy',
                        edge_percent: edgeVal,
                        kelly_stake: `${strategy.kelly_signal}u`,
                    },
                    models: [{ name: 'DeepSeek V3', logic: analysis.match_analysis.causal_chain }],
                    raw_analysis: analysis
                };
            });
        } catch (e) {
            console.error("Failed to fetch JSON Feed, falling back to Mock");
            return MOCK_PROVIDER.getMatches();
        }
    }
}

export const FootballDataService = {
    getMatches: async (): Promise<MatchData[]> => {
        const mode = process.env.NEXT_PUBLIC_API_MODE;
        /*
        if (mode === 'LIVE') {
            return LIVE_PROVIDER.getMatches(); // Future Ext
        }
        */
        // Default to JSON Feed (The "Real" Simulation)
        return JSON_PROVIDER.getMatches();
    }
};
