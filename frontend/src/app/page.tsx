"use client";

import Link from "next/link";
import { ArrowRight, Brain, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md flex flex-col items-center text-center relative z-10"
      >
        {/* Logo Area */}
        <div className="w-24 h-24 shadow-[0_0_40px_rgba(79,70,229,0.2)] bg-indigo-500/20 rounded-3xl flex items-center justify-center mb-8 border-4 border-slate-900 overflow-hidden">
          <Brain className="w-12 h-12 text-indigo-400" />
        </div>

        <h1 className="text-4xl font-black font-jakarta text-white mb-4">
          JAMB Quiz Master
        </h1>

        <p className="text-lg text-slate-300 font-medium mb-12">
          Practice JAMB questions<br />and pass your exam! ✨
        </p>

        {/* Primary Action */}
        <Link
          href="/signup"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 px-6 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-3 text-lg"
        >
          🚀 START PRACTICING NOW
          <span className="text-sm font-normal opacity-80">(It's free!)</span>
          <ArrowRight className="w-5 h-5 ml-auto" />
        </Link>

        {/* Secondary Action */}
        <Link
          href="/login"
          className="mt-6 text-slate-400 hover:text-white font-bold transition-colors py-3 w-full"
        >
          Already have an account? <span className="text-indigo-400">Log in</span>
        </Link>

        {/* Social Proof */}
        <div className="mt-16 flex items-center gap-3 bg-slate-900/50 border border-slate-800 rounded-full px-5 py-3">
          <Users className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold text-slate-300">
            10,000+ students use this!
          </span>
        </div>
      </motion.div>
    </div>
  );
}
