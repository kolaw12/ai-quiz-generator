"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"IDLE" | "LOADING" | "SUCCESS">("IDLE");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !email.includes("@")) return;

        setStatus("LOADING");

        // Simulating backend Mailer Queue latency
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setStatus("SUCCESS");
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">

            <div className="w-full max-w-md">
                <Link href="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-bold">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </Link>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {status === "SUCCESS" ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-6"
                            >
                                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                </div>
                                <h2 className="text-2xl font-black font-jakarta text-white mb-2">Check your inbox</h2>
                                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                    We've sent a password recovery link to <strong className="text-white">{email}</strong>.
                                    Click the link to reset your credentials.
                                </p>

                                <p className="text-xs text-slate-600 font-medium">
                                    (This is a simulated production screen. Check console for standard token behavior.)
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="text-left mb-8">
                                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6">
                                        <Mail className="w-6 h-6 text-indigo-500" />
                                    </div>
                                    <h1 className="text-3xl font-black text-white font-jakarta">Recover Account</h1>
                                    <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                                        Enter the email address tied to your account. We'll send you a secure link to reset your password.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-2">Registered Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            placeholder="you@example.com"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === "LOADING" || !email}
                                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:shadow-[0_0_30px_rgba(79,70,229,0.3)]"
                                    >
                                        {status === "LOADING" ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
