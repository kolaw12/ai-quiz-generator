export type Question = {
    id: number | string;
    type: "multiple_choice";
    question: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
    };
    correct_answer?: string; // Optional on frontend to prevent cheating
    explanation?: string;
    subject?: string;
};

export type QuizSession = {
    sessionId: string;
    subject: string;
    totalQuestions: number;
    firstQuestion: Question;
};

export type SubjectInfo = {
    id: string;
    name: string;
    icon: string;
    color: string;
    total_questions: number;
    description: string;
    is_available: boolean;
};

export type AnswerEvaluation = {
    correct: boolean;
    xpEarned: number;
    correct_answer?: string;
};

export type UserStats = {
    xp: number;
    level: number;
    levelName: string;
    streak: number;
    streakActive: boolean;
    quizzesTaken: number;
    averageScore: number;
};

export type LeaderboardUser = {
    id: string;
    rank: number;
    name: string;
    score: number;
    streak: number;
    avatarSeed: string; // Used for DiceBear avatar generation
};

export type Bookmark = {
    id: string;
    subject: string;
    question_text: string;
    correct_answer: string;
    date_added: string;
};
