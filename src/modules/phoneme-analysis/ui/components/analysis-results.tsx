'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Skeleton } from '@/shared/ui/skeleton';
import { Button } from '@/shared/ui/button';
import { ErrorBoundary } from '@/shared/ui/error-boundary';
import { AnalyzeAudioActionState } from '../actions/phoneme-analysis.actions';

interface AnalysisResultsProps {
  state: AnalyzeAudioActionState;
  isLoading: boolean;
  onReset: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  state,
  isLoading,
  onReset
}) => {
  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">🔬 Analyzing Audio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-blue-600">Processing your recording...</p>
            <div className="space-y-2 max-w-md mx-auto">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (state.errors?._form) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-red-600">❌ Analysis Error</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              <div className="space-y-2">
                {state.errors._form.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            </AlertDescription>
          </Alert>
          <div className="text-center">
            <Button onClick={onReset} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!state.result && !state.success) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">📊 Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">
            <div className="mb-4">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-lg">Ready for Analysis</p>
              <p>Record audio and click "Analyze Phonemes" to see results</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (state.success && state.result) {
    const { result } = state;
    const accuracyColor = result.accuracy >= 80 ? 'text-green-600' : 
                         result.accuracy >= 60 ? 'text-yellow-600' : 
                         'text-red-600';
    
    const accuracyBgColor = result.accuracy >= 80 ? 'bg-green-50 border-green-200' : 
                           result.accuracy >= 60 ? 'bg-yellow-50 border-yellow-200' : 
                           'bg-red-50 border-red-200';

    return (
      <ErrorBoundary level="component">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">✨ Analysis Complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Score */}
            <div className={`p-6 rounded-lg border-2 ${accuracyBgColor}`}>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Overall Accuracy</h3>
                <div className={`text-4xl font-bold ${accuracyColor}`}>
                  {result.accuracy}%
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Analysis ID: {result.analysisId}
                </div>
              </div>
            </div>

            {/* Phoneme Count */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">📊 Phonemes Detected</h4>
                <p className="text-2xl font-bold text-blue-600">{result.phonemeCount}</p>
                <p className="text-sm text-blue-600">Individual sounds analyzed</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">💬 Feedback Items</h4>
                <p className="text-2xl font-bold text-purple-600">{result.feedback.length}</p>
                <p className="text-sm text-purple-600">Suggestions and corrections</p>
              </div>
            </div>

            {/* Feedback */}
            {result.feedback.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">🎯 Feedback & Suggestions</h3>
                <div className="space-y-3">
                  {result.feedback.map((item, index) => {
                    const severityColor = item.severity >= 4 ? 'border-red-200 bg-red-50' :
                                        item.severity >= 3 ? 'border-yellow-200 bg-yellow-50' :
                                        'border-green-200 bg-green-50';
                    
                    const iconMap = {
                      error: '❌',
                      warning: '⚠️',
                      suggestion: '💡'
                    };

                    return (
                      <div key={index} className={`p-4 rounded-lg border ${severityColor}`}>
                        <div className="flex items-start space-x-3">
                          <span className="text-lg">{iconMap[item.type as keyof typeof iconMap] || '📝'}</span>
                          <div className="flex-1">
                            <p className="font-medium capitalize">{item.type}</p>
                            <p className="text-gray-700">{item.message}</p>
                            <div className="flex items-center mt-1 space-x-2">
                              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                Severity: {item.severity}/5
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-center space-x-4">
              <Button onClick={onReset} variant="outline">
                Analyze Another Recording
              </Button>
            </div>
          </CardContent>
        </Card>
      </ErrorBoundary>
    );
  }

  return null;
};