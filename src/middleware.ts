import { NextRequest, NextResponse } from 'next/server';
import { CorrelationManager } from '@/core/logging/correlation';
import { logger } from '@/core/logging/logger';
import { SessionManager } from '@/shared/utils/session';
import { verifyJWT } from '@/shared/utils/encryption';

export async function middleware(request: NextRequest) {
  const correlationId = CorrelationManager.generate();
  const startTime = Date.now();
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for static files and Next.js internals
  if (isStaticFile(pathname)) {
    return NextResponse.next();
  }
  
  // Log request start
  await logger.info('Request started', {
    correlationId,
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent'),
    path: pathname,
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
      path: pathname
    });
    
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  }

  // ===== SESSION VALIDATION (NEW) =====
  // Skip session validation for public routes
  if (isPublicRoute(pathname)) {
    await logger.debug('Public route accessed', {
      correlationId,
      path: pathname
    });
    
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-request-id', correlationId);
    
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    
    setSecurityHeaders(response, correlationId);
    await logRequestCompletion(correlationId, pathname, startTime, response.status);
    
    return response;
  }
  
  // Validate session for protected routes
  const session = await SessionManager.getSession();
  
  if (!session) {
    await logger.warn('Unauthorized access attempt', {
      correlationId,
      path: pathname,
      reason: 'No valid session'
    });
    
    // Redirect to login with return URL
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    
    return NextResponse.redirect(loginUrl);
  }
  
  // Verify JWT token
  try {
    const jwtPayload = await verifyJWT(session.accessToken);
    
    await logger.debug('Session validated', {
      correlationId,
      userId: session.userId,
      email: session.email
    });
  } catch (jwtError) {
    await logger.error('Invalid JWT in session', jwtError as Error, {
      correlationId,
      userId: session.userId
    });
    
    // Clear invalid session
    await SessionManager.clearSession();
    
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    loginUrl.searchParams.set('error', 'session_expired');
    
    return NextResponse.redirect(loginUrl);
  }
  
  // Create response with session info in headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-request-id', correlationId);
  
  // Add session info to headers for API routes and server components
  if (pathname.startsWith('/api/')) {
    requestHeaders.set('x-user-id', session.userId);
    requestHeaders.set('x-user-email', session.email || '');
    requestHeaders.set('x-user-permissions', JSON.stringify(session.permissions || []));
    
    await logger.debug('Session info added to headers', {
      correlationId,
      userId: session.userId,
      path: pathname
    });
  }
  
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  setSecurityHeaders(response, correlationId);
  await logRequestCompletion(correlationId, pathname, startTime, response.status);
  
  return response;
}

function isStaticFile(pathname: string): boolean {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf'];
  const staticPaths = ['/_next/', '/favicon.ico'];
  
  return staticExtensions.some(ext => pathname.endsWith(ext)) ||
         staticPaths.some(path => pathname.startsWith(path));
}

/**
 * Determines if a route is public (doesn't require authentication)
 */
function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/api/health',
    '/api/webhooks',
    // Test/debug routes (should be removed in production)
    '/proxy-test',
    '/proxy-comparison',
    '/header-test',
    '/debug-test',
    '/field-test',
  ];
  
  // Check if pathname matches any public route
  return publicRoutes.some(route => pathname.startsWith(route));
}

/**
 * Sets security headers on the response
 */
function setSecurityHeaders(response: NextResponse, correlationId: string): void {
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Request-ID', correlationId);
  
  // Additional security headers
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

/**
 * Logs request completion
 */
async function logRequestCompletion(
  correlationId: string,
  pathname: string,
  startTime: number,
  status: number
): Promise<void> {
  const duration = Date.now() - startTime;
  await logger.info('Request completed', {
    correlationId,
    status,
    duration: `${duration}ms`,
    path: pathname,
  });
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