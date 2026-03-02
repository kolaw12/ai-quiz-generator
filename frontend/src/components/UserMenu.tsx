"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { ChevronDown, Home, BarChart2, Bookmark, Settings, LogOut } from "lucide-react";

export function UserMenu({ user }: { user: User }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { logout } = useAuth();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 pr-3.5 bg-slate-900 border border-slate-800 rounded-full hover:bg-slate-800 transition-colors"
            >
                <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-indigo-500/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`} alt="Avatar" />
                </div>
                <span className="text-sm font-bold text-white max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden py-2 z-50 animate-in fade-in slide-in-from-top-2">

                    <div className="px-5 py-3 border-b border-slate-800/50 bg-slate-950/50">
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                        <p className="text-xs font-bold text-indigo-400 mt-0.5 tracking-wider uppercase">Level {user.level} • {user.xp} XP</p>
                    </div>

                    <div className="py-2">
                        <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                            <Home className="w-4 h-4" /> <span className="text-sm font-bold">Home</span>
                        </Link>
                        <Link href="/progress" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                            <BarChart2 className="w-4 h-4" /> <span className="text-sm font-bold">My Progress</span>
                        </Link>
                        <Link href="/bookmarks" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                            <Bookmark className="w-4 h-4" /> <span className="text-sm font-bold">Saved Questions</span>
                        </Link>
                        <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                            <Settings className="w-4 h-4" /> <span className="text-sm font-bold">Settings</span>
                        </Link>
                    </div>

                    <div className="py-2 border-t border-slate-800/50">
                        <button
                            onClick={() => { setIsOpen(false); logout(); }}
                            className="w-full flex items-center gap-3 px-5 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                        >
                            <LogOut className="w-4 h-4" /> <span className="text-sm font-bold">Log Out</span>
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}
