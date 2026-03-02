import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
        const response = await axios.get(`${FASTAPI_URL}/auth/me`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: "Token expired or invalid" },
            { status: 401 }
        );
    }
}

export async function PUT(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const response = await axios.put(`${FASTAPI_URL}/auth/me`, body, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.response?.data?.detail || "Failed to update profile" },
            { status: error.response?.status || 500 }
        );
    }
}
