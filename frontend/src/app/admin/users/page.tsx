"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, Trash2, ShieldOff, CheckCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type AdminUser = {
    id: string;
    name: string;
    email: string;
    role: string;
    xp: number;
    level: number;
    streak: number;
};

export default function AdminUsersPage() {
    const { user } = useAuth();
    const [usersList, setUsersList] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("/api/admin/users");
            setUsersList(res.data);
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSuspendToggle = async (id: string, currentRole: string) => {
        if (!confirm(`Are you sure you want to toggle suspension for this user?`)) return;

        try {
            await axios.put(`/api/admin/users/${id}/suspend`);
            toast.success("User access modified successfully");
            fetchUsers(); // Deep refresh rows
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Failed to modify user access");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("CRITICAL WARNING: This completely shreds the user and their history from the DB permanently. Proceed?")) return;

        try {
            await axios.delete(`/api/admin/users/${id}`);
            toast.success("User expunged from database");
            setUsersList((prev) => prev.filter(u => u.id !== id));
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Failed to delete user");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-32">
                <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black font-jakarta text-white">Identity Access Management</h1>
                <p className="text-slate-400 mt-2">Enforce constraints and review global registrants.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/50 border-b border-slate-800">
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-left">Identity</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">State</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Score</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {usersList.map((u) => {
                                const isSelf = u.id === user?.id;
                                const isSuspended = u.role === "suspended";
                                const isAdmin = u.role === "admin";

                                return (
                                    <tr key={u.id} className={`hover:bg-slate-800/30 transition-colors ${isSuspended ? 'opacity-60' : ''}`}>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white flex items-center gap-2">
                                                    {u.name}
                                                    {isSelf && <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/30">YOU</span>}
                                                    {isAdmin && !isSelf && <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full border border-rose-500/30">ADMIN</span>}
                                                </span>
                                                <span className="text-xs text-slate-500">{u.email}</span>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            {isSuspended ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                    <AlertTriangle className="w-3 h-3" /> Suspended
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                    <CheckCircle className="w-3 h-3" /> Active
                                                </span>
                                            )}
                                        </td>

                                        <td className="p-4 text-center">
                                            <span className="text-xs font-bold text-slate-300">Lvl {u.level}</span>
                                        </td>

                                        <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                            <button
                                                disabled={isAdmin}
                                                onClick={() => handleSuspendToggle(u.id, u.role)}
                                                className={`p-2 rounded-lg transition-colors ${isAdmin
                                                        ? "text-slate-600 bg-slate-900 cursor-not-allowed"
                                                        : isSuspended
                                                            ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                                                            : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                                                    }`}
                                                title={isSuspended ? "Reinstate User" : "Suspend User"}
                                            >
                                                {isSuspended ? <CheckCircle className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                                            </button>

                                            <button
                                                disabled={isAdmin}
                                                onClick={() => handleDelete(u.id)}
                                                className={`p-2 rounded-lg transition-colors ${isAdmin
                                                        ? "text-slate-600 bg-slate-900 cursor-not-allowed"
                                                        : "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20"
                                                    }`}
                                                title="Delete Permanently"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {usersList.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        No users found in database.
                    </div>
                )}
            </div>
        </div>
    );
}
