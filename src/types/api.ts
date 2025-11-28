// Types for Phoneme Recognition API

export interface PhonemeAnalysisResponse {
  fileName?: string;
  isVPhoneme: boolean;
  confidence: number;
  duration: number;
  sampleRate: number;
  message?: string;
}

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
}

export interface ApiError {
  error: string;
  details?: ProblemDetails;
}