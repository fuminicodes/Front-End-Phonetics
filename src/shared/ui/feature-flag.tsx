import React from 'react';
import { useFeatureFlag } from '../hooks/use-feature-flag';
import type { FeatureFlags } from '@/core/config/feature-flags.config';

interface FeatureFlagProps {
  flag: keyof FeatureFlags;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureFlag({ flag, children, fallback = null }: FeatureFlagProps) {
  const isEnabled = useFeatureFlag(flag);
  
  return isEnabled ? <>{children}</> : <>{fallback}</>;
}