import { http, HttpResponse, delay } from 'msw';
import { PhonemeAnalysisResponseDTO } from '@/modules/phoneme-analysis/infrastructure/dtos/phoneme-analysis.dto';

export const phonemeAnalysisHandlers = [
  // POST /api/PhonemeRecognition/analyze-v - Phoneme analysis
  http.post('http://localhost:5005/api/PhonemeRecognition/analyze-v', async ({ request }) => {
    // Simulate processing delay
    await delay(1500);
    
    const formData = await request.formData();
    const audioFile = formData.get('audioFile') as File;
    const targetLanguage = formData.get('targetLanguage') as string || 'en';
    const analysisType = formData.get('analysisType') as string || 'pronunciation';
    const expectedText = formData.get('expectedText') as string || '';
    
    if (!audioFile) {
      return HttpResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }
    
    // Mock response based on filename for predictable testing
    const accuracy = audioFile.name.includes('good') ? 85 : 
                    audioFile.name.includes('poor') ? 45 : 
                    Math.floor(Math.random() * 40) + 60; // 60-100
    
    const originalText = expectedText || 'Hello World';
    
    const mockResponse: PhonemeAnalysisResponseDTO = {
      analysis_id: `analysis_${Date.now()}`,
      original_text: originalText,
      analysis_type: analysisType as 'pronunciation' | 'vowel' | 'consonant',
      accuracy_score: accuracy,
      phonemes: [
        {
          symbol: 'h',
          start_time: 0,
          end_time: 0.2,
          accuracy: Math.min(100, accuracy + Math.floor(Math.random() * 10) - 5),
          duration_ms: 200,
          suggestions: accuracy < 70 ? ['Try aspirating the H sound more'] : undefined
        },
        {
          symbol: 'ɛ',
          start_time: 0.2,
          end_time: 0.5,
          accuracy: Math.min(100, accuracy + Math.floor(Math.random() * 10) - 5),
          duration_ms: 300,
          suggestions: accuracy < 70 ? ['Open your mouth more for the E sound'] : undefined
        },
        {
          symbol: 'l',
          start_time: 0.5,
          end_time: 0.7,
          accuracy: Math.min(100, accuracy + Math.floor(Math.random() * 10) - 5),
          duration_ms: 200
        },
        {
          symbol: 'oʊ',
          start_time: 0.7,
          end_time: 1.0,
          accuracy: Math.min(100, accuracy + Math.floor(Math.random() * 10) - 5),
          duration_ms: 300
        },
        {
          symbol: 'w',
          start_time: 1.0,
          end_time: 1.2,
          accuracy: Math.min(100, accuracy + Math.floor(Math.random() * 10) - 5),
          duration_ms: 200
        },
        {
          symbol: 'ɜ',
          start_time: 1.2,
          end_time: 1.5,
          accuracy: Math.min(100, accuracy + Math.floor(Math.random() * 10) - 5),
          duration_ms: 300
        },
        {
          symbol: 'l',
          start_time: 1.5,
          end_time: 1.7,
          accuracy: Math.min(100, accuracy + Math.floor(Math.random() * 10) - 5),
          duration_ms: 200
        },
        {
          symbol: 'd',
          start_time: 1.7,
          end_time: 1.9,
          accuracy: Math.min(100, accuracy + Math.floor(Math.random() * 10) - 5),
          duration_ms: 200
        }
      ],
      feedback: accuracy < 70 ? [
        {
          type: 'warning',
          phoneme_symbol: 'ɛ',
          message: 'Consider practicing the vowel sound /ɛ/ more',
          severity: 3
        },
        {
          type: 'suggestion',
          phoneme_symbol: 'h',
          message: 'Good pronunciation! Keep practicing the H aspiration',
          severity: 1
        }
      ] : [
        {
          type: 'suggestion',
          phoneme_symbol: 'overall',
          message: 'Excellent pronunciation!',
          severity: 1
        }
      ],
      created_at: new Date().toISOString()
    };
    
    return HttpResponse.json(mockResponse);
  }),
  
  // Simulate slow network for testing
  http.post('http://localhost:5005/api/PhonemeRecognition/analyze-slow', async () => {
    await delay(5000);
    return HttpResponse.json({ 
      analysis_id: `analysis_slow_${Date.now()}`,
      message: 'Slow response for testing' 
    });
  }),
  
  // Simulate server error for testing
  http.post('http://localhost:5005/api/PhonemeRecognition/analyze-error', () => {
    return HttpResponse.json(
      { error: 'Internal server error', message: 'Simulated error for testing' },
      { status: 500 }
    );
  }),

  // Simulate unauthorized access
  http.post('http://localhost:5005/api/PhonemeRecognition/analyze-unauthorized', () => {
    return HttpResponse.json(
      { error: 'Unauthorized', message: 'Authentication required' },
      { status: 401 }
    );
  }),
];