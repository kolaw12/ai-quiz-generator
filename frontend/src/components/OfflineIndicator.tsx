"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function OfflineIndicator() {
    const [isOffline, setIsOffline] = useState(
        typeof window !== 'undefined' ? !navigator.onLine : false
    );

    useEffect(() => {

        const handleOffline = () => setIsOffline(true);
        const handleOnline = () => setIsOffline(false);

        window.addEventListener("offline", handleOffline);
        window.addEventListener("online", handleOnline);

        return () => {
            window.removeEventListener("offline", handleOffline);
            window.removeEventListener("online", handleOnline);
        };
    }, []);

    return (
        <AnimatePresence>
            {isOffline && (
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className="fixed top-20 left-4 right-4 z-50 flex justify-center pointer-events-none"
                >
                    <div className="bg-rose-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 font-bold max-w-sm w-full pointer-events-auto border-2 border-rose-400 border-b-4">
                        <div className="flex items-center gap-3 text-left">
                            <span className="text-3xl">📡</span>
                            <div>
                                <p className="text-lg">No Internet!</p>
                                <p className="text-xs font-medium text-rose-200">Connect to continue practicing.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
