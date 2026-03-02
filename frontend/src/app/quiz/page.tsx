"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { api } from "@/lib/api";
import { QuizSession } from "@/types";
import { ProgressBar } from "@/components/ProgressBar";
import { TimerDisplay } from "@/components/TimerDisplay";
import StreakCounter from "@/components/StreakCounter";
import QuizCard from "@/components/QuizCard";

function QuizRunner() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const subject = searchParams.get("subject") || "biology";
    const topic = searchParams.get("topic") || "Biology";
    const count = parseInt(searchParams.get("count") || "10");
    const diff = searchParams.get("diff") || "medium";
    const mode = searchParams.get("mode") || "practice";

    const [session, setSession] = useState<QuizSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Extract from QuizCard internal state (handled functionally via a generic wrapper if needed)
    // For simplicity of gamification UI display at the top level, we pass a mockup progress state.
    // Realistically, the QuizCard hook manages the granular index, but we'll approximate here
    // or hoist state up if preferred. For now we use steady state.

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const data = await api.startQuiz(topic, count, diff, mode, subject);
                setSession(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [topic, count, diff, mode, subject]);

    const handleFinish = (finalScore: number) => {
        // Navigate to results page with data (using localStorage or URL for demo)
        router.push(`/results?score=${finalScore}&total=${session?.totalQuestions}&topic=${encodeURIComponent(topic)}&subject=${encodeURIComponent(subject)}`);
    };

    const forceQuit = () => {
        if (confirm("Are you sure you want to quit? You will lose your progress.")) {
            router.push("/dashboard");
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="w-24 h-24 border-4 border-slate-800 border-t-primary-500 rounded-full animate-spin mb-8" />
                <h2 className="text-2xl font-bold text-white mb-2 font-jakarta mt-4">AI is Reading the Syllabus...</h2>
                <p className="text-slate-400">Crafting personalized {diff} questions on {topic}.</p>
            </div>
        );
    }

    if (error || !session) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="glass p-8 rounded-2xl max-w-md text-center border-red-500/50 bg-red-500/5">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Error Generating Quiz</h2>
                    <p className="text-slate-300 mb-6">{error}</p>
                    <button onClick={() => router.push('/quiz/setup')} className="bg-slate-800 text-white px-6 py-3 rounded-xl hover:bg-slate-700 transition">Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            {/* Quiz Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-white/5 py-4">
                <div className="container mx-auto px-4 max-w-4xl flex items-center justify-between gap-4">

                    <button onClick={forceQuit} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition">
                        <X className="w-6 h-6" />
                    </button>

                    <div className="flex-1 px-4 max-w-xl mx-auto hidden md:block">
                        {/* The progress bar handles width dynamically, but here we show general container width */}
                        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-500 w-full animate-pulse opacity-50" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <StreakCounter streak={0} /> {/* Ideally hooked up to global state */}
                        {mode === "timed" && <TimerDisplay initialMinutes={count} onExpire={() => handleFinish(0)} />}
                    </div>

                </div>
            </header>

            {/* Quiz Space */}
            <main className="flex-grow flex items-center justify-center p-4 py-12 overflow-x-hidden">
                <div className="w-full">
                    {/* The actual Quiz Interactive Component */}
                    {session && (
                        <QuizCard
                            onFinish={handleFinish}
                            initialSession={session}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}

export default function QuizPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>}>
            <QuizRunner />
        </Suspense>
    )
}
