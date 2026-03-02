import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

export function SubjectCard({
    title,
    icon,
    color,
    progress,
    totalQuizzes,
    locked = false,
    suggestedTopics = []
}: {
    title: string,
    icon: string,
    color: string,
    progress: number,
    totalQuizzes: number,
    locked?: boolean,
    suggestedTopics?: string[]
}) {
    return (
        <Link
            href={locked ? "#" : `/quiz/setup?subject=${title.toLowerCase()}`}
            className={`glass-card p-6 block relative overflow-hidden transition-all group ${locked ? 'opacity-70 grayscale cursor-not-allowed' : 'hover:-translate-y-2'}`}
        >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 blur-3xl rounded-full`} />

            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-3xl shadow-lg shadow-black/20 font-bold`}>
                        {icon}
                    </div>
                </div>
                {locked ? (
                    <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-full border border-slate-700 font-bold uppercase tracking-wider">Coming Soon</span>
                ) : (
                    <div className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-1.5 text-xs font-bold font-jakarta">
                        <FileText className="w-3 h-3 text-slate-400" /> {totalQuizzes} Tests
                    </div>
                )}
            </div>

            <h3 className="text-xl font-black text-white mb-2 group-hover:text-primary-400 transition-colors uppercase tracking-wide">{title}</h3>

            <div className="mt-4 mb-4">
                <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-400">Mastery</span>
                    <span className={progress >= 80 ? 'text-emerald-400' : progress >= 50 ? 'text-amber-400' : 'text-slate-400'}>{progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${progress >= 80 ? 'bg-emerald-500' : progress >= 50 ? 'bg-amber-500' : 'bg-slate-500'}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {suggestedTopics && suggestedTopics.length > 0 && !locked && (
                <div className="mt-4 border-t border-slate-800/50 pt-4">
                    <p className="text-xs text-slate-500 font-bold mb-2 uppercase tracking-wider">Suggested Topics</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedTopics.map((topic, i) => (
                            <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700 group-hover:border-slate-600 transition-colors">
                                {topic}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-end mt-4">
                {!locked && <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />}
            </div>
        </Link>
    );
}
