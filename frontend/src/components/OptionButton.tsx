"use client";

import { motion } from "framer-motion";

interface OptionButtonProps {
    letter: string;
    text: string;
    isSelected: boolean;
    isCorrect: boolean | null;
    disabled: boolean;
    onSelect: () => void;
    shakeCondition: boolean;
    revealCorrect: boolean;
}

export function OptionButton({
    letter,
    text,
    isSelected,
    isCorrect,
    disabled,
    onSelect,
    shakeCondition,
    revealCorrect
}: OptionButtonProps) {
    let backgroundColor = "bg-slate-900";
    let borderColor = "border-slate-800";
    let textColor = "text-slate-300";
    let iconBg = "bg-slate-800 text-slate-400";
    const hoverState = !disabled ? "hover:bg-slate-800 hover:border-slate-700" : "";
    let opacity = "opacity-100";

    // When waiting to confirm
    if (isSelected && isCorrect === null) {
        backgroundColor = "bg-indigo-500/10";
        borderColor = "border-indigo-500/50";
        textColor = "text-white font-bold";
        iconBg = "bg-indigo-500 text-white";
    }

    // After confirmation
    if (isCorrect !== null) {
        if (revealCorrect) {
            // This is the correct answer
            backgroundColor = "bg-emerald-500/10";
            borderColor = "border-emerald-500";
            textColor = "text-emerald-50 font-bold";
            iconBg = "bg-emerald-500 text-white";
            opacity = "opacity-100 ring-2 ring-emerald-500/30";
        } else if (isSelected && !isCorrect) {
            // Selected but wrong
            backgroundColor = "bg-rose-500/10";
            borderColor = "border-rose-500";
            textColor = "text-rose-50 font-bold";
            iconBg = "bg-rose-500 text-white";
            opacity = "opacity-100";
        } else {
            // Unselected and wrong (fade out)
            opacity = "opacity-40";
        }
    }

    return (
        <motion.button
            animate={shakeCondition ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            onClick={onSelect}
            disabled={disabled}
            className={`w-full text-left flex items-center p-4 rounded-2xl border-2 transition-all ${backgroundColor} ${borderColor} ${hoverState} ${opacity}`}
            style={{ touchAction: 'manipulation' }} // Prevents double-tap zoom on phones
        >
            <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg mr-4 shadow-sm transition-colors ${iconBg}`}>
                {letter}
            </div>
            <div className={`text-lg leading-snug ${textColor}`}>
                {text}
            </div>
        </motion.button>
    );
}
