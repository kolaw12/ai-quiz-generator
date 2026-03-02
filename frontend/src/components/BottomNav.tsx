"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, BarChart2, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function BottomNav() {
    const pathname = usePathname();
    const { user, isLoading } = useAuth();

    // Hide entirely on landing page, auth pages, and quiz active page
    if (isLoading || !user || pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/quiz' || pathname === '/forgot-password') {
        return null;
    }

    const navItems = [
        { name: "Home", href: "/dashboard", icon: Home },
        { name: "Quiz", href: "/subjects", icon: BookOpen },
        { name: "Progress", href: "/progress", icon: BarChart2 },
        { name: "Me", href: "/profile", icon: User }
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 z-50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? "text-indigo-400" : "text-slate-500 hover:text-slate-300 transition-colors"
                                }`}
                        >
                            <item.icon className={`w-6 h-6 ${isActive ? "fill-indigo-400/20" : ""}`} />
                            <span className="text-[10px] font-bold tracking-wider">{item.name}</span>
                            {/* Dot indicator */}
                            <div className={`w-1 h-1 rounded-full mt-0.5 ${isActive ? "bg-indigo-400" : "bg-transparent"}`} />
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
