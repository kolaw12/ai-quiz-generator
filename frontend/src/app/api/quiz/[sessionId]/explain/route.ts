import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getHeaders = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export async function GET(request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
    const { searchParams } = new URL(request.url);
    const qid = searchParams.get('qid');

    try {
        const { sessionId } = await params;
        const headers = await getHeaders();
        const response = await axios.get(`${FASTAPI_URL}/quiz/${sessionId}/explain`, {
            params: { question_id: qid },
            headers: headers
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.response?.data?.detail || "Failed to generate explanation" },
            { status: error.response?.status || 500 }
        );
    }
}
