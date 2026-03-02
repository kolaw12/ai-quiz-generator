import { Clock } from "lucide-react";

export function RecentQuizzes() {
    const quizzes = [
        { title: "Plant Nutrition", score: 90, icon: "🌱", time: "2 hours ago" },
        { title: "Cell Theory", score: 65, icon: "🔬", time: "Yesterday" },
        { title: "Vertebrates", score: 100, icon: "🐒", time: "2 days ago" },
        { title: "Basic Chemistry", score: 40, icon: "⚗️", time: "3 days ago" },
    ];

    return (
        <div className="space-y-4">
            {quizzes.map((q, idx) => (
                <div key={idx} className="glass p-4 rounded-2xl flex items-center justify-between hover:bg-slate-800/50 transition-colors cursor-pointer border-transparent hover:border-slate-700 group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                            {q.icon}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-200">{q.title}</h4>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {q.time}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        {q.score >= 80 ? (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg font-bold">
                                {q.score}%
                            </span>
                        ) : q.score >= 50 ? (
                            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-lg font-bold">
                                {q.score}%
                            </span>
                        ) : (
                            <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-lg font-bold">
                                {q.score}%
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
