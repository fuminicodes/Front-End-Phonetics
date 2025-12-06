#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * 
 * Validates that all required environment variables are properly configured.
 * Run this before deployment to catch configuration issues early.
 * 
 * Usage:
 *   node scripts/validate-env.js
 *   npm run validate:env
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(70));
  log(title, 'cyan');
  console.log('='.repeat(70));
}

/**
 * Validation rules for environment variables
 */
const validationRules = [
  {
    name: 'NODE_ENV',
    required: true,
    validate: (value) => ['development', 'staging', 'production'].includes(value),
    message: 'Must be one of: development, staging, production',
  },
  {
    name: 'NEXTAUTH_SECRET',
    required: true,
    validate: (value) => value && value.length >= 32,
    message: 'Must be at least 32 characters long',
    security: true,
  },
  {
    name: 'SESSION_ENCRYPTION_KEY',
    required: true,
    validate: (value) => value && value.length === 32,
    message: 'Must be exactly 32 characters long',
    security: true,
  },
  {
    name: 'JWT_SECRET',
    required: true,
    validate: (value) => value && value.length >= 32,
    message: 'Must be at least 32 characters long',
    security: true,
  },
  {
    name: 'API_BASE_URL',
    required: false,
    validate: (value) => !value || /^https?:\/\/.+/.test(value),
    message: 'Must be a valid URL starting with http:// or https://',
  },
  {
    name: 'PHONEME_ANALYSIS_API_URL',
    required: false,
    validate: (value) => !value || /^https?:\/\/.+/.test(value),
    message: 'Must be a valid URL starting with http:// or https://',
  },
  {
    name: 'FF_NEW_PHONEME_ANALYSIS',
    required: false,
    validate: (value) => !value || ['true', 'false'].includes(value),
    message: 'Must be "true" or "false"',
  },
  {
    name: 'FF_ADVANCED_ANALYTICS',
    required: false,
    validate: (value) => !value || ['true', 'false'].includes(value),
    message: 'Must be "true" or "false"',
  },
  {
    name: 'FF_MAINTENANCE_MODE',
    required: false,
    validate: (value) => !value || ['true', 'false'].includes(value),
    message: 'Must be "true" or "false"',
  },
];

/**
 * Check for common insecure values
 */
const insecurePatterns = [
  'default',
  'example',
  'test',
  'changeme',
  'your-',
  '12345',
  'abcdef',
];

function isInsecureValue(value) {
  if (!value) return false;
  const lowerValue = value.toLowerCase();
  return insecurePatterns.some((pattern) => lowerValue.includes(pattern));
}

/**
 * Load environment variables from .env.local or .env
 */
function loadEnvFile() {
  const envFiles = ['.env.local', '.env'];
  
  for (const file of envFiles) {
    const envPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(envPath)) {
      log(`📄 Loading environment from: ${file}`, 'blue');
      const content = fs.readFileSync(envPath, 'utf-8');
      
      content.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').trim();
        
        if (key && value) {
          process.env[key] = value;
        }
      });
      
      return file;
    }
  }
  
  log('⚠️  No .env.local or .env file found', 'yellow');
  return null;
}

/**
 * Main validation function
 */
function validateEnvironment() {
  logSection('Environment Variables Validation');
  
  const envFile = loadEnvFile();
  const isProduction = process.env.NODE_ENV === 'production';
  
  log(`Environment: ${process.env.NODE_ENV || 'not set'}`, 'blue');
  log(`Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`, 'blue');
  
  let hasErrors = false;
  let hasWarnings = false;
  const results = [];
  
  logSection('Validation Results');
  
  validationRules.forEach((rule) => {
    const value = process.env[rule.name];
    const status = {
      name: rule.name,
      value: value,
      passed: true,
      error: null,
      warning: null,
    };
    
    // Check if required variable is missing
    if (rule.required && !value) {
      status.passed = false;
      status.error = `❌ MISSING: ${rule.name} is required`;
      hasErrors = true;
      log(status.error, 'red');
      results.push(status);
      return;
    }
    
    // Skip validation if optional and not provided
    if (!rule.required && !value) {
      log(`⚪ OPTIONAL: ${rule.name} (not set)`, 'reset');
      results.push(status);
      return;
    }
    
    // Validate format
    if (value && !rule.validate(value)) {
      status.passed = false;
      status.error = `❌ INVALID: ${rule.name} - ${rule.message}`;
      hasErrors = true;
      log(status.error, 'red');
      results.push(status);
      return;
    }
    
    // Check for insecure values in production
    if (isProduction && rule.security && isInsecureValue(value)) {
      status.warning = `⚠️  WARNING: ${rule.name} appears to use a default/insecure value`;
      hasWarnings = true;
      log(status.warning, 'yellow');
    }
    
    log(`✅ VALID: ${rule.name}`, 'green');
    results.push(status);
  });
  
  // Summary
  logSection('Summary');
  
  const totalChecks = validationRules.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = totalChecks - passed;
  
  log(`Total checks: ${totalChecks}`, 'blue');
  log(`Passed: ${passed}`, 'green');
  
  if (failed > 0) {
    log(`Failed: ${failed}`, 'red');
  }
  
  if (hasWarnings) {
    log(`Warnings: Found insecure values`, 'yellow');
  }
  
  // Production-specific checks
  if (isProduction) {
    logSection('Production Security Checks');
    
    const securityChecks = [
      {
        check: () => process.env.NEXTAUTH_SECRET !== 'dev-secret-change-in-production-min-32-chars',
        message: 'NEXTAUTH_SECRET is not using default value',
      },
      {
        check: () => process.env.SESSION_ENCRYPTION_KEY !== '12345678901234567890123456789012',
        message: 'SESSION_ENCRYPTION_KEY is not using default value',
      },
      {
        check: () => process.env.JWT_SECRET !== 'dev-jwt-secret-change-in-prod-32',
        message: 'JWT_SECRET is not using default value',
      },
    ];
    
    securityChecks.forEach((check) => {
      if (check.check()) {
        log(`✅ ${check.message}`, 'green');
      } else {
        log(`❌ ${check.message}`, 'red');
        hasErrors = true;
      }
    });
  }
  
  // Final result
  logSection('Final Result');
  
  if (hasErrors) {
    log('❌ VALIDATION FAILED', 'red');
    log('Please fix the errors above before deploying.', 'red');
    process.exit(1);
  } else if (hasWarnings) {
    log('⚠️  VALIDATION PASSED WITH WARNINGS', 'yellow');
    log('Review warnings above for security concerns.', 'yellow');
    process.exit(0);
  } else {
    log('✅ VALIDATION PASSED', 'green');
    log('All environment variables are properly configured.', 'green');
    process.exit(0);
  }
}

// Run validation
try {
  validateEnvironment();
} catch (error) {
  console.error('\n❌ Validation script error:', error.message);
  process.exit(1);
}
