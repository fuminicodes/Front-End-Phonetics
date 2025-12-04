import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  API_BASE_URL: z.string().url().optional(),
  PHONEME_ANALYSIS_API_URL: z.string().url().optional(),
  SESSION_ENCRYPTION_KEY: z.string().min(32).optional(),
  JWT_SECRET: z.string().min(32).optional(),
  // Feature flags
  FF_NEW_PHONEME_ANALYSIS: z.string().optional(),
  FF_ADVANCED_ANALYTICS: z.string().optional(),
  FF_MAINTENANCE_MODE: z.string().optional(),
});

type EnvConfig = z.infer<typeof envSchema>;

function validateEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    throw new Error('Invalid environment configuration');
  }
  
  return result.data;
}

function getDefaultConfig(): EnvConfig {
  return {
    NODE_ENV: (process.env.NODE_ENV as any) || 'development',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'default-secret-for-development-only',
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3001',
    PHONEME_ANALYSIS_API_URL: process.env.PHONEME_ANALYSIS_API_URL || 'http://localhost:3002',
    SESSION_ENCRYPTION_KEY: process.env.SESSION_ENCRYPTION_KEY || 'development-key-32-characters-long',
    JWT_SECRET: process.env.JWT_SECRET || 'development-jwt-secret-32-chars-long',
    FF_NEW_PHONEME_ANALYSIS: process.env.FF_NEW_PHONEME_ANALYSIS || 'false',
    FF_ADVANCED_ANALYTICS: process.env.FF_ADVANCED_ANALYTICS || 'false',
    FF_MAINTENANCE_MODE: process.env.FF_MAINTENANCE_MODE || 'false',
  };
}

export const appConfig = process.env.NODE_ENV === 'production' 
  ? validateEnv() 
  : getDefaultConfig();