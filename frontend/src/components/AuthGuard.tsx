"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // If we've finished checking AND the user isn't logged in, redirect them
        if (!isLoading && !isAuthenticated) {
            // Save where they were trying to go so we can bounce them back later (optional)
            const returnUrl = encodeURIComponent(pathname);
            router.push(`/login?returnUrl=${returnUrl}`);
        }
    }, [isLoading, isAuthenticated, router, pathname]);

    // While checking the token, show a blocking loader so protected content doesn't flash
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                <p className="text-slate-400 font-medium font-jakarta animate-pulse">
                    Authenticating securely...
                </p>
            </div>
        );
    }

    // If we aren't loading, but we aren't authenticated, the useEffect is currently redirecting
    // Return nothing to prevent flashing secret components
    if (!isAuthenticated) return null;

    // We are secure! Render the private dashboard/quiz
    return <>{children}</>;
}
