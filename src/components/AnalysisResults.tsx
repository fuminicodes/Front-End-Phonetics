// Analysis results component
'use client';

import { PhonemeAnalysisResponse } from '@/types/api';

interface AnalysisResultsProps {
  result: PhonemeAnalysisResponse | null;
  isAnalyzing: boolean;
  error: string | null;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  result,
  isAnalyzing,
  error
}) => {
  if (isAnalyzing) {
    return (
      <div className="p-6 bg-blue-50 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-blue-800">Analyzing Audio...</h3>
          <p className="text-blue-600">Please wait while we process your recording</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg shadow-lg">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Analysis Error</h3>
          <p className="text-red-600">{error}</p>
          <div className="mt-4 text-sm text-red-500">
            <p>Make sure the API server is running at http://localhost:5005</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">📊 Analysis Results</h3>
          <p className="text-gray-500">Record audio and click "Analyze Phoneme" to see results</p>
        </div>
      </div>
    );
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPhonemeIndicator = (isVPhoneme: boolean) => {
    return isVPhoneme 
      ? { icon: '✅', text: 'V Phoneme Detected', color: 'text-green-600' }
      : { icon: '❌', text: 'No V Phoneme', color: 'text-red-600' };
  };

  const phonemeInfo = getPhonemeIndicator(result.isVPhoneme);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">📊 Analysis Results</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Result */}
        <div className="col-span-1 md:col-span-2">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className={`text-3xl mb-2 ${phonemeInfo.color}`}>
              {phonemeInfo.icon}
            </div>
            <h4 className={`text-xl font-semibold ${phonemeInfo.color}`}>
              {phonemeInfo.text}
            </h4>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="font-semibold text-gray-700 mb-2">Confidence Level</h5>
          <div className={`text-2xl font-bold px-3 py-1 rounded ${getConfidenceColor(result.confidence)}`}>
            {(result.confidence * 100).toFixed(1)}%
          </div>
        </div>

        {/* Duration */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="font-semibold text-gray-700 mb-2">Duration</h5>
          <div className="text-2xl font-bold text-blue-600">
            {result.duration.toFixed(2)}s
          </div>
        </div>

        {/* Sample Rate */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="font-semibold text-gray-700 mb-2">Sample Rate</h5>
          <div className="text-lg font-bold text-purple-600">
            {result.sampleRate.toLocaleString()} Hz
          </div>
        </div>

        {/* File Name */}
        {result.fileName && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-700 mb-2">File Name</h5>
            <div className="text-lg text-gray-600 break-all">
              {result.fileName}
            </div>
          </div>
        )}
      </div>

      {/* Message */}
      {result.message && (
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <h5 className="font-semibold text-blue-700 mb-2">Additional Information</h5>
          <p className="text-blue-600">{result.message}</p>
        </div>
      )}
    </div>
  );
};