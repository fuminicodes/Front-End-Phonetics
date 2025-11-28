'use client';

import { useState } from 'react';

export default function ProxyTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testProxyConnection = async () => {
    setIsLoading(true);
    setTestResult('Testing proxy connection...');

    try {
      // Create a small test audio file (empty blob for testing)
      const testBlob = new Blob(['test'], { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', testBlob, 'test.webm');

      const response = await fetch('/api/phoneme-analysis', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ Proxy working! Response: ${JSON.stringify(data, null, 2)}`);
      } else {
        const errorText = await response.text();
        setTestResult(`❌ Proxy error (${response.status}): ${errorText}`);
      }
    } catch (error) {
      setTestResult(`❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testExternalAPI = async () => {
    setIsLoading(true);
    setTestResult('Testing external API (direct connection - should fail with CORS)...');

    try {
      const testBlob = new Blob(['test'], { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audioFile', testBlob, 'test.webm');

      const response = await fetch('http://localhost:5005/api/PhonemeRecognition/analyze-v', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult(`⚠️ Direct connection worked (unexpected): ${JSON.stringify(data, null, 2)}`);
      } else {
        setTestResult(`❌ Direct connection failed (${response.status}): ${await response.text()}`);
      }
    } catch (error) {
      setTestResult(`✅ Direct connection failed as expected (CORS): ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🔄 API Proxy Test
          </h1>
          <p className="text-gray-600">
            Test the phoneme analysis proxy to verify CORS resolution
          </p>
        </header>

        <div className="space-y-6">
          {/* Test Controls */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Connection Tests</h2>
            <div className="space-x-4">
              <button
                onClick={testProxyConnection}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                Test Proxy API
              </button>
              <button
                onClick={testExternalAPI}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
              >
                Test Direct API (Should Fail)
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Testing...</span>
              </div>
            ) : (
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto whitespace-pre-wrap">
                {testResult || 'No tests run yet'}
              </pre>
            )}
          </div>

          {/* Information */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">How the Proxy Works</h2>
            <ul className="space-y-2 text-blue-700">
              <li><strong>Frontend (localhost:3000)</strong> → Makes request to internal proxy</li>
              <li><strong>Proxy (/api/phoneme-analysis)</strong> → Forwards request to external API</li>
              <li><strong>External API (localhost:5005)</strong> → Processes phoneme analysis</li>
              <li><strong>Proxy</strong> → Returns response with proper CORS headers</li>
              <li><strong>Frontend</strong> → Receives data without CORS issues</li>
            </ul>
            
            <div className="mt-4 p-3 bg-blue-100 rounded">
              <p className="text-sm text-blue-800">
                <strong>Benefits:</strong> No CORS configuration needed on the external API server,
                secure handling of cross-origin requests, and consistent error handling.
              </p>
            </div>
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