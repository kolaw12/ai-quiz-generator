"use client";

import { motion } from "framer-motion";

export function LevelProgress({ xp, nextLevelXp, currentLevel }: { xp: number, nextLevelXp: number, currentLevel: number }) {
    const percentage = Math.min((xp / nextLevelXp) * 100, 100);

    return (
        <div className="flex flex-col gap-2 w-full max-w-sm">
            <div className="flex justify-between items-end">
                <span className="text-sm font-semibold text-primary-400">Level {currentLevel}</span>
                <span className="text-xs text-slate-400 font-medium">{xp} / {nextLevelXp} XP</span>
            </div>

            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.2, type: "spring", stiffness: 50 }}
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 relative"
                >
                    {/* Shine effect overlay */}
                    <div className="absolute inset-0 bg-white/20 skew-x-[-30deg] -translate-x-full animate-[shimmer_2s_infinite]" />
                </motion.div>
            </div>
        </div>
    );
}
