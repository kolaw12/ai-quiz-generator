"use client";

import { motion } from "framer-motion";
import { BarChart2, Flame, Trophy, Award, BookOpen, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function ProgressPage() {
    const { user, isLoading } = useAuth();

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

            <main className="flex-grow flex flex-col items-center justify-start pt-24 px-4 w-full max-w-lg mx-auto space-y-8">

                <div className="text-center">
                    <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-3xl mx-auto flex items-center justify-center mb-4">
                        <BarChart2 className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black font-jakarta text-white">My Progress</h1>
                    <p className="text-slate-400 font-medium">See how far you've come! 📈</p>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-2 gap-4 w-full">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 border-2 border-amber-500/20 rounded-3xl p-5 flex flex-col items-center text-center shadow-[0_0_30px_rgba(245,158,11,0.05)]"
                    >
                        <Flame className="w-8 h-8 text-amber-500 mb-2" fill="currentColor" />
                        <span className="text-3xl font-black text-white">{user.streak}</span>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Day Streak</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900 border-2 border-indigo-500/20 rounded-3xl p-5 flex flex-col items-center text-center shadow-[0_0_30px_rgba(79,70,229,0.05)]"
                    >
                        <Trophy className="w-8 h-8 text-indigo-400 mb-2" fill="currentColor" />
                        <span className="text-3xl font-black text-white">{user.level}</span>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Current Level</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900 border-2 border-emerald-500/20 rounded-3xl p-5 flex flex-col items-center text-center"
                    >
                        <Award className="w-8 h-8 text-emerald-400 mb-2" />
                        <span className="text-3xl font-black text-white">{user.xp}</span>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total XP ✨</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-900 border-2 border-rose-500/20 rounded-3xl p-5 flex flex-col items-center text-center"
                    >
                        <BookOpen className="w-8 h-8 text-rose-400 mb-2" />
                        <span className="text-3xl font-black text-white">12</span>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Quizzes Done</span>
                    </motion.div>

                </div>

                {/* Level Progress */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6"
                >
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-indigo-400" /> Path to Level {user.level + 1}
                        </h3>
                        <span className="font-bold text-slate-500 text-sm">{user.xp} / {(user.level * 100) + 100} XP</span>
                    </div>

                    <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden shrink-0 mt-3 mb-2">
                        <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${(user.xp / ((user.level * 100) + 100)) * 100}%` }}
                        />
                    </div>
                    <p className="text-center text-sm font-bold text-slate-400 mt-4">Just {(user.level * 100) + 100 - user.xp} XP to go! Keep practicing! 🌟</p>
                </motion.div>

                {/* Subject Weaknesses / Strengths */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="w-full space-y-4"
                >
                    <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm text-center">Your Strongest Subjects</h3>

                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">🧬</span>
                            <div>
                                <h4 className="font-bold text-white text-lg">Biology</h4>
                                <p className="text-emerald-400 font-bold text-sm">82% Average</p>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-400 font-black">1st</div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">📐</span>
                            <div>
                                <h4 className="font-bold text-white text-lg">Physics</h4>
                                <p className="text-amber-400 font-bold text-sm">65% Average</p>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-full border-4 border-amber-500 flex items-center justify-center text-amber-500 font-black">2nd</div>
                    </div>

                </motion.div>

            </main>

            <BottomNav />
        </div>
    );
}
