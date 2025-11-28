import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Log the request for debugging
    console.log('🔄 Proxy received request for phoneme analysis');

    // Extract the audio file from the form data
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

    // Create new FormData for the external API
    const externalFormData = new FormData();
    externalFormData.append('audioFile', audioFile); // Note: API expects 'audioFile', not 'audio'

    // Debug: Log the FormData contents
    console.log('📋 FormData contents being sent to external API:');
    for (const [key, value] of externalFormData.entries()) {
      if (value instanceof File) {
        console.log(`  - ${key}: File(name=${value.name}, size=${value.size}, type=${value.type})`);
      } else {
        console.log(`  - ${key}: ${value}`);
      }
    }

    console.log('🌐 Forwarding request to external API with audioFile field...');

    // Forward the request to the external API
    const response = await fetch('http://localhost:5005/api/PhonemeRecognition/analyze-v', {
      method: 'POST',
      body: externalFormData,
      // Important: Don't set Content-Type header manually for FormData
      // Node.js will set it automatically with the correct boundary
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
    console.log('✅ Successfully processed request, returning data');
    
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