"use client";

import { motion } from "framer-motion";
import { Award, Flame, Star, Trophy } from "lucide-react";

export function ScoreCard({ score, total }: { score: number, total: number }) {
    const isPerfect = score === total;
    const isGood = score >= total * 0.7;

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 60, delay: 0.2 }}
            className={`glass-card p-8 border-2 text-center relative overflow-hidden ${isPerfect
                    ? "border-amber-400 bg-amber-500/5 shadow-[0_0_50px_-10px_#fbbf24]"
                    : isGood
                        ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_50px_-10px_#10b981]"
                        : "border-slate-700 bg-slate-800/50 shadow-xl"
                }`}
        >
            {isPerfect && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl" />
                    <div className="absolute top-10 right-10 w-48 h-48 bg-yellow-300/10 rounded-full blur-3xl" />
                </div>
            )}

            <div className="relative z-10 flex flex-col items-center gap-4">
                {isPerfect ? (
                    <Trophy className="w-16 h-16 text-amber-400 animate-bounce" />
                ) : isGood ? (
                    <Award className="w-16 h-16 text-emerald-400" />
                ) : (
                    <Star className="w-16 h-16 text-slate-400" />
                )}

                <div>
                    <h2 className="text-4xl font-black text-white mb-2">
                        {score} / {total}
                    </h2>
                    <p className={`font-bold text-xl ${isPerfect ? 'text-amber-400' : isGood ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {isPerfect ? "Perfect Score! 🏆" : isGood ? "Great Job! ⭐" : "Keep Practicing! 💪"}
                    </p>
                </div>

                <div className="flex gap-4 mt-4 w-full justify-center">
                    <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl flex flex-col items-center shadow-inner">
                        <span className="text-secondary-400 font-bold text-lg">+{score * 10}</span>
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">XP Earned</span>
                    </div>
                    {isGood && (
                        <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl flex flex-col items-center shadow-inner">
                            <span className="text-orange-400 font-bold text-lg flex items-center gap-1"><Flame className="w-5 h-5" /> +20</span>
                            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Bonus XP</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
