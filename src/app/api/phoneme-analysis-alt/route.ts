import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Alternative proxy received request for phoneme analysis');

    // Get the raw body as buffer first
    const contentType = request.headers.get('content-type') || '';
    console.log('📋 Content-Type:', contentType);

    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Content-Type must be multipart/form-data' },
        { status: 400 }
      );
    }

    // Get the form data
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      console.error('❌ No audio file provided in request');
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    console.log(`📁 Audio file received: ${audioFile.name}, size: ${audioFile.size} bytes, type: ${audioFile.type}`);

    // Convert the file to ArrayBuffer and then create a new FormData
    const audioBuffer = await audioFile.arrayBuffer();
    const newFile = new File([audioBuffer], audioFile.name || 'recording.webm', {
      type: audioFile.type || 'audio/webm'
    });

    // Create new FormData for the external API
    const externalFormData = new FormData();
    externalFormData.append('audioFile', newFile);

    console.log('📋 External FormData contents:');
    for (const [key, value] of externalFormData.entries()) {
      if (value instanceof File) {
        console.log(`  - ${key}: File(name=${value.name}, size=${value.size}, type=${value.type})`);
      } else {
        console.log(`  - ${key}: ${value}`);
      }
    }

    console.log('🌐 Forwarding request to external API...');

    // Forward the request to the external API
    const response = await fetch('http://localhost:5005/api/PhonemeRecognition/analyze-v', {
      method: 'POST',
      body: externalFormData,
      // Let Node.js set the Content-Type with boundary automatically
    });

    console.log(`📡 External API response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ External API error:', response.status, response.statusText, errorText);
      
      return NextResponse.json(
        { 
          error: `External API error: ${response.status} ${response.statusText}`,
          details: errorText,
          timestamp: new Date().toISOString(),
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Successfully processed request');
    
    // Return the response with proper CORS headers
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('❌ Proxy API error:', error);
    
    let errorMessage = 'Internal server error';
    let errorDetails = 'Unknown error';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || error.message;
      
      // Check for specific error types
      if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
        errorMessage = 'Cannot connect to external API server';
        errorDetails = 'Make sure the phoneme analysis API is running on http://localhost:5005';
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString(),
        suggestion: 'Check that the external API server is running on http://localhost:5005',
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}