'use server';

import { z } from 'zod';
import { AnalyzeAudioUseCase } from '../../domain/use-cases/analyze-audio.use-case';
import { PhonemeAnalysisRepositoryImpl } from '../../infrastructure/repositories/phoneme-analysis.repository.impl';
import { PhonemeAnalysisAdapter } from '../../infrastructure/adapters/phoneme-analysis.adapter';
import { PhonemeAnalysisResponseDTOSchema } from '../../infrastructure/dtos/phoneme-analysis.dto';
import { logger } from '@/core/logging/logger';
import { CorrelationManager } from '@/core/logging/correlation';
import { checkResourceAccess } from '@/shared/hooks/use-permission.server';

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
    // Check permissions first (RBAC)
    const hasPermission = await checkResourceAccess('phoneme', 'analyze');
    if (!hasPermission) {
      logger.warn('Permission denied for phoneme analysis', { correlationId });
      return {
        errors: {
          _form: ['No tienes permisos para realizar análisis de fonemas'],
        },
        success: false,
      };
    }
    
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
    
    let errorMessage = 'An unexpected error occurred during analysis';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Provide user-friendly error messages
      if (error.message.includes('Cannot connect to phoneme analysis API')) {
        errorMessage = 'The audio analysis service is currently unavailable. Please try again later.';
      } else if (error.message.includes('Invalid audio file format')) {
        errorMessage = 'Invalid audio format. Please use MP3, WAV, OGG, or M4A files.';
      } else if (error.message.includes('too large')) {
        errorMessage = 'Audio file is too large. Maximum size is 10MB.';
      }
    }
    
    return {
      errors: {
        _form: [errorMessage],
      },
    };
  }
}

/**
 * Direct proxy Server Action - bypasses repository layer
 * Used for simplified direct API communication
 * Replaces: /api/phoneme-analysis-alt
 */
export async function analyzeAudioDirectAction(
  prevState: AnalyzeAudioActionState,
  formData: FormData
): Promise<AnalyzeAudioActionState> {
  const correlationId = CorrelationManager.generate();
  
  try {
    // Check permissions
    const hasPermission = await checkResourceAccess('phoneme', 'analyze');
    if (!hasPermission) {
      await logger.warn('Permission denied for phoneme analysis', { correlationId });
      return {
        errors: {
          _form: ['No tienes permisos para realizar análisis de fonemas'],
        },
        success: false,
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
    
    await logger.info('Direct audio analysis started', {
      correlationId,
      fileName: audioFile.name,
      fileSize: audioFile.size,
      action: 'analyze_audio_direct',
    });
    
    // Convert the file to ArrayBuffer and create new FormData
    const audioBuffer = await audioFile.arrayBuffer();
    const newFile = new File([audioBuffer], audioFile.name || 'recording.webm', {
      type: audioFile.type || 'audio/webm'
    });

    const externalFormData = new FormData();
    externalFormData.append('audioFile', newFile);
    
    // Add optional parameters
    const targetLanguage = formData.get('targetLanguage') as string;
    const analysisType = formData.get('analysisType') as string;
    const expectedText = formData.get('expectedText') as string;
    
    if (targetLanguage) externalFormData.append('targetLanguage', targetLanguage);
    if (analysisType) externalFormData.append('analysisType', analysisType);
    if (expectedText) externalFormData.append('expectedText', expectedText);
    
    // Direct call to external API
    const headers = await CorrelationManager.getHeaders();
    const response = await fetch('http://localhost:5005/api/PhonemeRecognition/analyze-v', {
      method: 'POST',
      body: externalFormData,
      headers: headers as HeadersInit
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      await logger.error('External API error in direct action', undefined, {
        correlationId,
        status: response.status,
        statusText: response.statusText,
        errorDetails: errorText
      });
      
      return {
        errors: {
          _form: [`External API error: ${response.status} ${response.statusText}`],
        },
      };
    }
    
    const data = await response.json();
    const validatedDTO = PhonemeAnalysisResponseDTOSchema.parse(data);
    const result = PhonemeAnalysisAdapter.toDomain(validatedDTO);
    
    await logger.info('Direct audio analysis completed', {
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
    await logger.error('Direct audio analysis failed', error as Error, {
      correlationId,
      action: 'analyze_audio_direct',
    });
    
    let errorMessage = 'An unexpected error occurred during analysis';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
        errorMessage = 'Cannot connect to external API server. Make sure it is running on http://localhost:5005';
      }
    }
    
    return {
      errors: {
        _form: [errorMessage],
      },
    };
  }
}

/**
 * Debug Server Action - provides detailed logging
 * Used for debugging API communication issues
 * Replaces: /api/debug-proxy
 */
export async function analyzeAudioDebugAction(
  prevState: AnalyzeAudioActionState & { debugInfo?: any },
  formData: FormData
): Promise<AnalyzeAudioActionState & { debugInfo?: any }> {
  const correlationId = CorrelationManager.generate();
  const debugInfo: any = {};
  
  try {
    await logger.debug('Debug analysis - analyzing request', { correlationId });
    
    // Log FormData contents
    const formDataEntries: any[] = [];
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        formDataEntries.push({
          key,
          type: 'File',
          name: value.name,
          size: value.size,
          mimeType: value.type
        });
      } else {
        formDataEntries.push({ key, value: String(value) });
      }
    }
    
    debugInfo.receivedFormData = formDataEntries;
    await logger.debug('Received FormData entries', { correlationId, formDataEntries });
    
    // Get audio file
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      await logger.error('No audio file found', undefined, {
        correlationId,
        availableKeys: Array.from(formData.keys())
      });
      
      return {
        errors: {
          audio: ['No audio file provided'],
          _form: [`Available keys: ${Array.from(formData.keys()).join(', ')}`]
        },
        debugInfo: {
          ...debugInfo,
          availableKeys: Array.from(formData.keys())
        }
      };
    }
    
    debugInfo.audioFile = {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type
    };
    
    await logger.debug('Processing audio file', {
      correlationId,
      fileName: audioFile.name,
      fileSize: audioFile.size,
      fileType: audioFile.type
    });
    
    // Create external FormData
    const externalFormData = new FormData();
    externalFormData.append('audioFile', audioFile, audioFile.name);
    
    const externalFormDataEntries: any[] = [];
    for (const [key, value] of externalFormData.entries()) {
      if (value instanceof File) {
        externalFormDataEntries.push({
          key,
          name: value.name,
          size: value.size,
          type: value.type
        });
      }
    }
    
    debugInfo.sentFormData = externalFormDataEntries;
    await logger.debug('Sending to external API', { correlationId, externalFormDataEntries });
    
    // Make request to external API
    const response = await fetch('http://localhost:5005/api/PhonemeRecognition/analyze-v', {
      method: 'POST',
      body: externalFormData,
    });
    
    debugInfo.externalApiResponse = {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    };
    
    await logger.debug('External API response', {
      correlationId,
      status: response.status,
      statusText: response.statusText
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      debugInfo.externalApiError = errorText;
      
      await logger.error('External API error', undefined, {
        correlationId,
        status: response.status,
        errorBody: errorText
      });
      
      return {
        errors: {
          _form: [`External API error: ${response.status} ${response.statusText}`],
        },
        debugInfo
      };
    }
    
    const data = await response.json();
    debugInfo.externalApiData = data;
    
    const validatedDTO = PhonemeAnalysisResponseDTOSchema.parse(data);
    const result = PhonemeAnalysisAdapter.toDomain(validatedDTO);
    
    await logger.info('Debug analysis completed successfully', {
      correlationId,
      analysisId: result.analysisId
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
      },
      debugInfo
    };
    
  } catch (error) {
    debugInfo.error = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : String(error);
    
    await logger.error('Debug analysis failed', error as Error, {
      correlationId,
      action: 'analyze_audio_debug',
    });
    
    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Unknown error'],
      },
      debugInfo
    };
  }
}