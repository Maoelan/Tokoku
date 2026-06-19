import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Protect all API routes except login and public assets
  if (path.startsWith('/api/') && !path.startsWith('/api/login') && !path.startsWith('/api/upload')) {
    const session = request.cookies.get('tokoku_session');
    const method = request.method;
    
    // Allow public access to read (GET) products and categories for the landing page
    if (method === 'GET' && (path === '/api/products' || path === '/api/categories')) {
      return NextResponse.next();
    }

    // In test environment, allow access without cookie
    if (process.env.NODE_ENV === 'test') {
      return NextResponse.next();
    }

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized Access. Please login.' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
}
