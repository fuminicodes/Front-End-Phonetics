'use client';

import { useState, useRef } from 'react';
import { AudioRecorder } from './audio-recorder';
import { AnalysisResults } from './analysis-results';
import { usePhonemeAnalysis } from '../hooks/use-phoneme-analysis';
import { ErrorBoundary } from '@/shared/ui/error-boundary';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Typography } from '@/shared/ui/typography';
import { ThemeToggle } from '@/shared/ui/theme-toggle';

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
      {/* Theme Toggle */}
      <ThemeToggle />
      
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 space-y-8 max-w-4xl">
          {/* Header */}
          <header className="text-center space-y-6">
            <Typography variant="h1" className="text-center">
              🎵 Phoneme Analysis Tool
            </Typography>
            <Typography variant="p" className="text-center text-lg max-w-2xl mx-auto">
              Record your speech and get detailed phoneme analysis with AI-powered feedback using our advanced glassmorphism interface
            </Typography>
          </header>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Audio Recorder - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <ErrorBoundary level="section">
                <Card variant="elevated" className="h-full">
                  <CardHeader>
                    <CardTitle>🎙️ Audio Recording</CardTitle>
                    <CardDescription>
                      Click the record button to capture your speech for analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AudioRecorder
                      onRecordingComplete={handleRecordingComplete}
                      isAnalyzing={isLoading}
                    />
                  </CardContent>
                </Card>
              </ErrorBoundary>
            </div>

            {/* Quick Info Panel */}
            <div className="space-y-6">
              <Card variant="default">
                <CardHeader>
                  <CardTitle>ℹ️ How it Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <p>1. Click the record button</p>
                    <p>2. Speak clearly into your microphone</p>
                    <p>3. Stop recording when finished</p>
                    <p>4. Get instant AI analysis</p>
                  </div>
                </CardContent>
              </Card>
              
              {selectedFile && (
                <Card variant="flat">
                  <CardHeader>
                    <CardTitle className="text-lg">📁 File Info</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-1">
                      <p><strong>Name:</strong> {selectedFile.name}</p>
                      <p><strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
                      <p><strong>Type:</strong> {selectedFile.type}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

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
            <Card variant="flat" className="border-dashed border-accent-secondary/30">
              <CardHeader>
                <CardTitle className="text-sm">🔧 Debug Info</CardTitle>
                <CardDescription>Development debug information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xs font-mono glass-panel p-4 rounded-lg bg-black/5 dark:bg-white/5">
                  <div className="space-y-1">
                    <p><strong>Loading:</strong> {isLoading.toString()}</p>
                    <p><strong>Success:</strong> {success?.toString() || 'undefined'}</p>
                    <p><strong>Has Error:</strong> {!!error?.toString()}</p>
                    <p><strong>File Selected:</strong> {!!selectedFile}</p>
                    {selectedFile && (
                      <p><strong>File Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}