'use client';

import { useAudioRecorder } from '@/shared/hooks/use-audio-recorder';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { ErrorBoundary } from '@/shared/ui/error-boundary';
import { Typography } from '@/shared/ui/typography';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isAnalyzing: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  isAnalyzing
}) => {
  const {
    isRecording,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    clearRecording,
    error
  } = useAudioRecorder();

  const handleAnalyze = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob);
    }
  };

  return (
    <ErrorBoundary level="component">
      <div className="space-y-6">
        {/* Recording Controls */}
        <div className="flex flex-col items-center space-y-6">
          {!isRecording && !audioBlob && (
            <Button
              onClick={startRecording}
              disabled={isAnalyzing}
              size="xl"
              variant="solid"
              className="min-w-48"
            >
              🎤 Start Recording
            </Button>
          )}

          {isRecording && (
            <div className="text-center space-y-6">
              <Card variant="elevated" className="glass-panel bg-danger-50 dark:bg-danger-900/20 border-danger-500/30">
                <CardContent className="py-6">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className="w-4 h-4 bg-danger-500 rounded-full animate-pulse"></div>
                    <Typography variant="p" className="text-danger-700 dark:text-danger-300 font-semibold text-lg">
                      Recording in progress...
                    </Typography>
                  </div>
                  <Typography variant="small" className="text-danger-600 dark:text-danger-400">
                    Speak clearly into your microphone
                  </Typography>
                </CardContent>
              </Card>
              
              <Button
                onClick={stopRecording}
                variant="destructive"
                size="lg"
                className="min-w-40"
              >
                ⏹️ Stop Recording
              </Button>
            </div>
          )}

          {audioBlob && audioUrl && (
            <div className="w-full space-y-6">
              <Card variant="elevated" className="glass-panel bg-success-50 dark:bg-success-900/20 border-success-500/30">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-success-700 dark:text-success-300">
                    ✅ Recording Complete
                  </CardTitle>
                  <CardDescription className="text-success-600 dark:text-success-400">
                    Your audio is ready for analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <audio 
                    controls 
                    src={audioUrl} 
                    className="w-full glass-panel" 
                    preload="metadata"
                  />
                </CardContent>
              </Card>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  loading={isAnalyzing}
                  variant="solid"
                  size="lg"
                  className="min-w-40"
                >
                  {isAnalyzing ? 'Analyzing...' : '🔍 Analyze Phonemes'}
                </Button>
                <Button
                  onClick={clearRecording}
                  disabled={isAnalyzing}
                  variant="glass"
                  size="lg"
                  className="min-w-36"
                >
                  🗑️ Clear Recording
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              <div>
                <Typography variant="p" className="font-semibold">Recording Error:</Typography>
                <Typography variant="p">{error}</Typography>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        {!isRecording && !audioBlob && !error && (
          <Card variant="flat" className="glass-panel bg-info-50/50 dark:bg-info-900/10 border-info-500/20">
            <CardContent className="py-6">
              <Typography variant="p" className="text-center mb-4 font-semibold text-info-700 dark:text-info-300">
                📋 Instructions
              </Typography>
              <div className="space-y-2 max-w-md mx-auto">
                <div className="flex items-start space-x-3">
                  <span className="text-primary-500 font-semibold">1.</span>
                  <Typography variant="small">Click "Start Recording" to begin</Typography>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-primary-500 font-semibold">2.</span>
                  <Typography variant="small">Speak clearly into your microphone</Typography>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-primary-500 font-semibold">3.</span>
                  <Typography variant="small">Click "Stop Recording" when finished</Typography>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-primary-500 font-semibold">4.</span>
                  <Typography variant="small">Review your audio and click "Analyze Phonemes"</Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ErrorBoundary>
  );
};