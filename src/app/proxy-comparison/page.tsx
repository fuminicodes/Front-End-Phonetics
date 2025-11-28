'use client';

import { useState } from 'react';

export default function ProxyComparison() {
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (result: string) => {
    setResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${result}`]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testOriginalProxy = async () => {
    setIsLoading(true);
    addResult('🔍 Testing original proxy (/api/phoneme-analysis)...');

    try {
      // Create a test audio file
      const testData = new Uint8Array([
        0x52, 0x49, 0x46, 0x46, // "RIFF"
        0x24, 0x00, 0x00, 0x00, // File size
        0x57, 0x41, 0x56, 0x45, // "WAVE"
        0x66, 0x6D, 0x74, 0x20, // "fmt "
      ]);
      
      const testBlob = new Blob([testData], { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('audio', testBlob, 'test.wav');

      const response = await fetch('/api/phoneme-analysis', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        addResult(`✅ Original proxy successful: ${JSON.stringify(data).substring(0, 100)}...`);
      } else {
        const error = await response.text();
        addResult(`❌ Original proxy failed (${response.status}): ${error.substring(0, 200)}...`);
      }

    } catch (error) {
      addResult(`❌ Original proxy error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testAlternativeProxy = async () => {
    addResult('🔍 Testing alternative proxy (/api/phoneme-analysis-alt)...');

    try {
      // Create a test audio file
      const testData = new Uint8Array([
        0x52, 0x49, 0x46, 0x46, // "RIFF"
        0x24, 0x00, 0x00, 0x00, // File size
        0x57, 0x41, 0x56, 0x45, // "WAVE"
        0x66, 0x6D, 0x74, 0x20, // "fmt "
      ]);
      
      const testBlob = new Blob([testData], { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('audio', testBlob, 'test.wav');

      const response = await fetch('/api/phoneme-analysis-alt', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        addResult(`✅ Alternative proxy successful: ${JSON.stringify(data).substring(0, 100)}...`);
      } else {
        const error = await response.text();
        addResult(`❌ Alternative proxy failed (${response.status}): ${error.substring(0, 200)}...`);
      }

    } catch (error) {
      addResult(`❌ Alternative proxy error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testBothProxies = async () => {
    setIsLoading(true);
    clearResults();
    await testOriginalProxy();
    await testAlternativeProxy();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ⚖️ Proxy Comparison Test
          </h1>
          <p className="text-gray-600">
            Compare different proxy implementations for the phoneme API
          </p>
        </header>

        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            <div className="space-x-4 mb-4">
              <button
                onClick={testBothProxies}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                Test Both Proxies
              </button>
              <button
                onClick={testOriginalProxy}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                Test Original Only
              </button>
              <button
                onClick={testAlternativeProxy}
                disabled={isLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400"
              >
                Test Alternative Only
              </button>
              <button
                onClick={clearResults}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400"
              >
                Clear Results
              </button>
            </div>
          </div>

          {/* Comparison Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-green-800">Original Proxy</h2>
              <ul className="space-y-2 text-green-700 text-sm">
                <li>• Direct FormData forwarding</li>
                <li>• Simple field mapping (audio → audioFile)</li>
                <li>• Minimal processing</li>
                <li>• Standard fetch implementation</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-purple-800">Alternative Proxy</h2>
              <ul className="space-y-2 text-purple-700 text-sm">
                <li>• ArrayBuffer reconstruction</li>
                <li>• New File object creation</li>
                <li>• Enhanced logging</li>
                <li>• Detailed content-type handling</li>
              </ul>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            {isLoading && (
              <div className="flex items-center space-x-2 mb-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Running tests...</span>
              </div>
            )}
            <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <p className="text-gray-500">No test results yet. Run a test to see results.</p>
              ) : (
                results.map((result, index) => (
                  <div key={index} className="text-sm font-mono mb-1 whitespace-pre-wrap">
                    {result}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Debug Info */}
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-yellow-800">Debug Information</h2>
            <div className="text-yellow-700 text-sm space-y-2">
              <p><strong>Expected by External API:</strong> Field name "audioFile" (required)</p>
              <p><strong>Sent by Frontend:</strong> Field name "audio" with File object</p>
              <p><strong>Proxy Job:</strong> Map "audio" → "audioFile" and forward to external API</p>
              <p><strong>Current Issue:</strong> External API still reports missing "audioFile" field</p>
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