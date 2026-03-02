"use client";

import { useState } from "react";
import { Zap } from "lucide-react";

export function QuestionOfDay() {
    const [answered, setAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const options = ["Mitochondria", "Chloroplast", "Nucleus", "Ribosome"];

    const handleAnswer = (option: string) => {
        if (answered) return;
        setAnswered(true);
        setIsCorrect(option === "Chloroplast");
    };

    return (
        <div className="glass-card p-0 overflow-hidden relative border-secondary-500/30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-500/10 rounded-bl-full pointer-events-none" />

            <div className="bg-gradient-to-r from-secondary-500/20 to-transparent p-4 flex items-center justify-between border-b border-secondary-500/20">
                <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-secondary-400" />
                    <h3 className="font-bold text-white tracking-wide">Daily Challenge</h3>
                </div>
                <div className="flex items-center gap-1 bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-primary-400">
                    +15 XP Bonus
                </div>
            </div>

            <div className="p-6">
                <p className="text-slate-200 font-medium mb-6 leading-relaxed">
                    What organelle is primarily responsible for the process of photosynthesis in plant cells?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => handleAnswer(opt)}
                            disabled={answered}
                            className={`p-4 rounded-xl text-left border-2 font-medium transition-all ${!answered
                                ? 'border-slate-700 bg-slate-800 hover:border-secondary-500/50 hover:bg-slate-700 text-slate-300'
                                : opt === "Chloroplast"
                                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                                    : isCorrect === false
                                        ? 'border-red-500 bg-red-500/10 text-red-400'
                                        : 'border-slate-800 bg-slate-800/50 text-slate-500'
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                {answered && isCorrect !== null && (
                    <div className={`mt-6 p-4 rounded-xl border ${isCorrect ? 'bg-emerald-900/20 border-emerald-800' : 'bg-red-900/20 border-red-800'}`}>
                        <p className={isCorrect ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                            {isCorrect ? '🎉 Correct! You earned 15 XP.' : '❌ Incorrect. Chloroplasts handle photosynthesis.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
