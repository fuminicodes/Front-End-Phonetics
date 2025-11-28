'use client';

import { useState } from 'react';

export default function FieldMappingTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${result}`]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testFieldMapping = async () => {
    setIsLoading(true);
    clearResults();
    
    addResult('🔍 Testing field mapping for phoneme API...');

    try {
      // Create a proper audio blob for testing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 100, 100);
      }
      
      // Create a small test file that mimics an audio file
      const testData = new Uint8Array([
        0x52, 0x49, 0x46, 0x46, // "RIFF"
        0x24, 0x00, 0x00, 0x00, // File size
        0x57, 0x41, 0x56, 0x45, // "WAVE"
        // ... minimal WAV header
      ]);
      
      const testBlob = new Blob([testData], { type: 'audio/wav' });
      addResult(`📁 Created test audio blob: ${testBlob.size} bytes, type: ${testBlob.type}`);

      // Test 1: Correct field mapping (proxy)
      addResult('🧪 Test 1: Using proxy with "audio" field...');
      const formData1 = new FormData();
      formData1.append('audio', testBlob, 'test.wav');

      const response1 = await fetch('/api/phoneme-analysis', {
        method: 'POST',
        body: formData1,
      });

      if (response1.ok) {
        const data1 = await response1.json();
        addResult(`✅ Proxy test successful: ${JSON.stringify(data1).substring(0, 100)}...`);
      } else {
        const error1 = await response1.text();
        addResult(`❌ Proxy test failed (${response1.status}): ${error1.substring(0, 200)}...`);
      }

    } catch (error) {
      addResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectConnection = async () => {
    setIsLoading(true);
    addResult('🔍 Testing direct connection (should fail due to CORS)...');

    try {
      const testData = new Uint8Array([0x52, 0x49, 0x46, 0x46]);
      const testBlob = new Blob([testData], { type: 'audio/wav' });
      
      const formData = new FormData();
      formData.append('audioFile', testBlob, 'test.wav');

      const response = await fetch('http://localhost:5005/api/PhonemeRecognition/analyze-v', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        addResult(`⚠️ Direct connection worked unexpectedly: ${JSON.stringify(data).substring(0, 100)}...`);
      } else {
        const error = await response.text();
        addResult(`❌ Direct connection failed as expected (${response.status}): ${error.substring(0, 100)}...`);
      }
    } catch (error) {
      addResult(`✅ Direct connection blocked by CORS (expected): ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🧪 Field Mapping Test
          </h1>
          <p className="text-gray-600">
            Test the field mapping between frontend and backend APIs
          </p>
        </header>

        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            <div className="space-x-4 mb-4">
              <button
                onClick={testFieldMapping}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                Test Field Mapping
              </button>
              <button
                onClick={testDirectConnection}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
              >
                Test Direct Connection
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

          {/* Field Mapping Info */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Field Mapping Information</h2>
            <div className="space-y-3 text-blue-700">
              <div className="flex justify-between items-center p-2 bg-blue-100 rounded">
                <span><strong>Frontend → Proxy:</strong></span>
                <code className="bg-blue-200 px-2 py-1 rounded">formData.append('audio', blob)</code>
              </div>
              <div className="flex justify-between items-center p-2 bg-blue-100 rounded">
                <span><strong>Proxy → External API:</strong></span>
                <code className="bg-blue-200 px-2 py-1 rounded">formData.append('audioFile', blob)</code>
              </div>
              <div className="flex justify-between items-center p-2 bg-blue-100 rounded">
                <span><strong>External API expects:</strong></span>
                <code className="bg-blue-200 px-2 py-1 rounded">"audioFile" field (required)</code>
              </div>
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
              {testResults.length === 0 ? (
                <p className="text-gray-500">No test results yet. Run a test to see results.</p>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono mb-1 whitespace-pre-wrap">
                    {result}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center space-x-4">
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to Main App
          </a>
          <a 
            href="/proxy-test"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Proxy Test
          </a>
        </div>
      </div>
    </div>
  );
}