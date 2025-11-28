// Service for phoneme analysis API
import { PhonemeAnalysisResponse, ApiError } from '@/types/api';

// Use internal proxy to avoid CORS issues
const PROXY_ENDPOINT = '/api/phoneme-analysis';

export class PhonemeAnalysisService {
  static async analyzeAudio(audioBlob: Blob, fileName: string = 'recording.webm'): Promise<PhonemeAnalysisResponse> {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, fileName);

      const response = await fetch(PROXY_ENDPOINT, {
        method: 'POST',
        body: formData,
        // No need to set headers, browser will handle multipart/form-data
      });

      if (!response.ok) {
        if (response.status >= 400 && response.status < 500) {
          // Try to parse error response
          const errorText = await response.text();
          let errorData: ApiError;
          
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { error: errorText || `HTTP ${response.status}: ${response.statusText}` };
          }
          
          throw new Error(errorData.error || `Client error: ${response.status}`);
        } else {
          throw new Error(`Server error: ${response.status} - ${response.statusText}`);
        }
      }

      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const result = await response.json();
        return result;
      } else {
        // Handle text response
        const textResponse = await response.text();
        try {
          return JSON.parse(textResponse);
        } catch {
          throw new Error('Invalid response format from server');
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred during analysis');
    }
  }
}