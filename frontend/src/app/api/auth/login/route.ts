import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const ip = request.headers.get("x-forwarded-for") || '127.0.0.1';

        // Forward login payload to FastAPI Auth Service
        const response = await axios.post(`${FASTAPI_URL}/auth/login`, body, {
            headers: { 'x-forwarded-for': ip }
        });

        const { token, user } = response.data;
        const nextResponse = NextResponse.json({ user });

        // Intercept JWT token and securely plant it into the client browser via HttpOnly cookie
        nextResponse.cookies.set('auth_token', token, {
            httpOnly: true, // Crucial: Prevents JavaScript XSS access
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days matching JWT expiry
            path: '/'
        });

        return nextResponse;
    } catch (error: any) {
        return NextResponse.json(
            { error: error.response?.data?.detail || "Invalid credentials" },
            { status: error.response?.status || 401 }
        );
    }
}
