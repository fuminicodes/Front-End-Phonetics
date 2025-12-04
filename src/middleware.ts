import { NextRequest, NextResponse } from 'next/server';
import { CorrelationManager } from '@/core/logging/correlation';
import { logger } from '@/core/logging/logger';

export async function middleware(request: NextRequest) {
  const correlationId = CorrelationManager.generate();
  const startTime = Date.now();
  
  // Skip middleware for static files and Next.js internals
  if (isStaticFile(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  
  // Log request start
  await logger.info('Request started', {
    correlationId,
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent'),
    path: request.nextUrl.pathname,
  });

  // Check for potentially problematic headers
  const userAgent = request.headers.get('user-agent');
  const cookie = request.headers.get('cookie');
  
  // Calculate total header size
  const totalHeaderSize = Array.from(request.headers.entries())
    .reduce((total, [_, value]) => total + value.length, 0);
  // Log header sizes for debugging
  if (process.env.NODE_ENV === 'development') {
    await logger.debug('Header sizes', {
      correlationId,
      userAgent: userAgent?.length || 0,
      cookie: cookie?.length || 0,
      total: totalHeaderSize
    });
  }

  // Handle oversized headers
  if (totalHeaderSize > 8192) { // 8KB limit
    await logger.warn('Large headers detected, potential 431 error', {
      correlationId,
      headerSize: totalHeaderSize,
      path: request.nextUrl.pathname
    });
    
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  }

  // Create response with correlation ID and security headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-request-id', correlationId);
  
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  // Set security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Request-ID', correlationId);
  
  // Log response completion
  const duration = Date.now() - startTime;
  await logger.info('Request completed', {
    correlationId,
    status: response.status,
    duration: `${duration}ms`,
    path: request.nextUrl.pathname,
  });
  
  return response;
}

function isStaticFile(pathname: string): boolean {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf'];
  const staticPaths = ['/_next/', '/favicon.ico'];
  
  return staticExtensions.some(ext => pathname.endsWith(ext)) ||
         staticPaths.some(path => pathname.startsWith(path));
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
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|js|css|woff|woff2|ttf)$).*)',
  ],
};