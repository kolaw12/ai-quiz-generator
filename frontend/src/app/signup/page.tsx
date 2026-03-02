"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { validateEmail, validateName, validatePasswordStrength } from "@/lib/validators";
import { PasswordStrength } from "@/components/PasswordStrength";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [terms, setTerms] = useState(false);

    // UI states
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Live validation states
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [serverError, setServerError] = useState("");
    const [formSubmitted, setFormSubmitted] = useState(false);

    const router = useRouter();
    const { signup } = useAuth();

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        if (formSubmitted) setNameError(validateName(e.target.value));
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (formSubmitted) setEmailError(validateEmail(e.target.value));
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
        setServerError("");

        // Run frontend validations
        const nError = validateName(name);
        const eError = validateEmail(email);
        const { strength } = validatePasswordStrength(password);

        setNameError(nError);
        setEmailError(eError);

        let hasError = false;

        if (nError || eError) hasError = true;

        if (strength === 'Weak') {
            setServerError("Password does not meet minimum strength requirements");
            hasError = true;
        }

        if (password !== confirmPassword) {
            setServerError("Passwords do not match");
            hasError = true;
        }

        if (!terms) {
            setServerError("Please accept the terms and conditions");
            hasError = true;
        }

        if (hasError) return;

        setLoading(true);
        try {
            await signup(name, email, password);
            router.push("/dashboard");
        } catch (err: unknown) {
            const errorMessage = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
                || "Something went wrong. Please try again later.";
            setServerError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center p-4 pt-20 pb-20 overflow-hidden relative">
            <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[120px] -translate-y-1/2 -z-10" />
            <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-secondary-500/10 rounded-full blur-[100px] translate-y-1/4 -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-full max-w-md"
            >
                <div className="glass-card p-8 shadow-2xl shadow-primary-500/10 border border-slate-800">
                    <div className="text-center mb-8">
                        <motion.h1
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl font-black font-jakarta mb-2 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent"
                        >
                            Create Account
                        </motion.h1>
                        <p className="text-slate-400">Join the smartest JAMB prep platform</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-6">

                        <AnimatePresence>
                            {serverError && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg flex items-center justify-center gap-2 font-bold"
                                >
                                    <span>{serverError}</span>
                                    {serverError.includes('Try logging in') && (
                                        <Link href="/login" className="underline text-red-300 ml-1 hover:text-white">Login here</Link>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={handleNameChange}
                                    className={`w-full bg-slate-900/50 border ${nameError ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/50 focus:border-primary-500'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary-500/50 transition-all placeholder:text-slate-600 font-medium`}
                                    placeholder="Adaeze Okafor"
                                />
                                {nameError && <p className="text-red-400 text-xs mt-1 ml-1 font-bold">{nameError}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className={`w-full bg-slate-900/50 border ${emailError ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/50 focus:border-primary-500'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary-500/50 transition-all placeholder:text-slate-600 font-medium`}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                />
                                {emailError && <p className="text-red-400 text-xs mt-1 ml-1 font-bold">{emailError}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2 ml-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all placeholder:text-slate-600 font-medium pr-12"
                                        placeholder="Create a strong password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {password && <PasswordStrength password={password} />}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2 ml-1">Confirm Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all placeholder:text-slate-600 font-medium"
                                    placeholder="Confirm your password"
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-3 mt-4">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={terms}
                                onChange={(e) => setTerms(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-primary-500 focus:ring-primary-500 focus:ring-offset-slate-950"
                            />
                            <label htmlFor="terms" className="text-sm text-slate-400 cursor-pointer">
                                I agree to the <Link href="/terms" className="text-primary-400 hover:text-primary-300 underline underline-offset-2">Terms of Service</Link> and <Link href="/privacy" className="text-primary-400 hover:text-primary-300 underline underline-offset-2">Privacy Policy</Link>
                            </label>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold font-jakarta text-white mt-4 flex items-center justify-center gap-2 transition-all ${loading ? "bg-primary-600 cursor-not-allowed opacity-80" : "bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 shadow-lg shadow-primary-500/25 cursor-pointer"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </motion.button>

                    </form>

                    <p className="text-center text-slate-400 mt-8 font-medium">
                        Already have an account?{" "}
                        <Link href="/login" className="text-white hover:text-primary-400 font-bold transition-colors">
                            Log In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
