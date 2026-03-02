"use client";

import { motion } from "framer-motion";

export function PerformanceBreakdown() {
    const topics = [
        { name: "Cell Biology", score: 100 },
        { name: "Ecology", score: 75 },
        { name: "Genetics", score: 50 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 border-slate-700"
        >
            <h3 className="font-bold border-b border-slate-800 pb-4 mb-6 text-white text-lg">Performance Breakdown</h3>

            <div className="space-y-6">
                {topics.map((t, idx) => (
                    <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm font-bold">
                            <span className="text-slate-300">{t.name}</span>
                            <span className={t.score >= 80 ? 'text-emerald-400' : t.score >= 50 ? 'text-amber-400' : 'text-red-400'}>
                                {t.score}%
                            </span>
                        </div>

                        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${t.score}%` }}
                                transition={{ duration: 1, delay: 0.5 + (idx * 0.2), ease: "easeOut" }}
                                className={`h-full rounded-full ${t.score >= 80 ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                                        : t.score >= 50 ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                                            : 'bg-gradient-to-r from-red-500 to-rose-400'
                                    }`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
