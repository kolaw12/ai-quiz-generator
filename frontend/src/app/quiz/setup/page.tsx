"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

function QuizSetupContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const subjectId = searchParams.get("subject") || "biology";

    // Derive UI text from search params synchronously
    let iconTxt = "📚";
    let subjectName = subjectId.charAt(0).toUpperCase() + subjectId.slice(1);

    if (subjectId.toLowerCase().includes('bio')) { iconTxt = "🧬"; subjectName = "Biology"; }
    else if (subjectId.toLowerCase().includes('phy')) { iconTxt = "📐"; subjectName = "Physics"; }
    else if (subjectId.toLowerCase().includes('chem')) { iconTxt = "⚗️"; subjectName = "Chemistry"; }
    else if (subjectId.toLowerCase().includes('math')) { iconTxt = "🔢"; subjectName = "Mathematics"; }

    const [step, setStep] = useState(1);

    // Setup state
    const [count, setCount] = useState<number>(10);
    const [topic, setTopic] = useState("");

    const handleNext = () => setStep(step + 1);
    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else router.push("/subjects");
    };

    const handleStart = () => {
        const finalTopic = topic.trim() || subjectName; // Default to whole subject if empty
        // Hardcode difficulty to medium and mode to practice to remove choices for simple UX
        router.push(`/quiz?subject=${subjectId}&topic=${encodeURIComponent(finalTopic)}&count=${count}&diff=medium&mode=practice`);
    };

    // Auto-suggested Topics based on subject
    const getSuggestions = () => {
        if (subjectId === 'biology') return ["Cell Biology", "Ecology", "Genetics", "Evolution"];
        if (subjectId === 'physics') return ["Mechanics", "Waves", "Electricity", "Optics"];
        if (subjectId === 'chemistry') return ["Organic", "Acids & Bases", "Metals", "Kinetics"];
        if (subjectId === 'mathematics') return ["Algebra", "Calculus", "Geometry", "Statistics"];
        return ["General"];
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col p-4 py-12 md:p-8">

            {/* Simple Top Nav */}
            <div className="w-full max-w-xl mx-auto flex items-center justify-between mb-12">
                <button onClick={handleBack} className="p-3 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="text-sm font-bold text-slate-500">Step {step} of 2</div>
                <div className="w-11" /> {/* Spacer */}
            </div>

            <main className="flex-grow flex items-center justify-center w-full max-w-lg mx-auto">
                <AnimatePresence mode="wait">

                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full"
                        >
                            <div className="text-center mb-8">
                                <span className="text-5xl mb-4 block">{iconTxt}</span>
                                <h1 className="text-3xl font-black font-jakarta text-white mb-2">{subjectName} Quiz</h1>
                                <p className="text-slate-400 font-medium">How many questions do you want?</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {[5, 10, 15, 20].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => setCount(num)}
                                        className={`py-6 rounded-3xl border-2 text-2xl font-black transition-all active:scale-95 ${count === num
                                            ? "bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                                            : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleNext}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg py-5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-indigo-500/20"
                            >
                                Next <ArrowRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full"
                        >
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-black font-jakarta text-white mb-2 cursor-pointer flex justify-center items-center gap-2">
                                    {iconTxt} {subjectName} — {count} Questions <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                </h1>
                                <p className="text-slate-400 font-medium text-sm">Any specific topic? (Optional)</p>
                            </div>

                            <div className="mb-6">
                                <input
                                    type="text"
                                    placeholder="e.g. general, or type a topic..."
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="w-full bg-slate-900 border-2 border-slate-700 focus:border-indigo-500 rounded-2xl px-6 py-5 text-lg text-white font-bold transition-colors outline-none text-center"
                                />
                            </div>

                            <div className="mb-10">
                                <p className="text-center text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">Tap a quick topic</p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {getSuggestions().map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            onClick={() => setTopic(suggestion)}
                                            className={`px-5 py-3 rounded-full border-2 text-sm font-bold transition-all ${topic === suggestion
                                                ? "bg-indigo-500/20 border-indigo-500 text-indigo-400"
                                                : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                                                }`}
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleStart}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xl py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_0_30px_rgba(79,70,229,0.3)]"
                            >
                                🚀 START QUIZ!
                            </button>

                            <p className="text-center mt-4 text-slate-500 text-sm font-bold">
                                ({count} {topic ? topic : subjectName} questions)
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

export default function QuizSetupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading Setup...</div>}>
            <QuizSetupContent />
        </Suspense>
    );
}
