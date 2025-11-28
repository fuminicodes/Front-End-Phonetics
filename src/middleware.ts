import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for potentially problematic headers
  const userAgent = request.headers.get('user-agent');
  const cookie = request.headers.get('cookie');
  
  // Log header sizes for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('Header sizes:', {
      userAgent: userAgent?.length || 0,
      cookie: cookie?.length || 0,
      total: Array.from(request.headers.entries())
        .reduce((total, [_, value]) => total + value.length, 0)
    });
  }

  // If headers are too large, create a response with cleaned headers
  const totalHeaderSize = Array.from(request.headers.entries())
    .reduce((total, [_, value]) => total + value.length, 0);

  if (totalHeaderSize > 8192) { // 8KB limit
    console.warn('Large headers detected, potential 431 error');
    
    // Create a new response with minimal headers
    const response = NextResponse.next();
    
    // Set cache control to prevent header accumulation
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  }

  // Continue with normal processing
  const response = NextResponse.next();
  
  // Set security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

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