import { Flame } from "lucide-react";

export function LeaderboardRow({ rank, name, score, streak, isUser = false }: { rank: number, name: string, score: number, streak: number, isUser?: boolean }) {

    const getRankBadge = (r: number) => {
        switch (r) {
            case 1: return <div className="w-8 h-8 rounded-full bg-amber-400 text-white flex items-center justify-center font-bold text-sm shadow-[0_0_15px_-3px_#fbbf24]">1</div>;
            case 2: return <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-800 flex items-center justify-center font-bold text-sm shadow-lg">2</div>;
            case 3: return <div className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-sm shadow-lg">3</div>;
            default: return <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center font-bold text-sm">{r}</div>;
        }
    };

    return (
        <div className={`p-4 rounded-2xl flex items-center justify-between transition-colors ${isUser ? 'bg-primary-500/10 border border-primary-500/50 relative overflow-hidden' : 'glass hover:bg-slate-800/50 border border-transparent hover:border-slate-700'}`}>

            {isUser && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />}

            <div className="flex items-center gap-4">
                {getRankBadge(rank)}
                <div className="w-10 h-10 rounded-xl bg-slate-800 overflow-hidden border border-slate-700 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`} alt={name} className="w-full h-full object-cover" />
                </div>
                <h4 className={`font-bold ${isUser ? 'text-primary-400' : 'text-slate-200'}`}>
                    {name} {isUser && "(You)"}
                </h4>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 text-orange-400 bg-orange-500/10 px-2 py-1 rounded-lg">
                    <Flame className="w-4 h-4 fill-current" /> <span className="font-bold text-sm">{streak}</span>
                </div>
                <div className="text-right">
                    <p className="text-white font-black">{score.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 font-bold tracking-wider uppercase">XP</p>
                </div>
            </div>

        </div>
    );
}
