"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export function AchievementBadge({ name, icon, unlocked, date }: { name: string, icon: string, unlocked: boolean, date?: string }) {
    return (
        <motion.div
            whileHover={unlocked ? { scale: 1.05, y: -5 } : {}}
            className={`relative p-4 rounded-2xl flex flex-col items-center gap-3 text-center transition-all ${unlocked
                    ? 'bg-slate-800 border-2 border-slate-700 shadow-lg'
                    : 'bg-slate-800/30 border border-slate-800 opacity-60 grayscale'
                }`}
        >
            <div className="text-4xl">
                {icon}
            </div>

            <div>
                <h4 className="font-bold text-slate-200 text-sm">{name}</h4>
                {unlocked && date ? (
                    <p className="text-xs text-primary-400 font-medium mt-1">{date}</p>
                ) : (
                    <Lock className="w-3 h-3 text-slate-500 mx-auto mt-2" />
                )}
            </div>

            {/* Glow effect for unlocked badges */}
            {unlocked && (
                <div className="absolute inset-0 bg-primary-500/10 blur-xl rounded-full -z-10" />
            )}
        </motion.div>
    );
}
