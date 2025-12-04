// Domain entities for phoneme analysis
export interface PhonemeAnalysisResult {
  readonly analysisId: string;
  readonly originalText: string;
  readonly analysisType: 'pronunciation' | 'vowel' | 'consonant';
  readonly accuracy: number;
  readonly phonemes: Phoneme[];
  readonly feedback: FeedbackItem[];
  readonly createdAt: Date;
}

export interface Phoneme {
  readonly symbol: string;
  readonly position: PhonemePosition;
  readonly accuracy: number;
  readonly duration: number;
  readonly suggestions?: string[];
}

export interface PhonemePosition {
  readonly start: number;
  readonly end: number;
}

export interface FeedbackItem {
  readonly type: 'error' | 'warning' | 'suggestion';
  readonly phoneme: string;
  readonly message: string;
  readonly severity: number;
}