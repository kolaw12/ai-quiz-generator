// /frontend/src/lib/validators.ts

export const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email";
    return "";
};

export const validatePasswordStrength = (password: string) => {
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };

    let score = 0;
    if (checks.length) score++;
    if (checks.uppercase) score++;
    if (checks.number) score++;
    if (checks.special) score++;

    let strength: 'Weak' | 'Medium' | 'Strong' = 'Weak';
    if (score >= 4) strength = 'Strong';
    else if (score >= 3 && checks.length) strength = 'Medium';

    return { checks, score, strength };
};

export const validateName = (name: string) => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (name.trim().length > 50) return "Name must be under 50 characters";
    return "";
};
