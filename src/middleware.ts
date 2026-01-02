import { type NextRequest, NextResponse } from 'next/server'

// DEMO MODE - No authentication required for admin
// In production, you would use proper Supabase auth

export async function middleware(request: NextRequest) {
    const response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const path = request.nextUrl.pathname

    // DEMO: Allow all admin routes - check is done client-side via localStorage
    // In production, you would verify the session server-side

    // For /admin routes (except login), we just pass through
    // The admin layout will handle the client-side auth check
    if (path.startsWith('/admin') && path !== '/admin/login') {
        // In demo mode, we allow access - client handles redirect
        return response
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
