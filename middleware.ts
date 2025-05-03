import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;

  // Ensure client, organizer, and admin routes are properly handled
  if (pathname.startsWith('/client/') || 
      pathname.startsWith('/organizer/') || 
      pathname.startsWith('/admin/') ||
      pathname.startsWith('/documentation/')) {
    // Allow the request to continue to the destination
    return NextResponse.next();
  }

  // For all other routes, continue normally
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Match all routes starting with client or organizer
    '/client/:path*',
    '/organizer/:path*',
    // Also match admin routes
    '/admin/:path*',
    // Also match documentation routes
    '/documentation/:path*',
    // Match login route
    '/login',
  ],
};
