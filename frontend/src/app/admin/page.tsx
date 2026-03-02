"use client";

import { useEffect, useState } from "react";
import { Users, Activity, Target, ShieldAlert, Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

type AdminStats = {
    total_users: number;
    total_quizzes_taken: number;
    daily_active_users: number;
    recent_blocked_threats: number;
};

export default function AdminPage() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                // NextJS proxy handles the auth_token cookie transmission
                const res = await axios.get("/api/admin/stats");
                setStats(res.data);
            } catch (err: any) {
                console.error("Stats Error:", err.response?.data);
                toast.error("Failed to load admin telemetry");
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-32">
                <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black font-jakarta text-white">System Telemetry</h1>
                <p className="text-slate-400 mt-2">View real-time aggregated system constraints and events.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Stat Cards */}
                <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <p className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-1">Global Accounts</p>
                            <h3 className="text-4xl font-black text-white">{stats.total_users.toLocaleString()}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <Users className="w-6 h-6 text-emerald-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-primary-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-primary-500/40 transition-colors">
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <p className="text-sm font-bold text-primary-400 uppercase tracking-wider mb-1">Total Quizzes Evaluated</p>
                            <h3 className="text-4xl font-black text-white">{stats.total_quizzes_taken.toLocaleString()}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                            <Target className="w-6 h-6 text-primary-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-blue-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/40 transition-colors">
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <p className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-1">Daily Active Participants</p>
                            <h3 className="text-4xl font-black text-white">{stats.daily_active_users.toLocaleString()}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Activity className="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-rose-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-rose-500/40 transition-colors">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50" />
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <p className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-1">Threats Mitigated (24h)</p>
                            <h3 className="text-4xl font-black text-rose-100 flex items-baseline gap-2">
                                {stats.recent_blocked_threats.toLocaleString()}
                                <span className="text-sm font-normal text-rose-500">bots halted</span>
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
                            <ShieldAlert className="w-6 h-6 text-rose-500" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
