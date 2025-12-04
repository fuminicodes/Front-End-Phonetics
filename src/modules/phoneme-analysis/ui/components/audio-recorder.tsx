'use client';

import { useAudioRecorder } from '@/shared/hooks/use-audio-recorder';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { ErrorBoundary } from '@/shared/ui/error-boundary';

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
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">🎤 Audio Recording</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recording Controls */}
          <div className="flex flex-col items-center space-y-4">
            {!isRecording && !audioBlob && (
              <Button
                onClick={startRecording}
                disabled={isAnalyzing}
                size="lg"
                className="px-8 py-4"
              >
                🎤 Start Recording
              </Button>
            )}

            {isRecording && (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-600 font-semibold">Recording...</span>
                </div>
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  size="lg"
                >
                  ⏹️ Stop Recording
                </Button>
              </div>
            )}

            {audioBlob && audioUrl && (
              <div className="w-full space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-2 text-center">
                    ✅ Recording Complete
                  </h3>
                  <audio 
                    controls 
                    src={audioUrl} 
                    className="w-full" 
                    preload="metadata"
                  />
                </div>
                
                <div className="flex space-x-4 justify-center">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    loading={isAnalyzing}
                    variant="default"
                    size="default"
                  >
                    {isAnalyzing ? 'Analyzing...' : '🔍 Analyze Phonemes'}
                  </Button>
                  <Button
                    onClick={clearRecording}
                    disabled={isAnalyzing}
                    variant="outline"
                    size="default"
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
                  <p className="font-semibold">Recording Error:</p>
                  <p>{error}</p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Instructions */}
          {!isRecording && !audioBlob && !error && (
            <div className="text-center text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              <p className="mb-2">📋 <strong>Instructions:</strong></p>
              <ul className="text-left inline-block space-y-1">
                <li>• Click "Start Recording" to begin</li>
                <li>• Speak clearly into your microphone</li>
                <li>• Click "Stop Recording" when finished</li>
                <li>• Review your audio and click "Analyze Phonemes"</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};