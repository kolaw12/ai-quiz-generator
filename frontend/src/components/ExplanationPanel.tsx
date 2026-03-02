"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Lightbulb, CheckCircle2, XCircle } from "lucide-react";

export function ExplanationPanel({ explanation }: { explanation: string }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // AI returns blocks separated by double newlines per our new Prompt rules
    const paragraphs = explanation.split('\n\n').filter(p => p.trim());

    return (
        <div className="w-full mt-4 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Header / Toggle */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-5 bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className="font-bold text-lg text-white font-jakarta">
                        {isExpanded ? "💡 Why? (Tap to hide)" : "💡 Why? (Tap to learn)"}
                    </span>
                </div>
                {isExpanded ? <ChevronUp className="w-6 h-6 text-slate-400" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
            </button>

            {/* Content Body */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-5 space-y-5 text-slate-300 border-t border-slate-800/50"
                    >
                        {paragraphs.map((para, i) => {
                            // Extract semantics based on prompt prefixes
                            if (para.startsWith("CORRECT:")) {
                                return (
                                    <div key={i} className="bg-emerald-500/10 border-l-4 border-emerald-500 p-4 rounded-r-xl">
                                        <p className="font-bold text-emerald-400 mb-1 flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" /> Correct Answer:
                                        </p>
                                        <p className="text-emerald-50 leading-relaxed text-[15px]">{para.replace("CORRECT:", "").trim()}</p>
                                    </div>
                                );
                            }
                            if (para.startsWith("WRONG_") || para.includes("WRONG_")) {
                                return (
                                    <div key={i} className="flex gap-3 mb-2 opacity-80">
                                        <XCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
                                        <p className="text-slate-300 text-[15px] leading-relaxed">
                                            {para.replace(/WRONG_[A-D]:/g, "").trim()}
                                        </p>
                                    </div>
                                );
                            }
                            if (para.startsWith("TIP:")) {
                                return (
                                    <div key={i} className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-xl mt-4">
                                        <p className="font-bold text-indigo-400 text-sm tracking-wider uppercase mb-1 flex items-center gap-2">
                                            💡 Quick Tip
                                        </p>
                                        <p className="text-white font-medium">{para.replace("TIP:", "").trim()}</p>
                                    </div>
                                );
                            }

                            // Fallback raw formatting
                            return <p key={i} className="leading-relaxed text-[15px]">{para}</p>;
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
