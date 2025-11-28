'use client';

import { useState } from 'react';

export default function DebugTest() {
  const [debugResult, setDebugResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testDebugProxy = async () => {
    setIsLoading(true);
    setDebugResult('Testing debug proxy...');

    try {
      // Create a small test audio file
      const testData = new Uint8Array([
        0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00,
        0x57, 0x41, 0x56, 0x45, 0x66, 0x6D, 0x74, 0x20,
      ]);
      
      const audioBlob = new Blob([testData], { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'test-debug.wav');

      console.log('Sending test request to debug proxy...');

      const response = await fetch('/api/debug-proxy', {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();
      
      setDebugResult(`Status: ${response.status} ${response.statusText}\n\nResponse:\n${responseText}`);

      // Also log to console for detailed inspection
      console.log('Debug proxy response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText
      });

    } catch (error) {
      const errorMsg = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setDebugResult(errorMsg);
      console.error('Debug test error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🐛 Debug Proxy Test
          </h1>
          <p className="text-gray-600">
            Detailed debugging of the proxy communication with external API
          </p>
        </header>

        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Debug Test</h2>
            <button
              onClick={testDebugProxy}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Testing...' : 'Run Debug Test'}
            </button>
          </div>

          {/* Results */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Debug Results</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto whitespace-pre-wrap max-h-96">
              {debugResult || 'No test run yet. Click the button above to start debugging.'}
            </pre>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Debug Information</h2>
            <ul className="space-y-2 text-blue-700">
              <li>• This debug proxy logs all request/response details</li>
              <li>• Check the terminal output for detailed server-side logs</li>
              <li>• The response includes debug information about field mapping</li>
              <li>• Any errors will be captured with full stack traces</li>
            </ul>
          </div>

          {/* Console Note */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-800 text-sm">
              💡 <strong>Tip:</strong> Open the browser console (F12) and check the terminal output 
              for complete debugging information while running this test.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to Main App
          </a>
        </div>
      </div>
    </div>
  );
}