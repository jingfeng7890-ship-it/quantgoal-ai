
import React from 'react';
import { RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

export function RadarChart({ stats }: { stats: any }) {
    // Transform flat stats into array for Recharts
    const data = [
        { subject: 'Risk', A: stats.risk, fullMark: 100 },
        { subject: 'Alpha', A: stats.alpha, fullMark: 100 },
        { subject: 'Acc', A: stats.accuracy, fullMark: 100 },
        { subject: 'Rec', A: stats.recovery, fullMark: 100 },
        { subject: 'Cons', A: stats.consist, fullMark: 100 },
    ];

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid stroke="#3f3f46" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                    name="Model Stats"
                    dataKey="A"
                    stroke="#eab308"
                    strokeWidth={2}
                    fill="#eab308"
                    fillOpacity={0.3}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff' }}
                    itemStyle={{ color: '#eab308' }}
                />
            </RechartsRadarChart>
        </ResponsiveContainer>
    );
}
