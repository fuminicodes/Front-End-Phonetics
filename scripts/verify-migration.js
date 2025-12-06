#!/usr/bin/env node

/**
 * Migration Verification Script
 * 
 * Verifies that the API Routes to Server Actions migration is complete and correct.
 * 
 * Usage: node scripts/verify-migration.js
 */

const fs = require('fs');
const path = require('path');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function checkFileContains(filePath, searchString) {
  if (!checkFileExists(filePath)) return false;
  const content = fs.readFileSync(filePath, 'utf8');
  return content.includes(searchString);
}

// Verification checks
const checks = [
  {
    name: 'Server Actions File Exists',
    check: () => checkFileExists('src/modules/phoneme-analysis/ui/actions/phoneme-analysis.actions.ts'),
    critical: true,
  },
  {
    name: 'analyzeAudioAction Exists',
    check: () => checkFileContains(
      'src/modules/phoneme-analysis/ui/actions/phoneme-analysis.actions.ts',
      'export async function analyzeAudioAction'
    ),
    critical: true,
  },
  {
    name: 'analyzeAudioDirectAction Exists',
    check: () => checkFileContains(
      'src/modules/phoneme-analysis/ui/actions/phoneme-analysis.actions.ts',
      'export async function analyzeAudioDirectAction'
    ),
    critical: true,
  },
  {
    name: 'analyzeAudioDebugAction Exists',
    check: () => checkFileContains(
      'src/modules/phoneme-analysis/ui/actions/phoneme-analysis.actions.ts',
      'export async function analyzeAudioDebugAction'
    ),
    critical: true,
  },
  {
    name: "'use server' Directive Present",
    check: () => checkFileContains(
      'src/modules/phoneme-analysis/ui/actions/phoneme-analysis.actions.ts',
      "'use server'"
    ),
    critical: true,
  },
  {
    name: 'Test Page: /proxy-test-sa',
    check: () => checkFileExists('src/app/proxy-test-sa/page.tsx'),
    critical: false,
  },
  {
    name: 'Test Page: /comparison-sa',
    check: () => checkFileExists('src/app/comparison-sa/page.tsx'),
    critical: false,
  },
  {
    name: 'Test Page: /debug-sa',
    check: () => checkFileExists('src/app/debug-sa/page.tsx'),
    critical: false,
  },
  {
    name: 'API Route Deprecated: phoneme-analysis',
    check: () => checkFileContains(
      'src/app/api/phoneme-analysis/route.ts',
      '@deprecated'
    ),
    critical: false,
  },
  {
    name: 'API Route Deprecated: phoneme-analysis-alt',
    check: () => checkFileContains(
      'src/app/api/phoneme-analysis-alt/route.ts',
      'DEPRECATED'
    ),
    critical: false,
  },
  {
    name: 'API Route Deprecated: debug-proxy',
    check: () => checkFileContains(
      'src/app/api/debug-proxy/route.ts',
      'DEPRECATED'
    ),
    critical: false,
  },
  {
    name: 'Migration Documentation Exists',
    check: () => checkFileExists('documentation/MIGRATION_API_ROUTES_TO_SERVER_ACTIONS.md'),
    critical: false,
  },
  {
    name: 'Migration Complete Document Exists',
    check: () => checkFileExists('MIGRATION_COMPLETE.md'),
    critical: false,
  },
  {
    name: 'README Updated',
    check: () => checkFileContains('README.md', 'Migration to Server Actions'),
    critical: false,
  },
  {
    name: 'RBAC Integration',
    check: () => checkFileContains(
      'src/modules/phoneme-analysis/ui/actions/phoneme-analysis.actions.ts',
      'checkResourceAccess'
    ),
    critical: true,
  },
  {
    name: 'Zod Validation',
    check: () => checkFileContains(
      'src/modules/phoneme-analysis/ui/actions/phoneme-analysis.actions.ts',
      'z.object'
    ),
    critical: true,
  },
  {
    name: 'Correlation ID Logging',
    check: () => checkFileContains(
      'src/modules/phoneme-analysis/ui/actions/phoneme-analysis.actions.ts',
      'CorrelationManager'
    ),
    critical: true,
  },
];

// Run verification
log('\n🔍 Starting Migration Verification...\n', 'cyan');

let passed = 0;
let failed = 0;
let criticalFailed = 0;

checks.forEach((check) => {
  const result = check.check();
  
  if (result) {
    log(`✅ ${check.name}`, 'green');
    passed++;
  } else {
    const severity = check.critical ? '[CRITICAL]' : '[WARNING]';
    const color = check.critical ? 'red' : 'yellow';
    log(`❌ ${check.name} ${severity}`, color);
    failed++;
    if (check.critical) criticalFailed++;
  }
});

// Summary
log('\n' + '='.repeat(50), 'blue');
log('📊 Verification Summary', 'cyan');
log('='.repeat(50), 'blue');
log(`Total checks: ${checks.length}`, 'blue');
log(`Passed: ${passed}`, 'green');
log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
log(`Critical failures: ${criticalFailed}`, criticalFailed > 0 ? 'red' : 'green');
log('='.repeat(50) + '\n', 'blue');

// Exit code
if (criticalFailed > 0) {
  log('❌ VERIFICATION FAILED - Critical issues detected', 'red');
  log('Please fix critical issues before proceeding.\n', 'yellow');
  process.exit(1);
} else if (failed > 0) {
  log('⚠️  VERIFICATION PASSED WITH WARNINGS', 'yellow');
  log('Some non-critical checks failed. Consider fixing them.\n', 'yellow');
  process.exit(0);
} else {
  log('✅ VERIFICATION PASSED - All checks successful!', 'green');
  log('Migration is complete and verified.\n', 'green');
  process.exit(0);
}
