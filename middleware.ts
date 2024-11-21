import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/statelessSession'
import { cookies } from 'next/headers'
import { cookie } from '@/lib/statelessSession'

// Define open routes that don't require authentication
const OPEN_PATHS = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/public', 
  // Add any other public routes here
]

// Function to check if a path is open
function isPathOpen(path: string): boolean {
  return OPEN_PATHS.some(openPath => 
    path === openPath || 
    path.startsWith(openPath + '/') ||
    // Optional: add pattern matching if needed
    path.match(new RegExp(`^${openPath.replace('*', '.*')}$`))
  )
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Always allow API routes, static files, and internal Next.js routes
  if (
    path.startsWith('/_next') || 
    path.startsWith('/api') || 
    path.startsWith('/static') || 
    path.startsWith('favicon.ico')
  ) {
    return NextResponse.next()
  }

  // Check if the path is open
  if (isPathOpen(path)) {
    return NextResponse.next()
  }

  // Check for valid session
  try {
    // Get session cookie
    const sessionCookie = request.cookies.get(cookie.name)?.value

    // If no session cookie exists, redirect to login
    if (!sessionCookie) {
      return redirectToLogin(request)
    }

    // Decrypt and verify session
    const session = await decrypt(sessionCookie)

    // If session is invalid or expired, redirect to login
    if (!session?.userId) {
      return redirectToLogin(request)
    }

    // Session is valid, allow access
    return NextResponse.next()

  } catch (error) {
    // Handle any errors during session verification
    console.error('Middleware session verification error:', error)
    return redirectToLogin(request)
  }
}

// Helper function to redirect to login
function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/login', request.url)
  
  // Optional: Pass the original destination for post-login redirect
  loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
  
  return NextResponse.redirect(loginUrl)
}

// Configure which routes the middleware should run on
export const config = {
  // This matcher ensures the middleware runs on all routes except specific paths
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}