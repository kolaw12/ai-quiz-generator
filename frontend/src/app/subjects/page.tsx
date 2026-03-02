"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

type SimpleSubject = {
    id: string;
    name: string;
    iconText: string;
    totalQs: number;
    color: string;
};

export default function SubjectsPage() {
    const router = useRouter();
    const [subjects, setSubjects] = useState<SimpleSubject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                // Fetch dynamic stats from the backend
                const data = await api.getSubjects();

                // Map to ultra-simplified models for the UX
                const mapped = data.filter((s: Record<string, unknown>) => s.is_available).map((rawSub: Record<string, unknown>) => {
                    const sub = rawSub as { id: string, name: string, total_questions: number };
                    let iconTxt = "📚";
                    let accentColor = "indigo";

                    if (sub.name.toLowerCase().includes('bio')) { iconTxt = "🧬"; accentColor = "emerald"; }
                    if (sub.name.toLowerCase().includes('phy')) { iconTxt = "📐"; accentColor = "rose"; }
                    if (sub.name.toLowerCase().includes('chem')) { iconTxt = "⚗️"; accentColor = "amber"; }
                    if (sub.name.toLowerCase().includes('math')) { iconTxt = "🔢"; accentColor = "blue"; }

                    return {
                        id: sub.id,
                        name: sub.name,
                        iconText: iconTxt,
                        totalQs: sub.total_questions,
                        color: accentColor
                    };
                });
                setSubjects(mapped as SimpleSubject[]);
            } catch (err: unknown) {
                console.error(err);
                // Fallback for offline UX
                setSubjects([
                    { id: 'biology', name: 'Biology', iconText: '🧬', totalQs: 115, color: 'emerald' },
                    { id: 'physics', name: 'Physics', iconText: '📐', totalQs: 89, color: 'rose' },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    const handleSelect = (subjectId: string) => {
        router.push(`/quiz/setup?subject=${subjectId}`);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 py-24">

            <div className="w-full max-w-2xl text-center mb-10">
                <h1 className="text-3xl font-black font-jakarta text-white mb-2">
                    📚 What do you want to practice?
                </h1>
                <p className="text-slate-400 font-medium">Tap a subject to start</p>
            </div>

            {loading ? (
                <div className="w-full max-w-2xl grid grid-cols-2 gap-4">
                    <LoadingSkeleton lines={4} />
                    <LoadingSkeleton lines={4} />
                </div>
            ) : (
                <div className="w-full max-w-2xl grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {subjects.map((sub) => {
                        return (
                            <button
                                key={sub.id}
                                onClick={() => handleSelect(sub.id)}
                                className={`flex flex-col items-center justify-center p-6 bg-slate-900 border-2 border-slate-800 hover:border-${sub.color}-500/50 hover:bg-${sub.color}-500/10 rounded-3xl transition-all active:scale-95 group min-h-[160px] shadow-lg`}
                            >
                                <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">{sub.iconText}</span>
                                <h3 className="text-xl font-bold font-jakarta text-white">{sub.name}</h3>
                                <p className="text-xs text-slate-500 font-bold mt-1">{sub.totalQs} Questions</p>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Custom Syllabus Hook */}
            <div className="w-full max-w-2xl mt-10 text-center">
                <button
                    onClick={() => alert("Upload custom PDF feature coming soon!")}
                    className="w-full py-4 bg-slate-900 border border-slate-800 border-dashed rounded-2xl text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-slate-800 transition-colors font-bold text-sm"
                >
                    📄 Have a custom syllabus? Tap here to upload your PDF
                </button>
            </div>

        </div>
    );
}
