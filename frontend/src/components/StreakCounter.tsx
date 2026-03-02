"use client";

import { motion } from "framer-motion";

export default function StreakCounter({ streak }: { streak: number }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl shadow-lg border border-slate-700/50"
        >
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    textShadow: [
                        "0 0 0px #ff0000",
                        "0 0 10px #ff6b6b",
                        "0 0 0px #ff0000",
                    ],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                }}
                className="text-2xl"
            >
                🔥
            </motion.div>
            <div className="flex flex-col">
                <span className="text-white font-bold leading-none">{streak}</span>
                <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">
                    Day Streak
                </span>
            </div>
        </motion.div>
    );
}
