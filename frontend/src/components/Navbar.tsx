"use client";

import Link from "next/link";
import { Brain } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "./UserMenu";

export default function Navbar() {
    const { user, isLoading } = useAuth();

    return (
        <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 h-16 flex items-center">
            <div className="container mx-auto px-4 max-w-5xl flex items-center justify-between">

                <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                        <Brain className="w-5 h-5 text-indigo-400" />
                    </div>
                    <span className="font-bold font-jakarta text-white tracking-wide text-lg">JAMB Quiz</span>
                </Link>

                {!isLoading && (
                    <div className="flex items-center gap-3">
                        {user ? (
                            <UserMenu user={user} />
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="hidden sm:block text-slate-300 hover:text-white font-bold text-sm px-4 py-2"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
