import { Share2, Twitter, MessageCircle } from "lucide-react";

export function ShareCard({ score, total }: { score: number, total: number }) {
    const percentage = Math.round((score / total) * 100);

    return (
        <div className="glass-card p-6 border-slate-700 flex flex-col md:flex-row items-center gap-6 justify-between bg-gradient-to-r from-slate-900 to-slate-800">

            <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
                    <Share2 className="w-5 h-5 text-primary-400" /> Share Your Score
                </h3>
                <p className="text-slate-400 font-medium text-sm">Challenge your friends. Let them know you scored {percentage}%!</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#25D366]/20">
                    <MessageCircle className="w-5 h-5" /> WhatsApp
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1DA1F2] hover:bg-[#0c85d0] text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#1DA1F2]/20">
                    <Twitter className="w-5 h-5 fill-current" /> Twitter
                </button>
            </div>

        </div>
    );
}
