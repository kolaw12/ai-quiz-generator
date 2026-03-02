"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { ERROR_MESSAGES } from "@/lib/messages";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Critical Application Failure Captured:", error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                    </div>

                    <h1 className="text-3xl font-black font-jakarta text-white mb-4">
                        Oops! Something went wrong 😓
                    </h1>

                    <p className="text-slate-400 text-lg mb-8 max-w-sm leading-relaxed">
                        Don't worry, it's not your fault! Our engineering team has been notified.
                    </p>

                    <div className="flex flex-col w-full max-w-xs gap-4">
                        <button
                            onClick={() => reset()}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex justify-center items-center gap-2"
                        >
                            <RotateCcw className="w-5 h-5" /> Try Again
                        </button>

                        <a
                            href="/"
                            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2"
                        >
                            <Home className="w-5 h-5" /> Go Home
                        </a>
                    </div>
                </div>
            </body>
        </html>
    );
}
