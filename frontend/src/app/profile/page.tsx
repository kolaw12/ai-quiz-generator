"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Settings, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AccessibilitySettings } from "@/components/AccessibilitySettings";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function ProfilePage() {
    const { user, logout, updateProfile, isLoading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");

    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col pt-24 px-4 pb-24">
                <Navbar />
                <div className="max-w-md mx-auto w-full space-y-6">
                    <LoadingSkeleton lines={2} />
                    <LoadingSkeleton lines={5} />
                </div>
            </div>
        );
    }

    const handleSaveProfile = async () => {
        if (!editName.trim()) return;
        try {
            await updateProfile({ name: editName });
            setIsEditing(false);
            toast.success("Name updated successfully! 🎉");
        } catch (error) {
            toast.error("Couldn't update your name. Try again! 🤔");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col pb-24">
            <Navbar />

            <main className="flex-grow flex flex-col items-center justify-start pt-24 px-4 w-full max-w-lg mx-auto space-y-8">

                {/* Header ID Card */}
                <div className="w-full bg-slate-900 border-2 border-slate-800 rounded-[2rem] p-8 text-center shadow-xl relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="w-24 h-24 mx-auto bg-indigo-500/20 rounded-full flex items-center justify-center border-4 border-slate-950 relative z-10 mb-4 shadow-xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`}
                            alt="Avatar"
                            className="w-full h-full rounded-full"
                        />
                    </div>

                    {!isEditing ? (
                        <>
                            <h1 className="text-3xl font-black font-jakarta text-white truncate max-w-[200px] mx-auto">{user.name}</h1>
                            <p className="text-slate-400 font-bold mb-4">{user.email}</p>

                            <button
                                onClick={() => { setIsEditing(true); setEditName(user.name); }}
                                className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl transition-colors active:scale-95"
                            >
                                Edit Name ✍️
                            </button>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <input
                                autoFocus
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full bg-slate-950 border-2 border-indigo-500 rounded-xl px-4 py-3 text-white text-center font-bold focus:outline-none"
                            />
                            <div className="flex gap-2 justify-center">
                                <button onClick={() => setIsEditing(false)} className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold">Cancel</button>
                                <button onClick={handleSaveProfile} className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold">Save</button>
                            </div>
                        </div>
                    )}

                </div>

                {/* Account Settings List */}
                <div className="w-full space-y-4">
                    <h3 className="text-slate-500 font-bold uppercase tracking-widest text-sm pl-4">Account</h3>

                    <button
                        onClick={() => { setIsEditing(true); setEditName(user.name); }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-800 transition-colors active:scale-95 group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex flex-col justify-center items-center text-indigo-400 group-hover:bg-indigo-500/20 transition-colors"><UserIcon className="w-5 h-5" /></div>
                            <span className="font-bold text-white text-lg">My Details</span>
                        </div>
                        <span className="text-slate-500">›</span>
                    </button>

                    <button
                        onClick={() => toast("Notification preferences coming soon!", { icon: "🔔" })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-800 transition-colors active:scale-95 group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-amber-500/10 rounded-full flex flex-col justify-center items-center text-amber-500 group-hover:bg-amber-500/20 transition-colors"><Settings className="w-5 h-5" /></div>
                            <span className="font-bold text-white text-lg">Notifications</span>
                        </div>
                        <span className="text-slate-500">›</span>
                    </button>
                </div>

                <AccessibilitySettings />

                <div className="w-full pt-4">
                    <button
                        onClick={() => logout()}
                        className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-black text-lg py-5 rounded-2xl flex items-center justify-center gap-3 transition-colors active:scale-95 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]"
                    >
                        <LogOut className="w-6 h-6" /> END SESSION (LOG OUT)
                    </button>
                    <p className="text-center text-slate-500 font-bold text-xs mt-6">Version 1.0.0 (Offline Ready)</p>
                </div>

            </main>

            <BottomNav />
        </div>
    );
}
