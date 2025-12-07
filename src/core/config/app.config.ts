import { z } from 'zod';

/**
 * Environment Variables Schema
 * 
 * Defines validation rules for all required and optional environment variables.
 * Uses Zod for runtime validation with TypeScript type inference.
 */
const envSchema = z.object({
  // Core Configuration
  NODE_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development'),
  
  // Security & Authentication
  NEXTAUTH_SECRET: z
    .string()
    .min(32, 'NEXTAUTH_SECRET must be at least 32 characters')
    .describe('Secret for NextAuth.js session encryption'),
  
  SESSION_ENCRYPTION_KEY: z
    .string()
    .length(32, 'SESSION_ENCRYPTION_KEY must be exactly 32 characters')
    .describe('Key for encrypting session data (A256GCM)'),
  
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters')
    .describe('Secret for signing JWT tokens'),
  
  // API Configuration
  API_BASE_URL: z
    .string()
    .url('API_BASE_URL must be a valid URL')
    .default('http://localhost:3001')
    .describe('Base URL for main API'),
  
  PHONEME_ANALYSIS_API_URL: z
    .string()
    .url('PHONEME_ANALYSIS_API_URL must be a valid URL')
    .default('http://localhost:3002')
    .describe('Base URL for phoneme analysis API'),
  
  // Feature Flags
  FF_NEW_PHONEME_ANALYSIS: z
    .enum(['true', 'false'])
    .default('false')
    .transform((val) => val === 'true')
    .describe('Enable new phoneme analysis feature'),
  
  FF_ADVANCED_ANALYTICS: z
    .enum(['true', 'false'])
    .default('false')
    .transform((val) => val === 'true')
    .describe('Enable advanced analytics dashboard'),
  
  FF_MAINTENANCE_MODE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((val) => val === 'true')
    .describe('Enable maintenance mode'),
});

/**
 * Environment Configuration Type
 * Inferred from the Zod schema for type safety
 */
type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validates environment variables in production
 * Throws detailed error if validation fails
 */
function validateEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    const errors = result.error.format();
    console.error('❌ Environment variable validation failed:');
    console.error(JSON.stringify(errors, null, 2));
    
    // Extract specific missing or invalid variables
    const issues = result.error.issues.map((issue) => {
      return `  - ${issue.path.join('.')}: ${issue.message}`;
    });
    
    console.error('\nIssues found:');
    console.error(issues.join('\n'));
    
    throw new Error(
      'Invalid environment configuration. Please check the logs above.'
    );
  }
  
  // Log successful validation in production
  console.log('✅ Environment variables validated successfully');
  
  return result.data;
}

/**
 * Development configuration with safe defaults
 * Uses environment variables if provided, otherwise falls back to defaults
 */
function getDevConfig(): EnvConfig {
  const nodeEnv = process.env.NODE_ENV;
  const validNodeEnv = ['development', 'staging', 'production'].includes(nodeEnv || '')
    ? (nodeEnv as 'development' | 'staging' | 'production')
    : 'development';
  
  const config = {
    NODE_ENV: validNodeEnv,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'dev-secret-change-in-production-min-32-chars',
    SESSION_ENCRYPTION_KEY: process.env.SESSION_ENCRYPTION_KEY || '12345678901234567890123456789012', // 32 chars
    JWT_SECRET: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-prod-32', // 32 chars
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3001',
    PHONEME_ANALYSIS_API_URL: process.env.PHONEME_ANALYSIS_API_URL || 'http://localhost:3002',
    FF_NEW_PHONEME_ANALYSIS: process.env.FF_NEW_PHONEME_ANALYSIS || 'false',
    FF_ADVANCED_ANALYTICS: process.env.FF_ADVANCED_ANALYTICS || 'false',
    FF_MAINTENANCE_MODE: process.env.FF_MAINTENANCE_MODE || 'false',
  };
  
  // Validate and transform to get proper types (booleans for feature flags)
  const result = envSchema.safeParse(config);
  
  if (!result.success) {
    console.warn('⚠️  Development config validation warning:', result.error.format());
    // Force parse to get the transformed types even if validation failed
    try {
      return envSchema.parse(config);
    } catch {
      // Last resort fallback with manual transformation
      return {
        ...config,
        FF_NEW_PHONEME_ANALYSIS: config.FF_NEW_PHONEME_ANALYSIS === 'true',
        FF_ADVANCED_ANALYTICS: config.FF_ADVANCED_ANALYTICS === 'true',
        FF_MAINTENANCE_MODE: config.FF_MAINTENANCE_MODE === 'true',
      };
    }
  }
  
  return result.data;
}

/**
 * Application Configuration
 * 
 * - In production: Strictly validates all required variables
 * - In development: Uses safe defaults with optional validation
 */
export const appConfig = process.env.NODE_ENV === 'production' 
  ? validateEnv() 
  : getDevConfig();

/**
 * Helper function to check if running in production
 */
export const isProduction = appConfig.NODE_ENV === 'production';

/**
 * Helper function to check if running in development
 */
export const isDevelopment = appConfig.NODE_ENV === 'development';

/**
 * Helper function to check if running in staging
 */
export const isStaging = appConfig.NODE_ENV === 'staging';