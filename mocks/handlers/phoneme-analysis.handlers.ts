import { http, HttpResponse } from 'msw';
import { PhonemeAnalysisResponseDTO } from '@/modules/phoneme-analysis/infrastructure/dtos/phoneme-analysis.dto';

export const phonemeAnalysisHandlers = [
  // POST /analyze - Phoneme analysis
  http.post('/analyze', async ({ request }) => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const formData = await request.formData();
    const audioFile = formData.get('audioFile') as File;
    
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
    
    const mockResponse: PhonemeAnalysisResponseDTO = {
      analysis_id: `analysis_${Date.now()}`,
      original_text: 'Hello World',
      analysis_type: 'pronunciation',
      accuracy_score: accuracy,
      phonemes: [
        {
          symbol: 'h',
          start_time: 0,
          end_time: 0.2,
          accuracy: accuracy + Math.floor(Math.random() * 10) - 5,
          duration_ms: 200,
          suggestions: accuracy < 70 ? ['Try aspirating the H sound more'] : undefined
        },
        {
          symbol: 'ɛ',
          start_time: 0.2,
          end_time: 0.5,
          accuracy: accuracy + Math.floor(Math.random() * 10) - 5,
          duration_ms: 300,
          suggestions: accuracy < 70 ? ['Open your mouth more for the E sound'] : undefined
        },
        {
          symbol: 'l',
          start_time: 0.5,
          end_time: 0.7,
          accuracy: accuracy + Math.floor(Math.random() * 10) - 5,
          duration_ms: 200
        },
        {
          symbol: 'oʊ',
          start_time: 0.7,
          end_time: 1.0,
          accuracy: accuracy + Math.floor(Math.random() * 10) - 5,
          duration_ms: 300
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
  
  // Simulate network delay
  http.post('/analyze-slow', () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(HttpResponse.json({ message: 'Slow response' }));
      }, 5000);
    });
  }),
  
  // Simulate server error
  http.post('/analyze-error', () => {
    return HttpResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }),
];