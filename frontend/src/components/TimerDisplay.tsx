"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function TimerDisplay({ initialMinutes, onExpire }: { initialMinutes: number, onExpire: () => void }) {
    const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

    useEffect(() => {
        if (timeLeft <= 0) {
            onExpire();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, onExpire]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    // Urgent styling when under 5 minutes
    const isUrgent = timeLeft < 300;

    return (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold font-jakarta text-lg transition-colors duration-500 ${isUrgent ? 'bg-red-500/10 text-red-500 border border-red-500/50 animate-pulse' : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}>
            <Clock className={`w-5 h-5 ${isUrgent ? 'text-red-500' : 'text-slate-400'}`} />
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
    );
}
