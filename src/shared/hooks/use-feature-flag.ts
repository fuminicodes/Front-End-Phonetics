'use client';

import { useQuery } from '@tanstack/react-query';
import { getFeatureFlags, FeatureFlags } from '@/core/config/feature-flags.config';

export function useFeatureFlag(flag: keyof FeatureFlags): boolean {
  const { data: flags } = useQuery({
    queryKey: ['feature-flags'],
    queryFn: getFeatureFlags,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
  
  return flags?.[flag] ?? false;
}

export function useFeatureFlags(): FeatureFlags | undefined {
  const { data } = useQuery({
    queryKey: ['feature-flags'],
    queryFn: getFeatureFlags,
    staleTime: 5 * 60 * 1000,
  });
  
  return data;
}