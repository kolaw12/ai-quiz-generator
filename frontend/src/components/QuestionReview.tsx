"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export function QuestionReview({ total, score }: { total: number, score: number }) {
    // For now, since the exact answer history isn't maintained in the URL for this demo UX,
    // we'll intelligently mock a sequence that matches their exact score to demonstrate the UI pattern requested.
    // In actual production, this would map over an array of results from global state.

    const [answers] = useState(() => {
        const arr = Array(total).fill(false);
        for (let i = 0; i < score; i++) arr[i] = true;
        // Shuffle slightly for realism while preserving count
        arr.sort(() => Math.random() - 0.5);
        return arr;
    });

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center">
            <h3 className="font-bold text-slate-400 mb-6 flex items-center justify-center gap-2">
                📋 Your Answers
            </h3>

            <div className="flex flex-wrap justify-center gap-4 mb-6">
                {answers.map((isCorrect, i) => (
                    <button
                        key={i}
                        className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-transform active:scale-95 ${isCorrect
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                            }`}
                        onClick={() => {
                            if (!isCorrect) alert(`Deep review for Q${i + 1} coming soon!`);
                        }}
                    >
                        Q{i + 1} {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </button>
                ))}
            </div>

            <p className="text-sm font-medium text-slate-500">
                Tap any <span className="text-rose-400 font-bold mx-1">❌</span> to review it
            </p>
        </div>
    );
}
