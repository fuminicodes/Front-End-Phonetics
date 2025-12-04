import { appConfig } from './app.config';

export const apiConfig = {
  baseURL: appConfig.API_BASE_URL!,
  timeout: 10000,
  retryAttempts: 3,
  endpoints: {
    phoneme: '/api/phoneme-analysis',
    health: '/api/health',
    debug: '/api/debug'
  }
} as const;

export const phoneAnalysisApiConfig = {
  baseURL: appConfig.PHONEME_ANALYSIS_API_URL!,
  timeout: 15000, // Longer timeout for audio processing
  retryAttempts: 2,
  endpoints: {
    analyze: '/analyze',
    compare: '/compare',
    feedback: '/feedback'
  }
} as const;