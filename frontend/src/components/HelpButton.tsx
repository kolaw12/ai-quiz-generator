"use client";

import { useState } from "react";
import { HelpCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function HelpButton() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Contextual Help Logic
    let helpContent = (
        <div className="space-y-4 text-sm font-medium">
            <p>• Tap 🏠 to go to your Dashboard</p>
            <p>• Tap 📚 to take a new Quiz</p>
            <p>• Tap 📊 to see your Progress</p>
            <p>• Tap 👤 to change Settings</p>
        </div>
    );

    if (pathname.includes('/quiz') && !pathname.includes('/setup')) {
        helpContent = (
            <div className="space-y-4 text-sm font-medium">
                <p>• Tap <b>A, B, C or D</b> to pick your answer</p>
                <p>• Tap <b>&quot;Check My Answer&quot;</b> to confirm it</p>
                <p>• Read the <b>💡 Why?</b> explanation to learn!</p>
                <p>• Tap <b>&quot;Next Question&quot;</b> to continue</p>
            </div>
        );
    } else if (pathname.includes('/subjects')) {
        helpContent = (
            <div className="space-y-4 text-sm font-medium">
                <p>• Tap any <b>subject card</b> to start practicing</p>
                <p>• You can try any subject for free</p>
                <p>• Start with the one you know best!</p>
            </div>
        );
    }

    return (
        <div className="fixed bottom-24 right-4 z-[60]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-16 right-0 w-[300px] bg-slate-900 border-2 border-indigo-500/50 rounded-3xl p-6 shadow-2xl"
                    >
                        <h3 className="text-xl font-bold font-jakarta text-white mb-4 flex items-center gap-2">
                            ❓ Need Help?
                        </h3>

                        <div className="text-slate-300 mb-6">
                            {helpContent}
                        </div>

                        <a href="mailto:support@jambquiz.app" className="block text-center text-indigo-400 font-bold mb-4 hover:underline">
                            Still stuck? [Contact Support]
                        </a>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors"
                        >
                            Got it! ✅
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${isOpen ? 'bg-slate-800 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-105'}`}
            >
                {isOpen ? <XCircle className="w-8 h-8" /> : <HelpCircle className="w-8 h-8" />}
            </button>
        </div>
    );
}
