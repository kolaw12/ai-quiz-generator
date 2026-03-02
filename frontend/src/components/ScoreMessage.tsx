"use client";

import { getScoreMessage } from "@/lib/messages";

export function ScoreMessage({ score, total }: { score: number, total: number }) {
    const percentage = total > 0 ? (score / total) * 100 : 0;
    const msg = getScoreMessage(percentage);

    return (
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 text-center shadow-xl">
            <div className="text-6xl mb-4">{msg.icon}</div>

            <div className="flex justify-center items-end gap-2 mb-6">
                <span className="text-6xl font-black font-jakarta text-white">{score}</span>
                <span className="text-2xl font-bold text-slate-500 mb-1">/ {total}</span>
            </div>

            <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden mb-6">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ${percentage >= 70 ? 'bg-emerald-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2 font-jakarta">{msg.title}</h2>
            <p className="text-slate-400 font-medium leading-relaxed">{msg.desc}</p>

            <div className="mt-6 inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-xl font-bold border border-indigo-500/20">
                ✨ +{score * 10} XP earned
            </div>
        </div>
    );
}
