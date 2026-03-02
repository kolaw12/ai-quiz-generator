import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define which routes require authentication
const protectedRoutes = [
    '/dashboard',
    '/quiz',
    '/results',
    '/profile',
    '/bookmarks',
    '/mistakes',
    '/leaderboard',
    '/upload',
    '/admin'
];

// Define routes that should NOT be accessed if already logged in
const authRoutes = ['/login', '/signup'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Check if the user has our secure HttpOnly cookie
    const token = request.cookies.get('auth_token')?.value;

    // 2. Determine if the current path starts with any of our protected route prefixes
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname === route || pathname.startsWith(`${route}/`)
    );

    const isAuthRoute = authRoutes.includes(pathname);

    // 3. Logic Execution

    // A. User is trying to access a secure area but is not logged in
    if (isProtectedRoute && !token) {
        // Save where they wanted to go, so we can redirect them back after login later
        const url = new URL('/login', request.url);
        url.searchParams.set('returnUrl', pathname);
        return NextResponse.redirect(url);
    }

    // B. User is ALREADY logged in, but trying to visit /login or /signup
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Allow them to proceed
    return NextResponse.next();
}

// Ensure the middleware only runs on page routes, not static files, images, or Next.js internals
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
