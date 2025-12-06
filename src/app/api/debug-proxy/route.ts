import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // ⚠️ DEPRECATION WARNING
  console.warn('⚠️ DEPRECATED API ROUTE USED: /api/debug-proxy');
  console.warn('⚠️ Please migrate to Server Action: analyzeAudioDebugAction()');
  console.warn('⚠️ See: src/modules/phoneme-analysis/ui/actions/phoneme-analysis.actions.ts');
  console.warn('⚠️ This route will be removed in a future version.');
  
  try {
    console.log('🔍 Debug proxy - analyzing request...');

    // Log request headers
    const headers = Object.fromEntries(request.headers.entries());
    console.log('📋 Request headers:', headers);

    // Extract the audio file from the form data
    const formData = await request.formData();
    
    console.log('📊 Received FormData entries:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  - ${key}: File(name=${value.name}, size=${value.size}, type=${value.type})`);
      } else {
        console.log(`  - ${key}: ${value}`);
      }
    }

    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      console.error('❌ No audio file found with key "audio"');
      return NextResponse.json(
        { error: 'No audio file provided', availableKeys: Array.from(formData.keys()) },
        { status: 400 }
      );
    }

    console.log(`📁 Processing audio file: ${audioFile.name}, size: ${audioFile.size}, type: ${audioFile.type}`);

    // Create test with minimal approach
    const externalFormData = new FormData();
    externalFormData.append('audioFile', audioFile, audioFile.name);

    console.log('📤 Sending to external API with data:');
    for (const [key, value] of externalFormData.entries()) {
      if (value instanceof File) {
        console.log(`  - ${key}: File(name=${value.name}, size=${value.size}, type=${value.type})`);
      } else {
        console.log(`  - ${key}: ${value}`);
      }
    }

    // Test direct curl-like approach - minimal headers
    console.log('🌐 Making request to external API...');
    const response = await fetch('http://localhost:5005/api/PhonemeRecognition/analyze-v', {
      method: 'POST',
      body: externalFormData,
      // No additional headers - let Node.js handle everything
    });

    console.log(`📡 External API response: ${response.status} ${response.statusText}`);
    console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ External API error body:', errorText);
      
      return NextResponse.json(
        { 
          error: `External API error: ${response.status} ${response.statusText}`,
          details: errorText,
          debugInfo: {
            sentFieldName: 'audioFile',
            sentFileName: audioFile.name,
            sentFileSize: audioFile.size,
            sentFileType: audioFile.type,
          }
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Success - response received:', data);
    
    return NextResponse.json({
      ...data,
      debugInfo: {
        receivedFieldName: 'audio',
        sentFieldName: 'audioFile',
        processingTime: Date.now(),
      }
    });

  } catch (error) {
    console.error('❌ Debug proxy error:', error);
    
    return NextResponse.json(
      { 
        error: 'Debug proxy error',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
      },
      { status: 500 }
    );
  }
}

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