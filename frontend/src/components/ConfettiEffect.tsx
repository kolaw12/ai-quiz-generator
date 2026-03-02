"use client";

import Confetti from "react-confetti";
import { useState } from "react";

export function ConfettiEffect({ active }: { active: boolean }) {
    const [windowDimension] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
    });

    if (!active) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            <Confetti
                width={windowDimension.width}
                height={windowDimension.height}
                recycle={false}
                numberOfPieces={300}
                gravity={0.3}
                initialVelocityY={20}
                colors={['#6C63FF', '#00C9A7', '#FF6B6B', '#FFC107', '#4CAF50']}
            />
        </div>
    );
}
