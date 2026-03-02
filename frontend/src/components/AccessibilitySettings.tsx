"use client";

import { Settings2, Moon, Sun, Type, Volume2, Sparkles, Languages } from "lucide-react";
import { useState } from "react";

export function AccessibilitySettings() {
    const [textSize, setTextSize] = useState("normal");
    const [readAloud, setReadAloud] = useState(false);
    const [animations, setAnimations] = useState(true);
    const [language, setLanguage] = useState("english");

    // In a real app these states would be wired to Contexts or Zustand and trigger global layout re-renders.

    return (
        <div className="w-full bg-slate-900 border-2 border-slate-800 rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800/50 pb-4">
                <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-full flex flex-col justify-center items-center">
                    <Settings2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-jakarta text-white">⚙️ Make It Your Way</h3>
            </div>

            <div className="space-y-8">
                {/* Text Size */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">
                        <Type className="w-4 h-4" /> Text Size
                    </label>
                    <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
                        {['small', 'normal', 'big', 'huge'].map((size) => (
                            <button
                                key={size}
                                onClick={() => setTextSize(size)}
                                className={`flex-1 py-3 rounded-xl flex justify-center items-center gap-1 font-bold text-sm transition-all ${textSize === size
                                    ? "bg-slate-800 text-white shadow-lg border border-slate-700"
                                    : "text-slate-500 hover:text-slate-300"
                                    }`}
                            >
                                <span className={
                                    size === 'small' ? 'text-xs' :
                                        size === 'normal' ? 'text-sm' :
                                            size === 'big' ? 'text-lg' : 'text-xl font-black'
                                }>A</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dark Mode */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">
                        <Moon className="w-4 h-4" /> Dark Mode
                    </label>
                    <div className="flex gap-4">
                        <button
                            onClick={() => alert('Light mode is coming soon! 😎')}
                            className="flex-1 py-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl flex items-center justify-center gap-2 text-slate-400 font-bold transition-colors active:scale-95"
                        >
                            <Sun className="w-5 h-5" /> Light
                        </button>
                        <button
                            className="flex-1 py-4 bg-indigo-500/20 border-2 border-indigo-500 rounded-2xl flex items-center justify-center gap-2 text-indigo-400 font-bold shadow-[0_0_20px_rgba(79,70,229,0.2)]"
                        >
                            <Moon className="w-5 h-5" fill="currentColor" /> Dark
                        </button>
                    </div>
                </div>

                {/* Toggles */}
                <div className="space-y-4 pt-4 border-t border-slate-800/50">

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-white flex items-center gap-2"><Volume2 className="w-4 h-4 text-indigo-400" /> Read Out Loud</p>
                            <p className="text-xs text-slate-500 font-bold mt-1">AI reads questions aloud</p>
                        </div>
                        <button
                            onClick={() => setReadAloud(!readAloud)}
                            className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 ${readAloud ? 'bg-emerald-500' : 'bg-slate-800'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full transition-transform ${readAloud ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-400" /> Fancy Animations</p>
                            <p className="text-xs text-slate-500 font-bold mt-1">Turn off if phone is slow</p>
                        </div>
                        <button
                            onClick={() => setAnimations(!animations)}
                            className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 ${animations ? 'bg-amber-500' : 'bg-slate-800'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full transition-transform ${animations ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div>
                            <p className="font-bold text-white flex items-center gap-2"><Languages className="w-4 h-4 text-rose-400" /> Language Mode</p>
                            <p className="text-xs text-slate-500 font-bold mt-1">For AI explanations</p>
                        </div>
                        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                            <button
                                onClick={() => setLanguage('english')}
                                className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors ${language === 'english' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            >ENG</button>
                            <button
                                onClick={() => alert('Pidgin AI support coming in V2! 🇳🇬')}
                                className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors ${language === 'pidgin' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            >PIDGIN</button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
