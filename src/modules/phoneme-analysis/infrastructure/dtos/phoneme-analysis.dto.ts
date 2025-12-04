import { z } from 'zod';

export const PhonemeAnalysisResponseDTOSchema = z.object({
  analysis_id: z.string(),
  original_text: z.string().optional().default(''),
  analysis_type: z.enum(['pronunciation', 'vowel', 'consonant']).default('pronunciation'),
  accuracy_score: z.number().min(0).max(100),
  phonemes: z.array(z.object({
    symbol: z.string(),
    start_time: z.number(),
    end_time: z.number(),
    accuracy: z.number().min(0).max(100),
    duration_ms: z.number(),
    suggestions: z.array(z.string()).optional()
  })),
  feedback: z.array(z.object({
    type: z.enum(['error', 'warning', 'suggestion']),
    phoneme_symbol: z.string(),
    message: z.string(),
    severity: z.number().min(1).max(5)
  })),
  created_at: z.string().datetime()
});

export type PhonemeAnalysisResponseDTO = z.infer<typeof PhonemeAnalysisResponseDTOSchema>;

export const AnalysisRequestDTOSchema = z.object({
  target_language: z.string().optional().default('en'),
  analysis_type: z.enum(['pronunciation', 'vowel', 'consonant']).optional().default('pronunciation'),
  expected_text: z.string().optional()
});

export type AnalysisRequestDTO = z.infer<typeof AnalysisRequestDTOSchema>;