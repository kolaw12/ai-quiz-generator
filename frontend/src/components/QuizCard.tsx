"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuiz } from "@/hooks/useQuiz";
import { OptionButton } from "./OptionButton";
import { ExplanationPanel } from "./ExplanationPanel";
import { XPAnimation } from "./XPAnimation";
import { ConfettiEffect } from "./ConfettiEffect";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function QuizCard({
    initialSession,
    onFinish
}: {
    initialSession: import('@/types').QuizSession,
    onFinish: (score: number) => void
}) {

    const quiz = useQuiz(initialSession, initialSession.totalQuestions);

    // ─── Native CBT Keyboard Shortcuts ───
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            const key = e.key.toLowerCase();

            if (quiz.showFeedback && quiz.isCorrect !== null) {
                if (key === 'enter' || key === ' ') {
                    e.preventDefault();
                    quiz.handleNext();
                }
            } else if (quiz.selectedOption && !quiz.loadingFeedback && !quiz.showFeedback && (key === 'enter' || key === ' ')) {
                // If they have selected an option, allow enter to CONFIRM
                e.preventDefault();
                // To hook directly into evaluate, we cheat a little by just triggering the click on the submit button visually or handling logic. 
                // Because useQuiz manages submission internally when we click the button we'll expose a confirm method or simulate it:
                const element = document.getElementById('confirm-answer-btn');
                if (element) element.click();
            } else if (!quiz.loadingFeedback && !quiz.showFeedback) {
                if (key === 'a' || key === '1') quiz.handleOptionSelect('A');
                if (key === 'b' || key === '2') quiz.handleOptionSelect('B');
                if (key === 'c' || key === '3') quiz.handleOptionSelect('C');
                if (key === 'd' || key === '4') quiz.handleOptionSelect('D');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [quiz.currentIndex, quiz.showFeedback, quiz.loadingFeedback, quiz.isCorrect, quiz.selectedOption, quiz]);

    if (quiz.finished) {
        onFinish(quiz.score);
        return null;
    }

    return (
        <div className="relative w-full max-w-2xl mx-auto min-h-[500px] flex flex-col justify-center">

            <XPAnimation show={quiz.showXP} amount={10} />
            <ConfettiEffect active={quiz.showConfetti} />

            {/* Mobile-Friendly Progress Bar */}
            <div className="mb-8 text-center">
                <p className="text-slate-400 font-bold mb-3 uppercase tracking-widest text-sm">
                    Question {quiz.currentIndex + 1} of {initialSession.totalQuestions}
                </p>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-indigo-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((quiz.currentIndex) / initialSession.totalQuestions) * 100}%` }}
                    />
                </div>
                {quiz.score > 0 && !quiz.showFeedback && (
                    <p className="text-sm font-bold text-emerald-400 mt-3 flex justify-center items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> {quiz.score} correct so far
                    </p>
                )}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={quiz.currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full flex flex-col gap-6"
                >
                    {/* The Prompt */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
                        <h2 className="text-2xl md:text-3xl font-jakarta font-bold text-white leading-relaxed">
                            {quiz.currentQ.question}
                        </h2>
                    </div>

                    {!quiz.showFeedback && (
                        <p className="text-center font-bold text-slate-500 text-sm">👇 Tap your answer below:</p>
                    )}

                    {/* Interaction Grid */}
                    <div className="space-y-4">
                        {(Object.entries(quiz.currentQ.options) as [string, string][]).map(([key, value]) => (
                            <OptionButton
                                key={key}
                                letter={key}
                                text={value}
                                isSelected={quiz.selectedOption === key}
                                isCorrect={quiz.isCorrect}
                                disabled={quiz.loadingFeedback || quiz.showFeedback}
                                onSelect={() => quiz.handleOptionSelect(key)}
                                shakeCondition={quiz.shakeWrong && quiz.selectedOption === key}
                                revealCorrect={quiz.showFeedback && key === quiz.currentQ.correct_answer}
                            />
                        ))}
                    </div>

                    {/* Loader */}
                    {quiz.loadingFeedback && (
                        <div className="text-center mt-4 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold animate-pulse flex items-center justify-center gap-2">
                            Checking your answer... 🧠
                        </div>
                    )}

                    {/* Submit Middle State */}
                    {!quiz.showFeedback && !quiz.loadingFeedback && quiz.selectedOption && (
                        <motion.button
                            id="confirm-answer-btn"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => quiz.submitAnswer()} // Requires hook update to support two-step
                            className="w-full mt-4 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-all flex justify-center items-center gap-3 active:scale-95"
                        >
                            ✅ Check My Answer
                        </motion.button>
                    )}

                    {!quiz.showFeedback && !quiz.loadingFeedback && quiz.selectedOption && (
                        <p className="text-center text-sm font-bold text-slate-500">
                            Want to change? Tap another option
                        </p>
                    )}

                    {/* Post-Submit Feedback Container */}
                    <AnimatePresence>
                        {quiz.showFeedback && quiz.isCorrect !== null && (
                            <motion.div className="flex flex-col">
                                <ExplanationPanel explanation={quiz.explanation} />

                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={quiz.handleNext}
                                    className="w-full mt-6 py-5 rounded-2xl font-bold text-white text-lg transition-all shadow-xl flex justify-center items-center gap-2 active:scale-95 bg-slate-800 hover:bg-slate-700 border border-slate-700"
                                >
                                    {quiz.currentIndex + 1 < initialSession.totalQuestions ? 'Next Question' : 'Finish Quiz'} <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </motion.div>
            </AnimatePresence>
        </div>
    );
}
