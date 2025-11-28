'use client';

import { useState, useEffect } from 'react';
import { AudioRecorder } from '@/components/AudioRecorder';
import { AnalysisResults } from '@/components/AnalysisResults';
import { PhonemeAnalysisService } from '@/services/phonemeAnalysis';
import { PhonemeAnalysisResponse } from '@/types/api';
import { HeaderDiagnostics } from '@/utils/headerDiagnostics';

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<PhonemeAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [headerIssues, setHeaderIssues] = useState<string[]>([]);

  // Clear any problematic data that might cause large headers
  useEffect(() => {
    try {
      // Run header diagnostics
      const diagnostics = HeaderDiagnostics.diagnoseHeaders();
      
      if (diagnostics.hasIssues) {
        console.warn('Header issues detected:', diagnostics.issues);
        setHeaderIssues(diagnostics.issues);
        
        // Attempt to clear problematic data
        const cleared = HeaderDiagnostics.clearProblematicData();
        if (cleared) {
          console.log('Cleared problematic data');
          // Recheck after clearing
          const recheckDiagnostics = HeaderDiagnostics.diagnoseHeaders();
          setHeaderIssues(recheckDiagnostics.issues);
        }
      }

      // Additional cleanup for localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        // Remove any large stored data that might contribute to header size issues
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          try {
            const value = localStorage.getItem(key);
            if (value && value.length > 1024) { // Clear items larger than 1KB
              localStorage.removeItem(key);
              console.log(`Cleared large localStorage item: ${key}`);
            }
          } catch (e) {
            console.warn('Error checking localStorage item:', key);
          }
        });
      }
    } catch (error) {
      console.warn('Error during initialization cleanup:', error);
    }
  }, []);

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const result = await PhonemeAnalysisService.analyzeAudio(audioBlob);
      setAnalysisResult(result);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🎤 Phonetics Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Record your voice and analyze phoneme patterns using advanced audio processing technology.
            This tool helps identify V phonemes in your speech recordings.
          </p>
        </header>

        <main className="space-y-8">
          {/* Header Issues Warning */}
          {headerIssues.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ Browser Issues Detected</h3>
              <p className="text-red-700 mb-2">
                Some browser data may be causing connection issues. The following problems were found:
              </p>
              <ul className="list-disc list-inside text-red-600 text-sm space-y-1">
                {headerIssues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
              <button
                onClick={() => {
                  HeaderDiagnostics.clearProblematicData();
                  window.location.reload();
                }}
                className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-sm font-medium transition-colors"
              >
                Clear Browser Data & Reload
              </button>
            </div>
          )}

          {/* Audio Recording Section */}
          <AudioRecorder 
            onRecordingComplete={handleRecordingComplete}
            isAnalyzing={isAnalyzing}
          />

          {/* Analysis Results Section */}
          <AnalysisResults 
            result={analysisResult}
            isAnalyzing={isAnalyzing}
            error={analysisError}
          />

          {/* Instructions */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 How to Use</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Click "Start Recording" to begin capturing audio</li>
              <li>Speak clearly into your microphone</li>
              <li>Click "Stop Recording" when finished</li>
              <li>Review your recording using the audio player</li>
              <li>Click "Analyze Phoneme" to process your audio</li>
              <li>View the analysis results showing V phoneme detection</li>
            </ol>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> This app uses a proxy to connect to the phoneme recognition API server at 
                <code className="bg-yellow-100 px-1 py-0.5 rounded ml-1">http://localhost:5005</code>
                <br />
                <span className="text-xs mt-1 block">
                  The proxy handles CORS issues automatically. Make sure the external API server is running.
                </span>
              </p>
            </div>
          </div>
        </main>

        <footer className="text-center mt-12 text-gray-500">
          <p>Powered by Next.js and Web Audio API</p>
        </footer>
      </div>
    </div>
  );
}
