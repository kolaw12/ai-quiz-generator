"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Target, Sparkles, CheckCircle2 } from "lucide-react";

export function OnboardingTutorial() {
    const [isVisible, setIsVisible] = useState(false);
    const [step, setStep] = useState(0);

    // Give it a small delay before showing so it doesn't snap instantly on load 
    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem("jqm_tutorial_seen");
        if (!hasSeenTutorial) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const completeTutorial = () => {
        localStorage.setItem("jqm_tutorial_seen", "true");
        setIsVisible(false);
    };

    const nextStep = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            completeTutorial();
        }
    };

    const steps = [
        {
            icon: <Sparkles className="w-16 h-16 text-indigo-400 mx-auto" />,
            title: "Welcome to JAMB Quiz Master!",
            description: "Your simple, AI-powered way to practice and get high scores in your JAMB exams. We make learning easy.",
            buttonText: "Show me how 😊"
        },
        {
            icon: <BookOpen className="w-16 h-16 text-emerald-400 mx-auto" />,
            title: "Pick a Subject",
            description: "Start practicing anytime. Just tap the big green 'Start Practicing' buttons. Try any subject.",
            buttonText: "Next 👉"
        },
        {
            icon: <Target className="w-16 h-16 text-amber-400 mx-auto" />,
            title: "Learn with AI",
            description: "If you get a question wrong, our friendly AI will explain exactly why in simple language you can understand!",
            buttonText: "Got it! ✅"
        }
    ];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm pointer-events-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden text-center"
                    >
                        {/* Decorative background glow */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

                        <div className="mb-6 relative z-10">
                            {steps[step].icon}
                        </div>

                        <h2 className="text-2xl font-black font-jakarta text-white mb-4 relative z-10">
                            {steps[step].title}
                        </h2>

                        <p className="text-slate-300 font-medium mb-8 leading-relaxed relative z-10 h-24">
                            {steps[step].description}
                        </p>

                        <div className="flex gap-2 justify-center mb-8 relative z-10">
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-2.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-indigo-500' : 'w-2.5 bg-slate-700'}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextStep}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 relative z-10"
                        >
                            {step === steps.length - 1 && <CheckCircle2 className="w-5 h-5" />}
                            {steps[step].buttonText}
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
