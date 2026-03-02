"use client";

import { Share2 } from "lucide-react";
import toast from "react-hot-toast";

export function ShareScore({ score, total, topic }: { score: number, total: number, topic: string }) {

    const handleShare = async () => {
        const textToShare = `I just scored ${score}/${total} on my JAMB ${topic} quiz using JAMB Quiz Master! 🧠✨ Can you beat my score?`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My JAMB Quiz Score',
                    text: textToShare,
                    url: window.location.origin
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback for desktop/unsupported browsers
            navigator.clipboard.writeText(`${textToShare} ${window.location.origin}`);
            toast.success("Score copied to clipboard! 📋");
        }
    };

    return (
        <button
            onClick={handleShare}
            className="w-full py-5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-bold text-lg rounded-2xl flex items-center justify-center gap-3 transition-colors border border-[#25D366]/20 mb-4"
        >
            <Share2 className="w-6 h-6" /> Share My Score (Show your friends! 😎)
        </button>
    );
}
