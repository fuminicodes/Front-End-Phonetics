import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Analyze request headers
    const headers = Object.fromEntries(request.headers.entries());
    
    const headerAnalysis = {
      totalHeaders: Object.keys(headers).length,
      totalSize: Object.entries(headers).reduce((total, [key, value]) => total + key.length + value.length, 0),
      largeHeaders: Object.entries(headers)
        .filter(([_, value]) => value.length > 1024)
        .map(([key, value]) => ({ key, size: value.length })),
      cookieSize: headers.cookie?.length || 0,
      userAgentSize: headers['user-agent']?.length || 0,
    };

    const body = await request.json();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      headerAnalysis,
      requestBody: body,
      warnings: [
        ...(headerAnalysis.totalSize > 8192 ? ['Total header size exceeds 8KB'] : []),
        ...(headerAnalysis.cookieSize > 4096 ? ['Cookie size exceeds 4KB'] : []),
        ...(headerAnalysis.userAgentSize > 512 ? ['User agent string is unusually long'] : []),
        ...(headerAnalysis.largeHeaders.length > 0 ? ['Some headers are unusually large'] : []),
      ],
    });

  } catch (error) {
    console.error('Header test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Header test endpoint - use POST method',
    timestamp: new Date().toISOString(),
  });
}