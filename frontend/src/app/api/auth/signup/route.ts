import { NextResponse } from 'next/server';
import axios from 'axios';

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const ip = request.headers.get("x-forwarded-for") || '127.0.0.1';

        const response = await axios.post(`${FASTAPI_URL}/auth/signup`, body, {
            headers: { 'x-forwarded-for': ip }
        });

        const { token, user } = response.data;
        const nextResponse = NextResponse.json({ user });

        nextResponse.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        });

        return nextResponse;
    } catch (error: any) {
        return NextResponse.json(
            { error: error.response?.data?.detail || "Registration failed. Email might be in use." },
            { status: error.response?.status || 400 }
        );
    }
}
