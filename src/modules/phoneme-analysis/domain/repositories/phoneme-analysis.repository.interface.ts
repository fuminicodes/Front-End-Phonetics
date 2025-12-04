import { PhonemeAnalysisResult } from '../entities/phoneme-analysis.entity';

export interface PhonemeAnalysisRepository {
  analyzeAudio(audioFile: File, options?: AnalysisOptions): Promise<PhonemeAnalysisResult>;
  getAnalysis(analysisId: string): Promise<PhonemeAnalysisResult | null>;
  saveAnalysis(result: PhonemeAnalysisResult): Promise<PhonemeAnalysisResult>;
  deleteAnalysis(analysisId: string): Promise<void>;
}

export interface AnalysisOptions {
  targetLanguage?: string;
  analysisType?: 'pronunciation' | 'vowel' | 'consonant';
  expectedText?: string;
}