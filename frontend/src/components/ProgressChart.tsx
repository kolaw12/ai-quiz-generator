"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { day: "Mon", score: 65 },
    { day: "Tue", score: 72 },
    { day: "Wed", score: 68 },
    { day: "Thu", score: 85 },
    { day: "Fri", score: 82 },
    { day: "Sat", score: 90 },
    { day: "Sun", score: 95 }
];

export function ProgressChart() {
    return (
        <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00C9A7" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#00C9A7" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8" }} padding={{ left: 20, right: 20 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8" }} domain={[0, 100]} />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#1e293b", borderRadius: "12px", border: "1px solid #334155" }}
                        itemStyle={{ color: "#F8FAFC", fontWeight: "bold" }}
                        labelStyle={{ color: "#94A3B8" }}
                        cursor={{ stroke: "#475569", strokeWidth: 1, strokeDasharray: "5 5" }}
                    />
                    <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#00C9A7"
                        strokeWidth={4}
                        dot={{ r: 6, fill: "#00C9A7", strokeWidth: 2, stroke: "#0F172A" }}
                        activeDot={{ r: 8, fill: "#6C63FF", strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
