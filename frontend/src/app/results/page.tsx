"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { ConfettiEffect } from "@/components/ConfettiEffect";
import { ScoreMessage } from "@/components/ScoreMessage";
import { QuestionReview } from "@/components/QuestionReview";
import { ShareScore } from "@/components/ShareScore";
import { RotateCcw, Home, Book } from "lucide-react";
import { motion } from "framer-motion";

function ResultsLoader() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const score = parseInt(searchParams.get("score") || "0");
    const total = parseInt(searchParams.get("total") || "10");
    const topic = searchParams.get("topic") || "General";
    const subject = searchParams.get("subject") || "general";

    const percentage = total > 0 ? (score / total) * 100 : 0;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col p-4 py-12 md:p-8">

            <ConfettiEffect active={percentage >= 70} />

            <div className="w-full max-w-xl mx-auto flex items-center justify-between mb-8">
                <button onClick={() => router.push("/dashboard")} className="p-3 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                    <Home className="w-5 h-5" />
                </button>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{topic} Quiz</div>
                <div className="w-11" /> {/* Spacer */}
            </div>

            <main className="flex-grow flex items-center justify-center w-full max-w-lg mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="w-full space-y-6"
                >
                    <div className="text-center mb-6">
                        <h1 className="text-4xl font-black font-jakarta text-white mb-2">Quiz Done! 🎉</h1>
                    </div>

                    <ScoreMessage score={score} total={total} />

                    <QuestionReview total={total} score={score} />

                    <div className="pt-6 space-y-4">
                        <ShareScore score={score} total={total} topic={topic} />

                        <button
                            onClick={() => router.push(`/quiz/setup?subject=${subject}`)}
                            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 transition-colors active:scale-95 shadow-[0_0_30px_rgba(79,70,229,0.3)] mb-4"
                        >
                            <RotateCcw className="w-6 h-6" /> TRY AGAIN (Practice makes perfect!)
                        </button>

                        <button
                            onClick={() => router.push("/subjects")}
                            className="w-full py-5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 border border-slate-700 transition-colors active:scale-95"
                        >
                            <Book className="w-6 h-6" /> TRY ANOTHER SUBJECT
                        </button>
                    </div>

                </motion.div>
            </main>
        </div>
    );
}

export default function Results() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-bold">Loading your results...</div>}>
            <ResultsLoader />
        </Suspense>
    );
}
