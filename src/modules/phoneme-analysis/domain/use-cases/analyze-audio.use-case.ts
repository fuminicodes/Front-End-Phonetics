import { PhonemeAnalysisRepository, AnalysisOptions } from '../repositories/phoneme-analysis.repository.interface';
import { PhonemeAnalysisResult } from '../entities/phoneme-analysis.entity';

export class AnalyzeAudioUseCase {
  constructor(private phonemeRepository: PhonemeAnalysisRepository) {}
  
  async execute(audioFile: File, options?: AnalysisOptions): Promise<PhonemeAnalysisResult> {
    if (!audioFile) {
      throw new Error('Audio file is required');
    }
    
    // Validate file type
    if (!this.isValidAudioFile(audioFile)) {
      throw new Error('Invalid audio file format. Supported formats: MP3, WAV, OGG, M4A');
    }
    
    // Validate file size (max 10MB)
    if (audioFile.size > 10 * 1024 * 1024) {
      throw new Error('Audio file too large. Maximum size is 10MB');
    }
    
    try {
      const result = await this.phonemeRepository.analyzeAudio(audioFile, options);
      
      // Save the analysis for future reference
      await this.phonemeRepository.saveAnalysis(result);
      
      return result;
    } catch (error) {
      throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  private isValidAudioFile(file: File): boolean {
    const validTypes = [
      'audio/mp3',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/m4a',
      'audio/x-m4a'
    ];
    
    return validTypes.includes(file.type) || file.name.match(/\.(mp3|wav|ogg|m4a)$/i) !== null;
  }
}