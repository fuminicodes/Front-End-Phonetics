'use client';

import { useState, useRef } from 'react';
import { AudioRecorder } from './audio-recorder';
import { AnalysisResults } from './analysis-results';
import { usePhonemeAnalysis } from '../hooks/use-phoneme-analysis';
import { usePhonemeAnalysisParams } from '../hooks/use-phoneme-analysis-params';
import { ErrorBoundary } from '@/shared/ui/error-boundary';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Typography } from '@/shared/ui/typography';
import { ThemeToggle } from '@/shared/ui/theme-toggle';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';

export function PhonemeAnalysisPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { analyzeAudio, isLoading, error, result, success, reset } = usePhonemeAnalysis();
  
  // URL state management with nuqs
  const {
    targetLanguage,
    analysisType,
    expectedText,
    setTargetLanguage,
    setAnalysisType,
    setExpectedText,
  } = usePhonemeAnalysisParams();

  const handleRecordingComplete = (audioBlob: Blob) => {
    // Convert blob to file
    const file = new File([audioBlob], 'recording.webm', { 
      type: 'audio/webm',
      lastModified: Date.now()
    });
    
    setSelectedFile(file);
    
    // Create FormData and trigger analysis using URL params
    const formData = new FormData();
    formData.append('audio', file);
    formData.append('targetLanguage', targetLanguage);
    formData.append('analysisType', analysisType);
    if (expectedText) {
      formData.append('expectedText', expectedText);
    }
    
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

          {/* Analysis Configuration Panel */}
          <Card variant="default">
            <CardHeader>
              <CardTitle>⚙️ Analysis Settings</CardTitle>
              <CardDescription>
                Configure analysis parameters (synced with URL)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Target Language */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Language</label>
                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-accent-secondary/20 bg-surface-primary/50 backdrop-blur-sm"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="pt">Portuguese</option>
                  </select>
                </div>

                {/* Analysis Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Analysis Type</label>
                  <select
                    value={analysisType}
                    onChange={(e) => setAnalysisType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-accent-secondary/20 bg-surface-primary/50 backdrop-blur-sm"
                  >
                    <option value="pronunciation">Pronunciation</option>
                    <option value="vowel">Vowel Analysis</option>
                    <option value="consonant">Consonant Analysis</option>
                  </select>
                </div>

                {/* Expected Text */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expected Text (Optional)</label>
                  <Input
                    placeholder="What should be said..."
                    value={expectedText}
                    onChange={(e) => setExpectedText(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

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