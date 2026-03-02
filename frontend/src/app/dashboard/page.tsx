"use client";

import { motion } from "framer-motion";
import { BookOpen, User as UserIcon, Flame, Trophy } from "lucide-react";
import Navbar from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { getTimeGreeting } from "@/lib/messages";

export default function DashboardPage() {
    const { user, isLoading } = useAuth();

    // Mock user progress representing the last active state 
    // This removes the overwhelming 10+ cards on the home screen
    const lastSession = {
        subject: "Biology",
        score: "7/10",
        percentage: 70
    };

    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col pt-24 px-4 pb-24">
                <Navbar />
                <div className="max-w-md mx-auto w-full space-y-6">
                    <LoadingSkeleton lines={2} />
                    <LoadingSkeleton lines={5} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col pb-24">
            <Navbar />

            <main className="flex-grow flex flex-col items-center justify-start pt-24 px-4 md:px-8 w-full max-w-lg mx-auto">

                {/* Salutation Block */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full text-center space-y-2 mb-10"
                >
                    <p className="text-xl text-slate-400 font-medium">
                        {getTimeGreeting()}
                    </p>
                    <h1 className="text-3xl font-black font-jakarta text-white truncate px-4">
                        👋 Welcome back, {user.name.split(' ')[0]}!
                    </h1>
                    {user.streak > 0 && (
                        <p className="text-amber-400 font-bold flex items-center justify-center gap-1.5 mt-2">
                            <Flame className="w-5 h-5" fill="currentColor" /> Day {user.streak} streak — keep going!
                        </p>
                    )}
                </motion.div>

                {/* Primary Action Card - Singular Focus */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full bg-slate-900 border-2 border-slate-800 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden"
                >
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center">
                            <BookOpen className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-white font-black font-jakarta text-2xl tracking-wide uppercase">
                                Continue
                            </h2>
                            <p className="text-slate-400 font-medium tracking-wide">
                                Keep practicing!
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-950/50 rounded-2xl p-4 mb-6 border border-slate-800/50">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-400 font-medium uppercase tracking-wider text-sm">Last Subject</span>
                            <span className="text-white font-bold">{lastSession.subject}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-medium uppercase tracking-wider text-sm">Last Score</span>
                            <span className="text-emerald-400 font-bold">{lastSession.score} ({lastSession.percentage}%)</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 relative z-10">
                        <Link
                            href={`/quiz/setup?subject=${lastSession.subject.toLowerCase()}`}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg py-5 rounded-xl shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-2"
                        >
                            ▶️ Continue {lastSession.subject}
                        </Link>

                        <Link
                            href="/subjects"
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-5 rounded-xl transition-all flex items-center justify-center"
                        >
                            📚 Change Subject
                        </Link>
                    </div>
                </motion.div>

                {/* Simplified Progress Nudge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full mt-8 bg-slate-900 border border-slate-800 rounded-[2rem] p-6 text-center"
                >
                    <div className="w-12 h-12 bg-amber-500/20 text-amber-500 rounded-2xl mx-auto flex flex-col items-center justify-center mb-3">
                        <Trophy className="w-6 h-6" />
                    </div>

                    <h3 className="text-white font-bold text-lg mb-2">📊 Your Progress</h3>

                    <div className="flex flex-col mb-4">
                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden shrink-0 mt-3 mb-2">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '70%' }} />
                        </div>
                        <span className="text-slate-400 font-bold text-sm tracking-widest">{lastSession.percentage}% Average</span>
                    </div>

                    <p className="text-emerald-400 font-medium italic mb-5">"You're improving! Keep going!" 💪</p>

                    <Link
                        href="/progress"
                        className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center justify-center text-sm"
                    >
                        See more stats ↓
                    </Link>
                </motion.div>

            </main>

            <BottomNav />
        </div>
    );
}
