import { NextResponse } from 'next/server';
import axios from 'axios';

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function GET() {
    try {
        const response = await axios.get(`${FASTAPI_URL}/bookmarks`);
        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.response?.data?.detail || "Failed to fetch bookmarks" },
            { status: error.response?.status || 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const response = await axios.post(`${FASTAPI_URL}/bookmarks`, body, {
            headers: { 'Content-Type': 'application/json' }
        });
        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.response?.data?.detail || "Failed to save bookmark" },
            { status: error.response?.status || 500 }
        );
    }
}
