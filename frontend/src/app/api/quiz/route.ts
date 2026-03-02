import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getHeaders = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const headers = await getHeaders();

        const response = await axios.post(`${FASTAPI_URL}/quiz/start`, body, {
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.response?.data?.detail || "Failed to start quiz session" },
            { status: error.response?.status || 500 }
        );
    }
}
