'use client';

import React from 'react';
import { useFeatureFlag } from '@/shared/hooks/use-feature-flag';
import type { FeatureFlags } from '@/core/config/feature-flags.config';

interface FeatureFlagWrapperProps {
  flag: keyof FeatureFlags;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureFlagWrapper({ flag, children, fallback = null }: FeatureFlagWrapperProps) {
  const isEnabled = useFeatureFlag(flag);
  
  return isEnabled ? <>{children}</> : <>{fallback}</>;
}