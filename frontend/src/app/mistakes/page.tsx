import Navbar from "@/components/Navbar";
import { AlertTriangle, TrendingUp } from "lucide-react";

export default function MistakesPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-28 max-w-5xl">
                <div className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black font-jakarta text-white mb-3 flex items-center gap-3">
                            <AlertTriangle className="text-accent-500 w-8 h-8" />
                            Mistakes Review
                        </h1>
                        <p className="text-slate-400 font-medium">Turn what you got wrong into your greatest strengths.</p>
                    </div>

                    <button className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 px-6 rounded-xl transition flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" /> Train Weaknesses
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Example Mistake Entry */}
                    <div className="glass-card p-6 border-slate-800 border-l-[6px] border-l-red-500 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide">Biology</span>
                            <span className="text-slate-500 text-xs font-bold font-jakarta">2 Days Ago</span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-4 leading-relaxed">
                            The process by which energy is released from food molecules in the absence of oxygen is known as:
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
                                <p className="text-xs text-red-500/70 font-bold uppercase tracking-widest mb-1">Your Answer</p>
                                <p className="font-bold text-red-400 line-through">Aerobic Respiration</p>
                            </div>
                            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl relative">
                                <p className="text-xs text-emerald-500/70 font-bold uppercase tracking-widest mb-1">Correct Answer</p>
                                <p className="font-bold text-emerald-400">Anaerobic Respiration</p>
                                <div className="absolute top-0 right-0 p-4 bg-emerald-500 rounded-bl-3xl rounded-tr-xl opacity-20 w-12 h-12" />
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl text-slate-300 font-medium text-sm leading-relaxed">
                            <strong className="text-primary-400">AI Explanation:</strong> Aerobic requires oxygen. The prefix "An-" means without, therefore Anaerobic represents processes operating without oxygen.
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
