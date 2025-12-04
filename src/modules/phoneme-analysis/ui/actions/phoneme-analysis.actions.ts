'use server';

import { z } from 'zod';
import { AnalyzeAudioUseCase } from '../../domain/use-cases/analyze-audio.use-case';
import { PhonemeAnalysisRepositoryImpl } from '../../infrastructure/repositories/phoneme-analysis.repository.impl';
import { logger } from '@/core/logging/logger';
import { CorrelationManager } from '@/core/logging/correlation';

const AnalyzeAudioFormSchema = z.object({
  targetLanguage: z.string().optional(),
  analysisType: z.enum(['pronunciation', 'vowel', 'consonant']).optional(),
  expectedText: z.string().optional(),
});

export type AnalyzeAudioActionState = {
  errors?: {
    audio?: string[];
    targetLanguage?: string[];
    analysisType?: string[];
    _form?: string[];
  };
  success?: boolean;
  result?: {
    analysisId: string;
    accuracy: number;
    phonemeCount: number;
    feedback: Array<{
      type: string;
      message: string;
      severity: number;
    }>;
  };
};

export async function analyzeAudioAction(
  prevState: AnalyzeAudioActionState,
  formData: FormData
): Promise<AnalyzeAudioActionState> {
  const correlationId = CorrelationManager.generate();
  
  try {
    // Validate form data
    const validatedFields = AnalyzeAudioFormSchema.safeParse({
      targetLanguage: formData.get('targetLanguage'),
      analysisType: formData.get('analysisType'),
      expectedText: formData.get('expectedText'),
    });
    
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    // Get audio file
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile || audioFile.size === 0) {
      return {
        errors: {
          audio: ['Audio file is required'],
        },
      };
    }
    
    await logger.info('Audio analysis action started', {
      correlationId,
      fileName: audioFile.name,
      fileSize: audioFile.size,
      action: 'analyze_audio',
    });
    
    // Execute use case
    const repository = new PhonemeAnalysisRepositoryImpl();
    const analyzeAudioUseCase = new AnalyzeAudioUseCase(repository);
    
    const result = await analyzeAudioUseCase.execute(audioFile, {
      targetLanguage: validatedFields.data.targetLanguage || 'en',
      analysisType: validatedFields.data.analysisType || 'pronunciation',
      expectedText: validatedFields.data.expectedText,
    });
    
    await logger.info('Audio analysis completed successfully', {
      correlationId,
      analysisId: result.analysisId,
      accuracy: result.accuracy,
    });
    
    return {
      success: true,
      result: {
        analysisId: result.analysisId,
        accuracy: result.accuracy,
        phonemeCount: result.phonemes.length,
        feedback: result.feedback.map(item => ({
          type: item.type,
          message: item.message,
          severity: item.severity
        }))
      }
    };
    
  } catch (error) {
    await logger.error('Audio analysis action failed', error as Error, {
      correlationId,
      action: 'analyze_audio',
    });
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred during analysis';
    
    return {
      errors: {
        _form: [errorMessage],
      },
    };
  }
}