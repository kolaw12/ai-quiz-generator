"use client";

import { motion, AnimatePresence } from "framer-motion";

export function XPAnimation({ show, amount = 10 }: { show: boolean, amount?: number }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 0, scale: 0.5 }}
                    animate={{ opacity: [0, 1, 0], y: -50, scale: [0.5, 1.2, 1] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute z-50 pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-4xl text-transparent bg-clip-text bg-gradient-to-t from-yellow-500 to-amber-300 filter drop-shadow-[0_0_10px_rgba(251,191,36,0.8)] leading-none"
                >
                    +{amount} XP
                </motion.div>
            )}
        </AnimatePresence>
    );
}
