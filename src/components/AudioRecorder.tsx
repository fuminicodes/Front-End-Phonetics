// Audio recording component
'use client';

import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { AudioPlayer } from 'react-wave-audio-player';

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
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Audio Recording</h2>
        
        {/* Recording Controls */}
        <div className="space-y-4">
          {!isRecording && !audioBlob && (
            <button
              onClick={startRecording}
              disabled={isAnalyzing}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              🎤 Start Recording
            </button>
          )}

          {isRecording && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-600 font-semibold">Recording...</span>
              </div>
              <button
                onClick={stopRecording}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                ⏹️ Stop Recording
              </button>
            </div>
          )}

          {audioBlob && audioUrl && (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Recording Complete</h3>
                <div className="w-full">
                  <AudioPlayer
                    src={audioUrl}
                    waveColor="#a3aed0"
                    progressColor="#059669"
                    cursorColor="#059669"
                    buttonsColor="#059669"
                    barWidth={2}
                    barRadius={2}
                    barGap={1}
                    height={80}
                    className="bg-white border border-green-200 rounded-lg shadow-sm"
                    onPlay={() => console.log('Audio started playing')}
                    onPause={() => console.log('Audio paused')}
                  />
                </div>
              </div>
              
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  {isAnalyzing ? '🔄 Analyzing...' : '🔍 Analyze Phoneme'}
                </button>
                <button
                  onClick={clearRecording}
                  disabled={isAnalyzing}
                  className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  🗑️ Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4">
            <p className="font-semibold">Recording Error:</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};