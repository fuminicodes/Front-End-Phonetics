'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { analyzeAudioAction, AnalyzeAudioActionState } from '../actions/phoneme-analysis.actions';
import { useState, useTransition } from 'react';

export function usePhonemeAnalysis() {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<AnalyzeAudioActionState>({});
  const queryClient = useQueryClient();

  const analyzeMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return new Promise<AnalyzeAudioActionState>((resolve) => {
        startTransition(async () => {
          const result = await analyzeAudioAction(state, formData);
          setState(result);
          resolve(result);
        });
      });
    },
    onSuccess: (data) => {
      if (data.success && data.result) {
        // Invalidate any related queries if needed
        queryClient.invalidateQueries({ queryKey: ['phoneme-analysis'] });
      }
    },
  });

  const analyzeAudio = (formData: FormData) => {
    analyzeMutation.mutate(formData);
  };

  return {
    analyzeAudio,
    isLoading: isPending || analyzeMutation.isPending,
    error: state.errors,
    result: state.result,
    success: state.success,
    reset: () => setState({}),
  };
}