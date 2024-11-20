import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/statelessSession'; // Assuming this is where your verifySession function is

// Add all public routes here
const publicRoutes = [
  '/login',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
];

// Add routes that should redirect logged-in users (e.g., prevent logged-in users from accessing login page)
const authRoutes = [
  '/login',
  '/sign-up',
];

export async function middleware(request: NextRequest) {
  try {
    // Get the pathname from the request
    const path = request.nextUrl.pathname;

    // Check if it's a public asset (like images, css, etc.)
    if (
      path.startsWith('/_next') || 
      path.startsWith('/api') ||
      path.startsWith('/static') ||
      path.includes('.')
    ) {
      return NextResponse.next();
    }

    // Verify the session
    const { userId } = await verifySession();
    const isAuthenticated = !!userId;

    // Create URLs for redirection
    const loginUrl = new URL('/login', request.url);
    const homeUrl = new URL('/', request.url);
    
    // If the user is not authenticated and tries to access a protected route
    if (!isAuthenticated && !publicRoutes.includes(path)) {
      // Store the current URL to redirect back after login
     
      loginUrl.searchParams.set('callbackUrl', encodeURIComponent(request.url));
      return NextResponse.redirect(loginUrl);
    }

    // If the user is authenticated and tries to access auth routes (login, signup)
    if (isAuthenticated && authRoutes.includes(path)) {
      return NextResponse.redirect(homeUrl);
    }

    // Allow the request to continue
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    
    // If there's an error verifying the session, redirect to login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

// Configure which routes should be handled by this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. Prefixed with /api (API routes)
     * 2. Prefixed with /_next (Next.js internals)
     * 3. Containing a dot (static files, e.g. favicon.ico)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};