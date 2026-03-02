"use client";

import { useAuth } from "@/hooks/useAuth";
import { ShieldAlert, Users, UploadCloud, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && user?.role !== "admin") {
            router.replace("/dashboard");
        }
    }, [isLoading, user, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col pt-24 items-center px-4">
                <LoadingSkeleton lines={8} />
            </div>
        );
    }

    if (user.role !== "admin") {
        return null; // Prevents flashing before redirect
    }

    const navigation = [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "Manage Users", href: "/admin/users", icon: Users },
        { name: "RAG Uploader", href: "/admin/upload", icon: UploadCloud },
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row pt-24 px-4 container mx-auto gap-8 pb-10">
            {/* Admin Sidebar */}
            <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
                <div>
                    <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase flex items-center gap-2 mb-4">
                        <ShieldAlert className="w-4 h-4 text-rose-500" />
                        Admin Console
                    </h2>

                    <nav className="flex flex-col gap-2">
                        {navigation.map((item) => {
                            const active = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${active
                                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                            : "text-slate-400 border border-transparent hover:bg-slate-900 hover:text-slate-200"
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 ${active ? "text-rose-400" : ""}`} />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="mt-auto bg-slate-900/50 rounded-xl p-4 border border-rose-500/20">
                    <p className="text-xs text-rose-400 font-bold mb-1">System Warning</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                        You hold destructive privileges. Actions performed here immediately affect the production database.
                    </p>
                </div>
            </aside>

            {/* Main Content Pane */}
            <main className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                {children}
            </main>
        </div>
    );
}
