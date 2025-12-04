import { PhonemeAnalysisResult, Phoneme, PhonemePosition, FeedbackItem } from '../../domain/entities/phoneme-analysis.entity';
import { PhonemeAnalysisResponseDTO } from '../dtos/phoneme-analysis.dto';

export class PhonemeAnalysisAdapter {
  static toDomain(dto: PhonemeAnalysisResponseDTO): PhonemeAnalysisResult {
    return {
      analysisId: dto.analysis_id,
      originalText: dto.original_text,
      analysisType: dto.analysis_type,
      accuracy: dto.accuracy_score,
      phonemes: dto.phonemes.map(phoneme => ({
        symbol: phoneme.symbol,
        position: {
          start: phoneme.start_time,
          end: phoneme.end_time
        } as PhonemePosition,
        accuracy: phoneme.accuracy,
        duration: phoneme.duration_ms,
        suggestions: phoneme.suggestions
      } as Phoneme)),
      feedback: dto.feedback.map(feedback => ({
        type: feedback.type,
        phoneme: feedback.phoneme_symbol,
        message: feedback.message,
        severity: feedback.severity
      } as FeedbackItem)),
      createdAt: new Date(dto.created_at)
    };
  }
  
  static toDTO(entity: PhonemeAnalysisResult): PhonemeAnalysisResponseDTO {
    return {
      analysis_id: entity.analysisId,
      original_text: entity.originalText,
      analysis_type: entity.analysisType,
      accuracy_score: entity.accuracy,
      phonemes: entity.phonemes.map(phoneme => ({
        symbol: phoneme.symbol,
        start_time: phoneme.position.start,
        end_time: phoneme.position.end,
        accuracy: phoneme.accuracy,
        duration_ms: phoneme.duration,
        suggestions: phoneme.suggestions
      })),
      feedback: entity.feedback.map(feedback => ({
        type: feedback.type,
        phoneme_symbol: feedback.phoneme,
        message: feedback.message,
        severity: feedback.severity
      })),
      created_at: entity.createdAt.toISOString()
    };
  }
}