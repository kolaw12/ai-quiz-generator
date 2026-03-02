"use client";

import { useEffect, useState } from "react";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export function ScoreCircle({ percentage, label }: { percentage: number; label?: string }) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setValue(percentage);
        }, 500);
        return () => clearTimeout(timer);
    }, [percentage]);

    const getColor = (v: number) => {
        if (v >= 80) return "#4CAF50"; // Emerald
        if (v >= 50) return "#FFC107"; // Amber
        return "#FF5252"; // Red
    };

    return (
        <div className="w-48 h-48 mx-auto relative">
            <CircularProgressbarWithChildren
                value={value}
                styles={buildStyles({
                    pathColor: getColor(value),
                    trailColor: "#1E293B", // slate-800
                    strokeLinecap: "round",
                    pathTransitionDuration: 2,
                })}
            >
                <div className="flex flex-col items-center justify-center text-center mt-2">
                    <span className="text-5xl font-black text-white">{Math.round(value)}<span className="text-2xl text-slate-400">%</span></span>
                    {label && <span className="text-slate-400 font-medium text-sm mt-1 uppercase tracking-widest">{label}</span>}
                </div>
            </CircularProgressbarWithChildren>
        </div>
    );
}
