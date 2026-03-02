import { NextResponse } from 'next/server';
import axios from 'axios';

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function GET() {
    try {
        const response = await axios.get(`${FASTAPI_URL}/subjects`);
        return NextResponse.json(response.data);
    } catch (error: any) {
        // If backend is down, return a 503 Service Unavailable so the frontend knows
        return NextResponse.json(
            { error: "Backend service unavailable. Could not fetch subjects.", detail: error.message },
            { status: 503 }
        );
    }
}
