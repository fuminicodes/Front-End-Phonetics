// Phoneme Analysis Module Exports
export { PhonemeAnalysisPage } from './ui/components/phoneme-analysis-page';
export { AudioRecorder } from './ui/components/audio-recorder';
export { AnalysisResults } from './ui/components/analysis-results';

// Hooks
export { usePhonemeAnalysis } from './ui/hooks/use-phoneme-analysis';

// Actions
export { analyzeAudioAction } from './ui/actions/phoneme-analysis.actions';
export type { AnalyzeAudioActionState } from './ui/actions/phoneme-analysis.actions';

// Domain Entities
export type { 
  PhonemeAnalysisResult, 
  Phoneme, 
  PhonemePosition, 
  FeedbackItem 
} from './domain/entities/phoneme-analysis.entity';