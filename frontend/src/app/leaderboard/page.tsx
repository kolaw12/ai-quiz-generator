import Navbar from "@/components/Navbar";
import { LeaderboardRow } from "@/components/LeaderboardRow";
import { Trophy, Shield } from "lucide-react";
import Footer from "@/components/Footer";

export default function LeaderboardPage() {
    const users = [
        { name: "Adaeze O.", score: 15400, streak: 34 },
        { name: "Chinedu M.", score: 14250, streak: 28 },
        { name: "Tolu A.", score: 13900, streak: 45 },
        { name: "Moses A.", score: 12100, streak: 5, isUser: true },
        { name: "Zainab B.", score: 11800, streak: 12 },
        { name: "Emeka U.", score: 10450, streak: 8 },
        { name: "Femi K.", score: 9800, streak: 21 },
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-28 max-w-4xl">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 rounded-full mb-6 relative">
                        <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full" />
                        <Trophy className="w-12 h-12 text-amber-400 relative z-10" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black font-jakarta text-white mb-4">Top Scholars</h1>
                    <p className="text-slate-400 text-lg">Compare your rank globally against thousands of Jambites.</p>
                </div>

                <div className="glass-card p-6 border-slate-700 bg-slate-900 border space-y-4">

                    <div className="flex justify-between items-center pb-4 border-b border-slate-800 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Global Rank</span>
                        <span>Current Status</span>
                    </div>

                    <div className="space-y-3">
                        {users.map((u, i) => (
                            <div key={i}>
                                <LeaderboardRow rank={i + 1} name={u.name} score={u.score} streak={u.streak} isUser={u.isUser} />
                            </div>
                        ))}
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
