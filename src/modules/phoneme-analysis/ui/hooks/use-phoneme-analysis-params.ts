/**
 * URL state management for phoneme analysis parameters
 * 
 * Uses nuqs to sync analysis configuration with URL query params,
 * allowing users to share links with specific settings.
 */

import { useQueryStates, parseAsString, parseAsStringEnum } from 'nuqs';

export type AnalysisType = 'pronunciation' | 'vowel' | 'consonant';

export type TargetLanguage = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt';

export interface PhonemeAnalysisParams {
  targetLanguage: TargetLanguage;
  analysisType: AnalysisType;
  expectedText: string;
}

/**
 * Hook to manage phoneme analysis parameters in the URL
 * 
 * @example
 * const { targetLanguage, analysisType, expectedText, setParams } = usePhonemeAnalysisParams();
 * 
 * // Update URL: ?targetLanguage=en&analysisType=vowel&expectedText=hello
 * setParams({ targetLanguage: 'en', analysisType: 'vowel' });
 */
export function usePhonemeAnalysisParams() {
  const [params, setParams] = useQueryStates({
    targetLanguage: parseAsStringEnum<TargetLanguage>([
      'en', 'es', 'fr', 'de', 'it', 'pt'
    ]).withDefault('en'),
    analysisType: parseAsStringEnum<AnalysisType>([
      'pronunciation', 'vowel', 'consonant'
    ]).withDefault('pronunciation'),
    expectedText: parseAsString.withDefault(''),
  });

  return {
    targetLanguage: params.targetLanguage,
    analysisType: params.analysisType,
    expectedText: params.expectedText,
    setParams,
    setTargetLanguage: (value: TargetLanguage) => setParams({ targetLanguage: value }),
    setAnalysisType: (value: AnalysisType) => setParams({ analysisType: value }),
    setExpectedText: (value: string) => setParams({ expectedText: value }),
  };
}
