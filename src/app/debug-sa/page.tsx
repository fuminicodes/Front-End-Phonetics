'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { analyzeAudioDebugAction } from '@/modules/phoneme-analysis/ui/actions/phoneme-analysis.actions';
import { Button } from '@/shared/ui/button';
import { useState } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
    >
      {pending ? 'Running Debug...' : 'Run Debug Analysis'}
    </Button>
  );
}

export default function DebugServerAction() {
  const initialState = { errors: {}, success: false, debugInfo: {} };
  const [state, formAction] = useFormState(analyzeAudioDebugAction, initialState);
  const [showRawDebug, setShowRawDebug] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🐛 Debug Server Action
          </h1>
          <p className="text-gray-600">
            Detailed debugging of Server Action execution
          </p>
          <div className="mt-2 text-sm text-red-600 bg-red-50 px-4 py-2 rounded inline-block">
            🔍 Debug Mode - Detailed Logging
          </div>
        </header>

        <div className="space-y-6">
          {/* Debug Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Debug Test Form</h2>
            
            <form action={formAction} className="space-y-4">
              <div>
                <label htmlFor="audioFile" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Test Audio File
                </label>
                <input
                  type="file"
                  id="audioFile"
                  name="audio"
                  accept="audio/*"
                  required
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-red-50 file:text-red-700
                    hover:file:bg-red-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Upload any audio file to test the debug action
                </p>
              </div>

              <div>
                <label htmlFor="expectedText" className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Text (Optional)
                </label>
                <input
                  type="text"
                  id="expectedText"
                  name="expectedText"
                  placeholder="Hello World"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                    focus:border-red-500 focus:ring-red-500 sm:text-sm px-3 py-2 border"
                />
              </div>

              <SubmitButton />
            </form>
          </div>

          {/* Debug Results */}
          {state.debugInfo && Object.keys(state.debugInfo).length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Debug Information</h2>
                <button
                  onClick={() => setShowRawDebug(!showRawDebug)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {showRawDebug ? 'Hide' : 'Show'} Raw JSON
                </button>
              </div>

              {/* Formatted Debug Info */}
              <div className="space-y-4">
                {/* Received Form Data */}
                {state.debugInfo.receivedFormData && (
                  <div className="bg-blue-50 p-4 rounded">
                    <h3 className="font-semibold text-blue-800 mb-2">📥 Received Form Data</h3>
                    <div className="space-y-1 text-sm">
                      {state.debugInfo.receivedFormData.map((entry: any, idx: number) => (
                        <div key={idx} className="bg-blue-100 p-2 rounded">
                          {entry.type === 'File' ? (
                            <p>
                              <strong>{entry.key}:</strong> File "{entry.name}" 
                              ({entry.size} bytes, {entry.mimeType})
                            </p>
                          ) : (
                            <p><strong>{entry.key}:</strong> {entry.value}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audio File Info */}
                {state.debugInfo.audioFile && (
                  <div className="bg-green-50 p-4 rounded">
                    <h3 className="font-semibold text-green-800 mb-2">🎵 Audio File Details</h3>
                    <div className="space-y-1 text-sm text-green-700">
                      <p><strong>Name:</strong> {state.debugInfo.audioFile.name}</p>
                      <p><strong>Size:</strong> {state.debugInfo.audioFile.size} bytes</p>
                      <p><strong>Type:</strong> {state.debugInfo.audioFile.type}</p>
                    </div>
                  </div>
                )}

                {/* Sent Form Data */}
                {state.debugInfo.sentFormData && (
                  <div className="bg-purple-50 p-4 rounded">
                    <h3 className="font-semibold text-purple-800 mb-2">📤 Sent to External API</h3>
                    <div className="space-y-1 text-sm">
                      {state.debugInfo.sentFormData.map((entry: any, idx: number) => (
                        <div key={idx} className="bg-purple-100 p-2 rounded text-purple-700">
                          <p>
                            <strong>{entry.key}:</strong> File "{entry.name}" 
                            ({entry.size} bytes, {entry.type})
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* External API Response */}
                {state.debugInfo.externalApiResponse && (
                  <div className="bg-yellow-50 p-4 rounded">
                    <h3 className="font-semibold text-yellow-800 mb-2">🌐 External API Response</h3>
                    <div className="space-y-1 text-sm text-yellow-700">
                      <p><strong>Status:</strong> {state.debugInfo.externalApiResponse.status} {state.debugInfo.externalApiResponse.statusText}</p>
                      <details className="mt-2">
                        <summary className="cursor-pointer font-semibold">Response Headers</summary>
                        <pre className="mt-2 bg-yellow-100 p-2 rounded text-xs overflow-auto">
                          {JSON.stringify(state.debugInfo.externalApiResponse.headers, null, 2)}
                        </pre>
                      </details>
                    </div>
                  </div>
                )}

                {/* Error Info */}
                {state.debugInfo.error && (
                  <div className="bg-red-50 p-4 rounded">
                    <h3 className="font-semibold text-red-800 mb-2">❌ Error Details</h3>
                    <div className="space-y-1 text-sm text-red-700">
                      <p><strong>Name:</strong> {state.debugInfo.error.name}</p>
                      <p><strong>Message:</strong> {state.debugInfo.error.message}</p>
                      {state.debugInfo.error.stack && (
                        <details className="mt-2">
                          <summary className="cursor-pointer font-semibold">Stack Trace</summary>
                          <pre className="mt-2 bg-red-100 p-2 rounded text-xs overflow-auto">
                            {state.debugInfo.error.stack}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Raw JSON */}
              {showRawDebug && (
                <div className="mt-4 bg-gray-100 p-4 rounded">
                  <h3 className="font-semibold mb-2">Raw Debug Data (JSON)</h3>
                  <pre className="text-xs overflow-auto max-h-96">
                    {JSON.stringify(state.debugInfo, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Success Result */}
          {state.success && state.result && (
            <div className="bg-green-50 p-6 rounded-lg shadow border-2 border-green-200">
              <h2 className="text-xl font-semibold text-green-800 mb-4">✅ Analysis Successful</h2>
              <div className="space-y-2 text-green-700">
                <p><strong>Analysis ID:</strong> {state.result.analysisId}</p>
                <p><strong>Accuracy:</strong> {state.result.accuracy}%</p>
                <p><strong>Phonemes Detected:</strong> {state.result.phonemeCount}</p>
              </div>
            </div>
          )}

          {/* Error Result */}
          {state.errors?._form && (
            <div className="bg-red-50 p-6 rounded-lg shadow border-2 border-red-200">
              <h2 className="text-xl font-semibold text-red-800 mb-4">❌ Error</h2>
              <div className="text-red-700 space-y-2">
                {state.errors._form.map((error, idx) => (
                  <p key={idx}>{error}</p>
                ))}
              </div>
            </div>
          )}

          {/* Debug Info */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">🔍 Debug Features</h2>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>✅ <strong>FormData Inspection:</strong> See exactly what's received</li>
              <li>✅ <strong>File Details:</strong> Name, size, MIME type</li>
              <li>✅ <strong>API Communication:</strong> Track data sent to external API</li>
              <li>✅ <strong>Response Analysis:</strong> Status codes, headers</li>
              <li>✅ <strong>Error Tracking:</strong> Full error details with stack traces</li>
              <li>✅ <strong>Server-Side Logs:</strong> Check terminal for detailed logs</li>
            </ul>
          </div>

          {/* Migration Info */}
          <div className="bg-orange-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-orange-800">Migration Complete</h2>
            <p className="text-orange-700 text-sm mb-2">
              <strong>Replaced:</strong> <code className="bg-orange-100 px-2 py-1 rounded">/api/debug-proxy</code>
            </p>
            <p className="text-orange-700 text-sm mb-4">
              <strong>With:</strong> <code className="bg-orange-100 px-2 py-1 rounded">analyzeAudioDebugAction()</code>
            </p>
            <div className="text-orange-700 text-sm">
              <p className="font-semibold mb-2">Advantages:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>No API Route overhead</li>
                <li>Direct server-side execution</li>
                <li>Better structured logging</li>
                <li>Type-safe debug information</li>
                <li>Integrated with correlation IDs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
