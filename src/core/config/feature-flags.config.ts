import { z } from 'zod';
import { appConfig } from './app.config';

const FeatureFlagsSchema = z.object({
  NEW_PHONEME_ANALYSIS: z.boolean(),
  ADVANCED_ANALYTICS: z.boolean(),
  MAINTENANCE_MODE: z.boolean(),
});

export type FeatureFlags = z.infer<typeof FeatureFlagsSchema>;

export async function getFeatureFlags(): Promise<FeatureFlags> {
  try {
    // In production, fetch from feature flag service
    if (process.env.NODE_ENV === 'production' && process.env.FEATURE_FLAGS_API) {
      const response = await fetch(`${process.env.FEATURE_FLAGS_API}/flags`);
      const data = await response.json();
      return FeatureFlagsSchema.parse(data);
    }
    
    // Development defaults from environment variables
    return {
      NEW_PHONEME_ANALYSIS: appConfig.FF_NEW_PHONEME_ANALYSIS === 'true',
      ADVANCED_ANALYTICS: appConfig.FF_ADVANCED_ANALYTICS === 'true',
      MAINTENANCE_MODE: appConfig.FF_MAINTENANCE_MODE === 'true',
    };
  } catch (error) {
    console.error('Error loading feature flags:', error);
    // Fallback to safe defaults
    return {
      NEW_PHONEME_ANALYSIS: false,
      ADVANCED_ANALYTICS: false,
      MAINTENANCE_MODE: false,
    };
  }
}