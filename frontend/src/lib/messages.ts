"use client";

// frontend/src/lib/messages.ts

export const ERROR_MESSAGES = {
    404: "Oops! We can't find that page 😅\nLet's go back home!",
    500: "Something went wrong on our end 😓\nDon't worry, it's not your fault!",
    NETWORK: "No internet connection 📴\nCheck your data or WiFi and try again",
    UNAUTHORIZED: "You need to log in first 🔑",
    INVALID_CREDENTIALS: "Wrong email or password 😕\nPlease try again.",
    INVALID_EMAIL: "That doesn't look like an email address 📧\nExample: yourname@gmail.com",
    RATE_LIMIT: "Slow down! 😅 Too many tries.\nWait a few minutes and try again.",
    SESSION_EXPIRED: "Your quiz timed out ⏰\nDon't worry, let's start a new one!",
    FILE_TYPE: "Please upload a PDF file 📄",
    UPLOAD_FAILED: "Couldn't upload your file 😓\nMake sure it's a PDF under 50MB."
};

export const QUIZ_LOADING_MESSAGES = [
    "Getting your quiz ready... 📝",
    "Finding the best questions for you... 🔍",
    "Almost there... ⏳",
    "Your quiz is loading... 🚀",
    "Preparing your questions... 🧠"
];

export const ENCOURAGEMENT_MESSAGES = {
    STREAK_3: "You're on fire! 🔥🔥🔥",
    WRONG: "No wahala! Next one! 💪",
    HALFWAY: "Halfway there! Keep going! 🏃",
    LAST: "Final question! You've got this! ⭐"
};

export const FIRST_TIME_MESSAGES = [
    "Welcome to your JAMB journey! 🎉",
    "You're going to do great! 💪",
    "Let's start with something easy 😊"
];

export const RETURNING_MESSAGES = [
    "Welcome back! We missed you! 👋",
    "Ready for another round? Let's go! 🚀",
    "Your brain is getting stronger! 🧠💪"
];

export function getTimeGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning! Ready to study? ☀️";
    if (hour >= 12 && hour < 17) return "Good afternoon! Let's practice! 📚";
    if (hour >= 17 && hour < 21) return "Good evening! Quick quiz before dinner? 🌅";
    return "Burning the midnight oil? Let's go! 🌙";
}

export function getScoreMessage(percentage: number) {
    if (percentage >= 90) return { title: "AMAZING! You're a genius! 🧠✨", desc: "You really know your stuff! JAMB better watch out! 💪", icon: "🏆" };
    if (percentage >= 70) return { title: "Great job! You're doing really well! 🎉", desc: "Just a little more practice and you'll be scoring 90%+! Keep it up!", icon: "⭐" };
    if (percentage >= 50) return { title: "Good effort! You're getting there! 💪", desc: "Focus on the questions you got wrong and you'll improve fast!", icon: "📚" };
    if (percentage >= 30) return { title: "Don't give up! 🌟", desc: "Every expert was once a beginner! Try studying the explanations and retake this quiz — you'll do better!", icon: "🌱" };
    return { title: "It's okay! This is how learning works! ❤️", desc: "Nobody gets everything right the first time. Read through the explanations below — they'll help a LOT! You've got this! 💪🌟", icon: "❤️" };
}
