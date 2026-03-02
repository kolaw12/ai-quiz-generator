"use client";

import React, { createContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// ─── User Type (exported for use everywhere) ───
export type User = {
    id: string;
    name: string;
    email: string;
    xp: number;
    level: number;
    streak: number;
    role: string;
};

// ─── Context Shape ───
type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    login: async () => false,
    signup: async () => false,
    logout: async () => { },
    refreshUser: async () => { },
    updateProfile: async () => { },
});

// ─── Provider ───
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Fetch current user from the HttpOnly cookie via Next.js proxy
    const fetchUser = useCallback(async () => {
        try {
            const res = await fetch("/api/auth/me", { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
                if (res.status === 401) {
                    // Stale or missing cookie, ensure we clear any bad state
                    await fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => { });
                }
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Run once on mount to restore session from cookie
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // ─── Login ───
    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || data.error || "Invalid email or password");
            }

            // Immediately set the user from the response — no second fetch needed!
            setUser(data.user);
            toast.success(`Welcome back, ${data.user.name}!`);
            return true;
        } catch (err: unknown) {
            const error = err instanceof Error ? err : new Error("Login failed");
            toast.error(error.message);
            throw error; // Re-throw to handle localized errors in login form (like 429 lockouts)
        }
    };

    // ─── Signup ───
    const signup = async (name: string, email: string, password: string): Promise<boolean> => {
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || data.error || "Registration failed");
            }

            // Immediately set the user — Navbar updates INSTANTLY
            setUser(data.user);
            toast.success(`Welcome, ${data.user.name}! Account created.`);
            return true;
        } catch (err: unknown) {
            const error = err instanceof Error ? err : new Error("Registration failed");
            toast.error(error.message);
            throw error;
        }
    };

    // ─── Logout ───
    const logout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
            setUser(null);
            toast.success("Logged out successfully");
            router.push("/");
        } catch (error) {
            console.error("Logout error:", error);
            // Force clear even if API fails
            setUser(null);
            router.push("/");
        }
    };

    // ─── Update Profile ───
    const updateProfile = async (data: Partial<User>) => {
        try {
            const res = await fetch("/api/auth/me", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            });

            const resData = await res.json();

            if (!res.ok) {
                throw new Error(resData.detail || resData.error || "Failed to update profile");
            }

            setUser(resData.user);
        } catch (error) {
            console.error("Update profile error:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                signup,
                logout,
                refreshUser: fetchUser,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
