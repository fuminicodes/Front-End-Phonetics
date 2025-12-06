import { PhonemeAnalysisRepository, AnalysisOptions } from '../../domain/repositories/phoneme-analysis.repository.interface';
import { PhonemeAnalysisResult } from '../../domain/entities/phoneme-analysis.entity';
import { PhonemeAnalysisAdapter } from '../adapters/phoneme-analysis.adapter';
import { PhonemeAnalysisResponseDTOSchema, AnalysisRequestDTO } from '../dtos/phoneme-analysis.dto';
import { phoneAnalysisApiConfig } from '@/core/config/api.config';
import { CorrelationManager } from '@/core/logging/correlation';
import { logger } from '@/core/logging/logger';

export class PhonemeAnalysisRepositoryImpl implements PhonemeAnalysisRepository {
  private baseURL = `${phoneAnalysisApiConfig.baseURL}`;
  
  async analyzeAudio(audioFile: File, options?: AnalysisOptions): Promise<PhonemeAnalysisResult> {
    const correlationId = await CorrelationManager.getCurrent();
    
    try {
      await logger.info('Starting phoneme analysis', {
        correlationId,
        fileName: audioFile.name,
        fileSize: audioFile.size,
        options
      });

      // Create FormData for the external API
      const formData = new FormData();
      // Note: External API expects 'audioFile' field name
      formData.append('audioFile', audioFile);
      
      // Add optional parameters if provided
      if (options?.targetLanguage) {
        formData.append('targetLanguage', options.targetLanguage);
      }
      if (options?.analysisType) {
        formData.append('analysisType', options.analysisType);
      }
      if (options?.expectedText) {
        formData.append('expectedText', options.expectedText);
      }

      const headers = await CorrelationManager.getHeaders();

      // Call external phoneme analysis API directly
      const apiUrl = 'http://localhost:5005/api/PhonemeRecognition/analyze-v';
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type manually for FormData
        headers: headers as HeadersInit
      });

      if (!response.ok) {
        const errorText = await response.text();
        await logger.error('Phoneme analysis API error', undefined, {
          correlationId,
          status: response.status,
          statusText: response.statusText,
          errorDetails: errorText
        });
        
        throw new Error(`External API error: ${response.status} ${response.statusText}. Details: ${errorText}`);
      }

      const data = await response.json();
      const validatedDTO = PhonemeAnalysisResponseDTOSchema.parse(data);
      const result = PhonemeAnalysisAdapter.toDomain(validatedDTO);

      await logger.info('Phoneme analysis completed successfully', {
        correlationId,
        analysisId: result.analysisId,
        accuracy: result.accuracy,
        phonemeCount: result.phonemes.length
      });

      return result;
    } catch (error) {
      await logger.error('Phoneme analysis failed', error as Error, {
        correlationId,
        fileName: audioFile.name
      });
      
      // Check for connection errors
      if (error instanceof Error) {
        if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
          throw new Error('Cannot connect to phoneme analysis API. Make sure the service is running on http://localhost:5005');
        }
      }
      
      throw error;
    }
  }
  
  async getAnalysis(analysisId: string): Promise<PhonemeAnalysisResult | null> {
    // Implementation for retrieving stored analysis
    // This would typically fetch from a database or cache
    throw new Error('Method not implemented yet - requires storage backend');
  }
  
  async saveAnalysis(result: PhonemeAnalysisResult): Promise<PhonemeAnalysisResult> {
    // Implementation for saving analysis result
    // This would typically save to a database or cache
    await logger.info('Analysis saved (mock)', {
      analysisId: result.analysisId
    });
    
    return result;
  }
  
  async deleteAnalysis(analysisId: string): Promise<void> {
    // Implementation for deleting analysis
    throw new Error('Method not implemented yet - requires storage backend');
  }
}