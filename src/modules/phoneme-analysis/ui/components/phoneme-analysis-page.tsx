'use client';

import { useState, useRef } from 'react';
import { AudioRecorder } from './audio-recorder';
import { AnalysisResults } from './analysis-results';
import { usePhonemeAnalysis } from '../hooks/use-phoneme-analysis';
import { ErrorBoundary } from '@/shared/ui/error-boundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export function PhonemeAnalysisPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { analyzeAudio, isLoading, error, result, success, reset } = usePhonemeAnalysis();

  const handleRecordingComplete = (audioBlob: Blob) => {
    // Convert blob to file
    const file = new File([audioBlob], 'recording.webm', { 
      type: 'audio/webm',
      lastModified: Date.now()
    });
    
    setSelectedFile(file);
    
    // Create FormData and trigger analysis
    const formData = new FormData();
    formData.append('audio', file);
    formData.append('targetLanguage', 'en');
    formData.append('analysisType', 'pronunciation');
    
    analyzeAudio(formData);
  };

  const handleReset = () => {
    reset();
    setSelectedFile(null);
  };

  const state = {
    errors: error,
    success,
    result
  };

  return (
    <ErrorBoundary level="page">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 space-y-8">
          {/* Header */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-3xl">
                🎵 Phoneme Analysis Tool
              </CardTitle>
              <p className="text-center text-gray-600">
                Record your speech and get detailed phoneme analysis with AI-powered feedback
              </p>
            </CardHeader>
          </Card>

          {/* Audio Recorder */}
          <ErrorBoundary level="section">
            <AudioRecorder
              onRecordingComplete={handleRecordingComplete}
              isAnalyzing={isLoading}
            />
          </ErrorBoundary>

          {/* Analysis Results */}
          <ErrorBoundary level="section">
            <AnalysisResults
              state={state}
              isLoading={isLoading}
              onReset={handleReset}
            />
          </ErrorBoundary>

          {/* Debug Info (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-sm">🔧 Debug Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs font-mono bg-gray-100 p-3 rounded">
                  <p><strong>Loading:</strong> {isLoading.toString()}</p>
                  <p><strong>Success:</strong> {success?.toString() || 'undefined'}</p>
                  <p><strong>Has Error:</strong> {!!error?.toString()}</p>
                  <p><strong>File Selected:</strong> {!!selectedFile}</p>
                  {selectedFile && (
                    <p><strong>File Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}