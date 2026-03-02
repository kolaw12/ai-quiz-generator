import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function forwardRequest(req: NextRequest, { params }: { params: Promise<{ slug?: string[] }> | { slug?: string[] } }) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    // Fallback: If no token, bounce immediately before hitting FastAPI
    if (!token) {
        return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
    }

    const resolvedParams = await params;
    const slug = resolvedParams.slug ? resolvedParams.slug.join("/") : "";
    const targetUrl = `${FASTAPI_URL}/admin/${slug}`;

    try {
        let data = null;
        let headers: Record<string, string> = {
            "Authorization": `Bearer ${token}`
        };

        const contentType = req.headers.get("content-type");
        if (req.method !== "GET" && req.method !== "HEAD") {
            if (contentType && contentType.includes("multipart/form-data")) {
                const formData = await req.formData();
                data = formData;
                // Axios automatically sets multipart headers when passing FormData
            } else {
                data = await req.json().catch(() => null);
                headers["Content-Type"] = "application/json";
            }
        }

        const response = await axios({
            method: req.method,
            url: targetUrl,
            data: data,
            headers: headers,
            params: Object.fromEntries(req.nextUrl.searchParams)
        });

        return NextResponse.json(response.data, { status: response.status });

    } catch (error: any) {
        console.error("Admin Proxy Error:", error.response?.data || error.message);
        return NextResponse.json(
            error.response?.data || { detail: "Internal Server Error" },
            { status: error.response?.status || 500 }
        );
    }
}

export const GET = forwardRequest;
export const POST = forwardRequest;
export const PUT = forwardRequest;
export const DELETE = forwardRequest;
