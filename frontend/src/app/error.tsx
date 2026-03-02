"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Page-level Error caught from Boundary:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col pb-24">
            <Navbar />
            <main className="flex-grow flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full">

                <div className="w-24 h-24 bg-red-500/10 rounded-[2rem] flex items-center justify-center mb-8 border border-red-500/20 shadow-xl shadow-red-500/5">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                </div>

                <h1 className="text-3xl font-black font-jakarta text-white mb-4">
                    Whoops! 🤕
                </h1>

                <p className="text-slate-400 font-medium text-lg mb-8 leading-relaxed">
                    Something broke, but don't worry! It happens to the best of apps. Let's try to fix it.
                </p>

                <div className="flex flex-col w-full gap-4">
                    <button
                        onClick={() => reset()}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        <RotateCcw className="w-5 h-5" /> REFRESH PAGE
                    </button>

                    <Link
                        href="/dashboard"
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-5 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" /> GO TO DASHBOARD
                    </Link>
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
