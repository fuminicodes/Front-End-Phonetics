'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { 
  analyzeAudioAction, 
  analyzeAudioDirectAction 
} from '@/modules/phoneme-analysis/ui/actions/phoneme-analysis.actions';
import { Button } from '@/shared/ui/button';
import { useState } from 'react';

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 w-full"
    >
      {pending ? 'Testing...' : label}
    </Button>
  );
}

export default function ServerActionComparison() {
  const [activeTest, setActiveTest] = useState<'standard' | 'direct' | null>(null);
  
  const initialState = { errors: {}, success: false };
  const [standardState, standardAction] = useFormState(analyzeAudioAction, initialState);
  const [directState, directAction] = useFormState(analyzeAudioDirectAction, initialState);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ⚖️ Server Actions Comparison
          </h1>
          <p className="text-gray-600">
            Compare different Server Action implementations
          </p>
          <div className="mt-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded inline-block">
            ✅ No API Routes - Pure Server Actions
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Standard Action with Use Case */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold text-green-800">Standard Action</h2>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Recommended</span>
            </div>
            
            <div className="mb-4 text-sm text-gray-600 space-y-1">
              <p>✅ Uses Use Case layer</p>
              <p>✅ Repository pattern</p>
              <p>✅ Full validation</p>
              <p>✅ Clean Architecture</p>
            </div>

            <form 
              action={standardAction} 
              onSubmit={() => setActiveTest('standard')}
              className="space-y-4"
            >
              <div>
                <input
                  type="file"
                  name="audio"
                  accept="audio/*"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
                />
              </div>

              <input
                type="text"
                name="expectedText"
                placeholder="Expected text (optional)"
                className="w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-green-500 focus:ring-green-500 text-sm px-3 py-2 border"
              />

              <select
                name="analysisType"
                className="w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-green-500 focus:ring-green-500 text-sm px-3 py-2 border"
              >
                <option value="pronunciation">Pronunciation</option>
                <option value="vowel">Vowel</option>
                <option value="consonant">Consonant</option>
              </select>

              <SubmitButton label="Test Standard Action" />
            </form>

            {activeTest === 'standard' && standardState.success && standardState.result && (
              <div className="mt-4 p-4 bg-green-50 rounded border border-green-200">
                <p className="font-semibold text-green-800">✅ Success</p>
                <p className="text-sm text-green-700 mt-2">
                  Accuracy: {standardState.result.accuracy}%
                </p>
                <p className="text-sm text-green-700">
                  Phonemes: {standardState.result.phonemeCount}
                </p>
              </div>
            )}

            {activeTest === 'standard' && standardState.errors?._form && (
              <div className="mt-4 p-4 bg-red-50 rounded border border-red-200">
                <p className="font-semibold text-red-800">❌ Error</p>
                <p className="text-sm text-red-700 mt-2">
                  {standardState.errors._form[0]}
                </p>
              </div>
            )}
          </div>

          {/* Direct Action */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold text-purple-800">Direct Action</h2>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Alternative</span>
            </div>
            
            <div className="mb-4 text-sm text-gray-600 space-y-1">
              <p>⚡ Direct API call</p>
              <p>⚡ Bypasses repository</p>
              <p>⚡ Faster execution</p>
              <p>⚡ Less abstraction</p>
            </div>

            <form 
              action={directAction}
              onSubmit={() => setActiveTest('direct')}
              className="space-y-4"
            >
              <div>
                <input
                  type="file"
                  name="audio"
                  accept="audio/*"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-purple-50 file:text-purple-700
                    hover:file:bg-purple-100"
                />
              </div>

              <input
                type="text"
                name="expectedText"
                placeholder="Expected text (optional)"
                className="w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-purple-500 focus:ring-purple-500 text-sm px-3 py-2 border"
              />

              <select
                name="analysisType"
                className="w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-purple-500 focus:ring-purple-500 text-sm px-3 py-2 border"
              >
                <option value="pronunciation">Pronunciation</option>
                <option value="vowel">Vowel</option>
                <option value="consonant">Consonant</option>
              </select>

              <SubmitButton label="Test Direct Action" />
            </form>

            {activeTest === 'direct' && directState.success && directState.result && (
              <div className="mt-4 p-4 bg-purple-50 rounded border border-purple-200">
                <p className="font-semibold text-purple-800">✅ Success</p>
                <p className="text-sm text-purple-700 mt-2">
                  Accuracy: {directState.result.accuracy}%
                </p>
                <p className="text-sm text-purple-700">
                  Phonemes: {directState.result.phonemeCount}
                </p>
              </div>
            )}

            {activeTest === 'direct' && directState.errors?._form && (
              <div className="mt-4 p-4 bg-red-50 rounded border border-red-200">
                <p className="font-semibold text-red-800">❌ Error</p>
                <p className="text-sm text-red-700 mt-2">
                  {directState.errors._form[0]}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Standard Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Direct Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Uses Use Case
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">✅ Yes</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">❌ No</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Repository Pattern
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">✅ Yes</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">❌ No</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Adapter Pattern
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">✅ Yes</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">✅ Yes</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Business Logic Validation
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">✅ Yes</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">⚠️ Minimal</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Performance
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">⚡ Good</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">⚡⚡ Faster</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Testability
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">✅ High</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">⚠️ Medium</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Maintainability
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">✅ High</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">⚠️ Medium</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Migration Info */}
        <div className="bg-blue-50 p-6 rounded-lg mt-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Migration Complete</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <p className="font-semibold mb-2">❌ Replaced API Routes:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li><code className="bg-blue-100 px-2 py-1 rounded">/api/phoneme-analysis</code></li>
                <li><code className="bg-blue-100 px-2 py-1 rounded">/api/phoneme-analysis-alt</code></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">✅ New Server Actions:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li><code className="bg-blue-100 px-2 py-1 rounded">analyzeAudioAction()</code></li>
                <li><code className="bg-blue-100 px-2 py-1 rounded">analyzeAudioDirectAction()</code></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
