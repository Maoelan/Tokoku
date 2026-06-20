import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Protect /dashboard routes and /api routes
  const isApiRoute = path.startsWith('/api/');
  const isDashboardRoute = path.startsWith('/dashboard');
  
  if (isApiRoute || isDashboardRoute) {
    // Public routes that don't need auth
    if (path.startsWith('/api/login')) {
      return NextResponse.next();
    }

    const method = request.method;
    
    // Allow public access to read (GET) products and categories for the landing page
    if (isApiRoute && method === 'GET' && (path === '/api/products' || path === '/api/categories')) {
      return NextResponse.next();
    }

    // In test environment, allow access without cookie
    if (process.env.NODE_ENV === 'test') {
      return NextResponse.next();
    }

    const session = request.cookies.get('tokoku_session');
    
    if (!session) {
      if (isDashboardRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      return NextResponse.json({ error: 'Unauthorized Access. Please login.' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
}
