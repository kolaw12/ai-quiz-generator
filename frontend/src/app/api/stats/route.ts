import { NextResponse } from 'next/server';
import axios from 'axios';

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function GET() {
    try {
        const response = await axios.get(`${FASTAPI_URL}/stats`);
        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.response?.data?.detail || "Failed to fetch stats" },
            { status: error.response?.status || 500 }
        );
    }
}
