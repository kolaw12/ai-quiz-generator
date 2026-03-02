import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function POST(request: Request) {
    // Attempt to blacklist the token on the backend
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;
        if (token) {
            await axios.post(`${FASTAPI_URL}/auth/logout`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        }
    } catch (e) {
        // Fallthrough: even if backend fails (network error), we still want to log the user out locally
        console.error("Backend logout failure, clearing local cookies anyways:", e);
    }

    const response = NextResponse.json({ message: "Logged out successfully" });

    // Kill the HttpOnly cookie by setting it to empty with instant expiration
    response.cookies.set('auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0),
        path: '/'
    });

    return response;
}
