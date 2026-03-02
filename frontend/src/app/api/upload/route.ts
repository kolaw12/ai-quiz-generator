import { NextResponse } from 'next/server';
import axios from 'axios';

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        // Forward the multipart/form-data to FastAPI
        const response = await axios.post(`${FASTAPI_URL}/upload-pdf`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("Proxy Upload Error:", error.response?.data || error.message);
        return NextResponse.json(
            { error: error.response?.data?.detail || "Failed to contact backend PDF processor" },
            { status: error.response?.status || 500 }
        );
    }
}
