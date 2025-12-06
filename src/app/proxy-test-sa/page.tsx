'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { analyzeAudioAction } from '@/modules/phoneme-analysis/ui/actions/phoneme-analysis.actions';
import { Button } from '@/shared/ui/button';
import { useState } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
    >
      {pending ? 'Testing...' : 'Test Server Action'}
    </Button>
  );
}

export default function ProxyTestServerAction() {
  const initialState = { errors: {}, success: false };
  const [state, formAction] = useFormState(analyzeAudioAction, initialState);
  const [testInfo, setTestInfo] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setTestInfo('Creating test audio file...');
    
    // Let the form submit naturally to trigger the Server Action
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🔄 Server Action Test
          </h1>
          <p className="text-gray-600">
            Test phoneme analysis using Server Actions (replaces /api/phoneme-analysis)
          </p>
          <div className="mt-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded inline-block">
            ✅ Using Clean Architecture pattern
          </div>
        </header>

        <div className="space-y-6">
          {/* Test Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            
            <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="audioFile" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Test Audio File
                </label>
                <input
                  type="file"
                  id="audioFile"
                  name="audio"
                  accept="audio/*"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Or a test file will be created automatically if none is selected
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
                    focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>

              <div>
                <label htmlFor="analysisType" className="block text-sm font-medium text-gray-700 mb-2">
                  Analysis Type
                </label>
                <select
                  id="analysisType"
                  name="analysisType"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                    focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                >
                  <option value="pronunciation">Pronunciation</option>
                  <option value="vowel">Vowel</option>
                  <option value="consonant">Consonant</option>
                </select>
              </div>

              <SubmitButton />
            </form>

            {testInfo && (
              <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded text-sm">
                {testInfo}
              </div>
            )}
          </div>

          {/* Results */}
          {state.success && state.result && (
            <div className="bg-green-50 p-6 rounded-lg shadow border-2 border-green-200">
              <h2 className="text-xl font-semibold text-green-800 mb-4">✅ Analysis Successful</h2>
              <div className="space-y-2 text-green-700">
                <p><strong>Analysis ID:</strong> {state.result.analysisId}</p>
                <p><strong>Accuracy:</strong> {state.result.accuracy}%</p>
                <p><strong>Phonemes Detected:</strong> {state.result.phonemeCount}</p>
                {state.result.feedback.length > 0 && (
                  <div className="mt-4">
                    <strong>Feedback:</strong>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      {state.result.feedback.map((item, idx) => (
                        <li key={idx} className="text-sm">
                          [{item.type}] {item.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

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

          {/* Architecture Info */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-purple-800">Architecture Benefits</h2>
            <ul className="space-y-2 text-purple-700 text-sm">
              <li>✅ <strong>Server Actions:</strong> Native Next.js 16 pattern</li>
              <li>✅ <strong>Clean Architecture:</strong> Domain → Infrastructure → UI</li>
              <li>✅ <strong>Type Safety:</strong> Full TypeScript support</li>
              <li>✅ <strong>Progressive Enhancement:</strong> Works without JavaScript</li>
              <li>✅ <strong>No API Routes:</strong> Direct server-side execution</li>
              <li>✅ <strong>Automatic Validation:</strong> Zod schema validation</li>
              <li>✅ <strong>RBAC Integration:</strong> Permission checks included</li>
              <li>✅ <strong>Correlation IDs:</strong> Full request tracing</li>
            </ul>
          </div>

          {/* Migration Info */}
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-yellow-800">Migration Complete</h2>
            <div className="text-yellow-700 text-sm space-y-2">
              <p><strong>Replaced:</strong> <code className="bg-yellow-100 px-2 py-1 rounded">POST /api/phoneme-analysis</code></p>
              <p><strong>With:</strong> <code className="bg-yellow-100 px-2 py-1 rounded">analyzeAudioAction()</code></p>
              <p className="mt-4"><strong>Benefits:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Eliminates unnecessary API layer</li>
                <li>Better error handling with useFormState</li>
                <li>Automatic loading states with useFormStatus</li>
                <li>No need for manual fetch() calls</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
