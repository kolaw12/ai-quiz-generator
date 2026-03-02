"use client";

import { validatePasswordStrength } from "@/lib/validators";
import { Check, X } from "lucide-react";

export function PasswordStrength({ password }: { password: string }) {
    const { checks, strength } = validatePasswordStrength(password);

    const getStrengthColor = () => {
        if (strength === 'Strong') return 'bg-emerald-500';
        if (strength === 'Medium') return 'bg-amber-500';
        return 'bg-red-500';
    };

    const getStrengthText = () => {
        if (strength === 'Strong') return 'text-emerald-500';
        if (strength === 'Medium') return 'text-amber-500';
        return 'text-red-500';
    };

    const barCount = strength === 'Strong' ? 3 : strength === 'Medium' ? 2 : 1;

    return (
        <div className="mt-4 p-4 rounded-xl border border-slate-700/50 bg-slate-800/20 font-jakarta text-sm">
            <p className="text-slate-300 font-bold mb-3">Password Requirements:</p>

            <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2">
                    {checks.length ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-red-500" />}
                    <span className={checks.length ? "text-slate-300" : "text-slate-500"}>At least 8 characters</span>
                </li>
                <li className="flex items-center gap-2">
                    {checks.uppercase ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-red-500" />}
                    <span className={checks.uppercase ? "text-slate-300" : "text-slate-500"}>Contains uppercase letter</span>
                </li>
                <li className="flex items-center gap-2">
                    {checks.number ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-red-500" />}
                    <span className={checks.number ? "text-slate-300" : "text-slate-500"}>Contains a number</span>
                </li>
                <li className="flex items-center gap-2">
                    {checks.special ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-red-500" />}
                    <span className={checks.special ? "text-slate-300" : "text-slate-500"}>Contains special character (!@#$%^&*)</span>
                </li>
            </ul>

            <div className="flex items-center gap-3">
                <span className="text-slate-400">Strength:</span>
                <div className="flex-1 flex gap-1 h-2">
                    <div className={`flex-1 rounded-full ${password.length > 0 ? getStrengthColor() : 'bg-slate-700'}`} />
                    <div className={`flex-1 rounded-full ${barCount >= 2 ? getStrengthColor() : 'bg-slate-700'}`} />
                    <div className={`flex-1 rounded-full ${barCount === 3 ? getStrengthColor() : 'bg-slate-700'}`} />
                </div>
                {password.length > 0 && (
                    <span className={`font-bold ${getStrengthText()}`}>{strength}</span>
                )}
            </div>
        </div>
    );
}
