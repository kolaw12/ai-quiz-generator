import Navbar from "@/components/Navbar";
import { Bookmark, Inbox } from "lucide-react";

export default function BookmarksPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-28 max-w-3xl flex flex-col items-center justify-center">

                <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-6">
                    <Bookmark className="w-10 h-10 text-primary-400" />
                </div>

                <h1 className="text-3xl font-black font-jakarta text-white mb-3 text-center">Your Saved Questions</h1>
                <p className="text-slate-400 mb-8 text-center">You haven't bookmarked any tough questions yet.</p>

                <div className="w-full glass-card border-dashed border-2 border-slate-700 p-12 text-center bg-slate-900/50 hover:bg-slate-800/50 transition">
                    <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-400">Box is empty</h3>
                    <p className="text-slate-500 font-medium mt-2">When you see the 📌 icon during a quiz, click it to save here for quick review!</p>
                </div>

            </main>
        </div>
    );
}
