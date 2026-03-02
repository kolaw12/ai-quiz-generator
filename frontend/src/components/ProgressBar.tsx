"use client";

import { motion } from "framer-motion";

export function ProgressBar({ progress }: { progress: number }) {
    return (
        <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 shadow-inner">
            <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 12 }}
            >
                <div className="absolute inset-0 bg-white/20 skew-x-[-30deg] -translate-x-full animate-[shimmer_2s_infinite]" />
            </motion.div>
        </div>
    );
}
