"use client";

import { useState } from "react";
import { Question, QuizSession } from "@/types";
import { api } from "@/lib/api";

export function useQuiz(initialSession: QuizSession, initialCount: number) {
    const [sessionId, setSessionId] = useState<string | null>(initialSession.sessionId);
    const [questions, setQuestions] = useState<Question[]>([initialSession.firstQuestion]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [loadingFeedback, setLoadingFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [explanation, setExplanation] = useState<string>("");
    const [finished, setFinished] = useState(false);
    const [loading, setLoading] = useState(false); // No initial load needed
    const [error, setError] = useState<string | null>(null);

    // Gamification triggers
    const [showXP, setShowXP] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [shakeWrong, setShakeWrong] = useState(false);

    // No initQuiz needed! initialSession has it.

    const currentQ = questions[currentIndex];
    const progress = ((currentIndex) / initialCount) * 100;

    const handleOptionSelect = (optionKey: string) => {
        if (showFeedback || finished || !sessionId || !currentQ || loadingFeedback) return;
        setSelectedOption(optionKey);
    };

    const submitAnswer = async () => {
        if (!selectedOption || showFeedback || finished || !sessionId || !currentQ) return;

        setLoadingFeedback(true);

        try {
            // Parallel requests: submit answer AND get explanation
            const [answerRes, explanationRes] = await Promise.all([
                api.submitAnswer(sessionId, currentQ.id as string, selectedOption),
                api.getExplanation(sessionId, currentQ.id as string)
            ]);

            setIsCorrect(answerRes.correct);
            setExplanation(explanationRes);

            if (answerRes.correct) {
                setScore(prev => prev + 1);
                setStreak(prev => prev + 1);
                setShowConfetti(true);
                setShowXP(true);
            } else {
                setStreak(0);
                setShakeWrong(true);
            }
        } catch (err) {
            console.error(err);
            // Fallback
            const correct = selectedOption === currentQ.correct_answer;
            setIsCorrect(correct);
            setExplanation("Could not fetch full AI explanation due to a network error.");
            if (correct) {
                setScore(prev => prev + 1);
                setStreak(prev => prev + 1);
                setShowConfetti(true);
                setShowXP(true);
            } else {
                setStreak(0);
                setShakeWrong(true);
            }
        } finally {
            setShowFeedback(true);
            setLoadingFeedback(false);

            // Reset triggers after animation
            setTimeout(() => {
                setShowConfetti(false);
                setShowXP(false);
                setShakeWrong(false);
            }, 2000);
        }
    };

    const handleNext = async () => {
        setShowFeedback(false);
        setSelectedOption(null);
        setIsCorrect(null);
        setExplanation("");

        if (currentIndex + 1 < initialCount) {
            try {
                // Fetch the next question
                const nextQ = await api.getQuestion(sessionId!, currentIndex + 1);
                setQuestions(prev => [...prev, nextQ]);
                setCurrentIndex(prev => prev + 1);
            } catch (err) {
                console.error("Failed to load next question", err);
            }
        } else {
            setFinished(true);
        }
    };

    return {
        questions,
        currentIndex,
        currentQ,
        score,
        streak,
        progress,
        selectedOption,
        showFeedback,
        loadingFeedback,
        isCorrect,
        explanation,
        finished,
        showXP,
        showConfetti,
        shakeWrong,
        loading,
        error,
        handleOptionSelect,
        submitAnswer,
        handleNext,
        sessionId
    };
}
