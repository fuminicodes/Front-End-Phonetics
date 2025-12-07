import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AnalyzeAudioUseCase } from '../analyze-audio.use-case';
import type { PhonemeAnalysisRepository, AnalysisOptions } from '../../repositories/phoneme-analysis.repository.interface';
import type { PhonemeAnalysisResult } from '../../entities/phoneme-analysis.entity';

/**
 * Unit Tests for AnalyzeAudioUseCase
 * 
 * Tests cover:
 * - Happy path scenarios
 * - Error handling (missing file, invalid format, size limits)
 * - File validation
 * - Repository interaction
 */
describe('AnalyzeAudioUseCase', () => {
  let useCase: AnalyzeAudioUseCase;
  let mockRepository: PhonemeAnalysisRepository;
  let mockAnalysisResult: PhonemeAnalysisResult;

  beforeEach(() => {
    // Create mock analysis result
    mockAnalysisResult = {
      analysisId: 'test-analysis-id',
      originalText: 'Hello world',
      analysisType: 'pronunciation',
      accuracy: 85.5,
      phonemes: [
        {
          symbol: 'h',
          position: { start: 0, end: 0.5 },
          accuracy: 90,
          duration: 0.5,
          suggestions: ['Improve aspiration'],
        },
        {
          symbol: 'ɛ',
          position: { start: 0.5, end: 1.0 },
          accuracy: 80,
          duration: 0.5,
        },
      ],
      feedback: [
        {
          type: 'suggestion',
          phoneme: 'h',
          message: 'Try to add more aspiration',
          severity: 2,
        },
      ],
      createdAt: new Date('2025-12-06T10:00:00Z'),
    };

    // Create mock repository with spies
    mockRepository = {
      analyzeAudio: vi.fn().mockResolvedValue(mockAnalysisResult),
      getAnalysis: vi.fn().mockResolvedValue(mockAnalysisResult),
      saveAnalysis: vi.fn().mockResolvedValue(mockAnalysisResult),
      deleteAnalysis: vi.fn().mockResolvedValue(undefined),
    };

    useCase = new AnalyzeAudioUseCase(mockRepository);
  });

  describe('Happy Path', () => {
    it('should successfully analyze a valid MP3 audio file', async () => {
      // Arrange
      const audioFile = new File(['audio content'], 'test-audio.mp3', {
        type: 'audio/mp3',
      });
      const options: AnalysisOptions = {
        targetLanguage: 'en-US',
        analysisType: 'pronunciation',
      };

      // Act
      const result = await useCase.execute(audioFile, options);

      // Assert
      expect(result).toEqual(mockAnalysisResult);
      expect(mockRepository.analyzeAudio).toHaveBeenCalledWith(audioFile, options);
      expect(mockRepository.analyzeAudio).toHaveBeenCalledTimes(1);
      expect(mockRepository.saveAnalysis).toHaveBeenCalledWith(mockAnalysisResult);
      expect(mockRepository.saveAnalysis).toHaveBeenCalledTimes(1);
    });

    it('should successfully analyze a valid WAV audio file', async () => {
      // Arrange
      const audioFile = new File(['audio content'], 'recording.wav', {
        type: 'audio/wav',
      });

      // Act
      const result = await useCase.execute(audioFile);

      // Assert
      expect(result).toEqual(mockAnalysisResult);
      expect(mockRepository.analyzeAudio).toHaveBeenCalledWith(audioFile, undefined);
    });

    it('should accept audio file with MPEG type', async () => {
      // Arrange
      const audioFile = new File(['audio content'], 'song.mp3', {
        type: 'audio/mpeg',
      });

      // Act
      const result = await useCase.execute(audioFile);

      // Assert
      expect(result).toBeDefined();
      expect(result.analysisId).toBe('test-analysis-id');
    });

    it('should accept audio file with M4A format', async () => {
      // Arrange
      const audioFile = new File(['audio content'], 'voice.m4a', {
        type: 'audio/m4a',
      });

      // Act
      const result = await useCase.execute(audioFile);

      // Assert
      expect(result).toBeDefined();
    });

    it('should pass analysis options to repository', async () => {
      // Arrange
      const audioFile = new File(['audio content'], 'test.mp3', {
        type: 'audio/mp3',
      });
      const options: AnalysisOptions = {
        targetLanguage: 'es-ES',
        analysisType: 'vowel',
        expectedText: 'Hola mundo',
      };

      // Act
      await useCase.execute(audioFile, options);

      // Assert
      expect(mockRepository.analyzeAudio).toHaveBeenCalledWith(audioFile, options);
    });
  });

  describe('Error Handling', () => {
    it('should throw error when audio file is null', async () => {
      // Act & Assert
      await expect(useCase.execute(null as any)).rejects.toThrow('Audio file is required');
      expect(mockRepository.analyzeAudio).not.toHaveBeenCalled();
    });

    it('should throw error when audio file is undefined', async () => {
      // Act & Assert
      await expect(useCase.execute(undefined as any)).rejects.toThrow('Audio file is required');
      expect(mockRepository.analyzeAudio).not.toHaveBeenCalled();
    });

    it('should throw error for invalid file format (PDF)', async () => {
      // Arrange
      const invalidFile = new File(['pdf content'], 'document.pdf', {
        type: 'application/pdf',
      });

      // Act & Assert
      await expect(useCase.execute(invalidFile)).rejects.toThrow(
        'Invalid audio file format. Supported formats: MP3, WAV, OGG, M4A'
      );
      expect(mockRepository.analyzeAudio).not.toHaveBeenCalled();
    });

    it('should throw error for invalid file format (text)', async () => {
      // Arrange
      const invalidFile = new File(['text content'], 'text.txt', {
        type: 'text/plain',
      });

      // Act & Assert
      await expect(useCase.execute(invalidFile)).rejects.toThrow(
        'Invalid audio file format'
      );
    });

    it('should throw error when file size exceeds 10MB', async () => {
      // Arrange
      const largeContent = new Array(11 * 1024 * 1024).fill('a').join(''); // 11MB
      const largeFile = new File([largeContent], 'large-audio.mp3', {
        type: 'audio/mp3',
      });

      // Act & Assert
      await expect(useCase.execute(largeFile)).rejects.toThrow(
        'Audio file too large. Maximum size is 10MB'
      );
      expect(mockRepository.analyzeAudio).not.toHaveBeenCalled();
    });

    it('should accept file exactly at 10MB limit', async () => {
      // Arrange
      const exactContent = new Array(10 * 1024 * 1024).fill('a').join(''); // Exactly 10MB
      const exactFile = new File([exactContent], 'exact-size.mp3', {
        type: 'audio/mp3',
      });

      // Act
      const result = await useCase.execute(exactFile);

      // Assert
      expect(result).toBeDefined();
      expect(mockRepository.analyzeAudio).toHaveBeenCalled();
    });

    it('should wrap repository errors with descriptive message', async () => {
      // Arrange
      const audioFile = new File(['audio content'], 'test.mp3', {
        type: 'audio/mp3',
      });
      const repositoryError = new Error('Network timeout');
      mockRepository.analyzeAudio = vi.fn().mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(useCase.execute(audioFile)).rejects.toThrow(
        'Analysis failed: Network timeout'
      );
    });

    it('should handle unknown errors from repository', async () => {
      // Arrange
      const audioFile = new File(['audio content'], 'test.mp3', {
        type: 'audio/mp3',
      });
      mockRepository.analyzeAudio = vi.fn().mockRejectedValue('Unknown error');

      // Act & Assert
      await expect(useCase.execute(audioFile)).rejects.toThrow(
        'Analysis failed: Unknown error'
      );
    });

    it('should not call saveAnalysis if analyzeAudio fails', async () => {
      // Arrange
      const audioFile = new File(['audio content'], 'test.mp3', {
        type: 'audio/mp3',
      });
      mockRepository.analyzeAudio = vi.fn().mockRejectedValue(new Error('API Error'));

      // Act
      try {
        await useCase.execute(audioFile);
      } catch (error) {
        // Expected to throw
      }

      // Assert
      expect(mockRepository.analyzeAudio).toHaveBeenCalledTimes(1);
      expect(mockRepository.saveAnalysis).not.toHaveBeenCalled();
    });
  });

  describe('File Validation', () => {
    it('should validate audio file by MIME type', async () => {
      // Arrange
      const validTypes = [
        { type: 'audio/mp3', name: 'file.mp3' },
        { type: 'audio/mpeg', name: 'file.mp3' },
        { type: 'audio/wav', name: 'file.wav' },
        { type: 'audio/ogg', name: 'file.ogg' },
        { type: 'audio/m4a', name: 'file.m4a' },
        { type: 'audio/x-m4a', name: 'file.m4a' },
      ];

      // Act & Assert
      for (const { type, name } of validTypes) {
        const file = new File(['content'], name, { type });
        const result = await useCase.execute(file);
        expect(result).toBeDefined();
      }
    });

    it('should validate audio file by extension when MIME type is missing', async () => {
      // Arrange
      const validExtensions = ['test.mp3', 'test.wav', 'test.ogg', 'test.m4a'];

      // Act & Assert
      for (const filename of validExtensions) {
        const file = new File(['content'], filename, { type: '' });
        const result = await useCase.execute(file);
        expect(result).toBeDefined();
      }
    });

    it('should reject file with invalid extension and no MIME type', async () => {
      // Arrange
      const invalidFile = new File(['content'], 'document.pdf', { type: '' });

      // Act & Assert
      await expect(useCase.execute(invalidFile)).rejects.toThrow(
        'Invalid audio file format'
      );
    });

    it('should be case-insensitive for file extensions', async () => {
      // Arrange
      const files = [
        new File(['content'], 'TEST.MP3', { type: '' }),
        new File(['content'], 'recording.WAV', { type: '' }),
        new File(['content'], 'audio.OGG', { type: '' }),
      ];

      // Act & Assert
      for (const file of files) {
        const result = await useCase.execute(file);
        expect(result).toBeDefined();
      }
    });
  });

  describe('Repository Interaction', () => {
    it('should call repository methods in correct order', async () => {
      // Arrange
      const audioFile = new File(['audio content'], 'test.mp3', {
        type: 'audio/mp3',
      });
      const callOrder: string[] = [];

      mockRepository.analyzeAudio = vi.fn().mockImplementation(async () => {
        callOrder.push('analyzeAudio');
        return mockAnalysisResult;
      });

      mockRepository.saveAnalysis = vi.fn().mockImplementation(async (result) => {
        callOrder.push('saveAnalysis');
        return result;
      });

      // Act
      await useCase.execute(audioFile);

      // Assert
      expect(callOrder).toEqual(['analyzeAudio', 'saveAnalysis']);
    });

    it('should pass file and options correctly to repository', async () => {
      // Arrange
      const audioFile = new File(['audio content'], 'test.mp3', {
        type: 'audio/mp3',
      });
      const options: AnalysisOptions = {
        targetLanguage: 'fr-FR',
        analysisType: 'consonant',
      };

      // Act
      await useCase.execute(audioFile, options);

      // Assert
      const [calledFile, calledOptions] = (mockRepository.analyzeAudio as any).mock.calls[0];
      expect(calledFile).toBe(audioFile);
      expect(calledOptions).toEqual(options);
    });

    it('should save the exact result returned by analyzeAudio', async () => {
      // Arrange
      const audioFile = new File(['audio content'], 'test.mp3', {
        type: 'audio/mp3',
      });

      // Act
      await useCase.execute(audioFile);

      // Assert
      const savedResult = (mockRepository.saveAnalysis as any).mock.calls[0][0];
      expect(savedResult).toBe(mockAnalysisResult);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty file name', async () => {
      // Arrange
      const file = new File(['content'], '', { type: 'audio/mp3' });

      // Act
      const result = await useCase.execute(file);

      // Assert
      expect(result).toBeDefined();
    });

    it('should handle file with multiple dots in name', async () => {
      // Arrange
      const file = new File(['content'], 'my.audio.file.test.mp3', {
        type: 'audio/mp3',
      });

      // Act
      const result = await useCase.execute(file);

      // Assert
      expect(result).toBeDefined();
    });

    it('should handle very small audio file (1 byte)', async () => {
      // Arrange
      const tinyFile = new File(['a'], 'tiny.mp3', { type: 'audio/mp3' });

      // Act
      const result = await useCase.execute(tinyFile);

      // Assert
      expect(result).toBeDefined();
    });

    it('should handle options with undefined values', async () => {
      // Arrange
      const audioFile = new File(['content'], 'test.mp3', { type: 'audio/mp3' });
      const options: AnalysisOptions = {
        targetLanguage: undefined,
        analysisType: undefined,
        expectedText: undefined,
      };

      // Act
      const result = await useCase.execute(audioFile, options);

      // Assert
      expect(result).toBeDefined();
      expect(mockRepository.analyzeAudio).toHaveBeenCalledWith(audioFile, options);
    });
  });
});
