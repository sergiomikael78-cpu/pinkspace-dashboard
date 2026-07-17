import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Only apply to /admin routes, but not the login page itself
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const authCookie = request.cookies.get('pinkspace_admin_auth');
    
    if (!authCookie || authCookie.value !== 'authenticated') {
      // Redirect to login page if not authenticated
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
};
