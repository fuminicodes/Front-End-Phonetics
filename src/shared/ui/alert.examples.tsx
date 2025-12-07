/**
 * Alert Component - Usage Examples
 * Refactored to follow Nebula Glass Design System
 * 
 * This file demonstrates the correct usage of the Alert component
 * with all available variants following the glassmorphism aesthetic.
 */

import { Alert, AlertTitle, AlertDescription } from './alert';

// ============================================
// EXAMPLE 1: Default Alert
// ============================================
export function DefaultAlertExample() {
  return (
    <Alert variant="default">
      <AlertTitle>Notice</AlertTitle>
      <AlertDescription>
        This is a default alert with glassmorphism effect.
      </AlertDescription>
    </Alert>
  );
}

// ============================================
// EXAMPLE 2: Info Alert
// ============================================
export function InfoAlertExample() {
  return (
    <Alert variant="info">
      <AlertTitle>ℹ️ Information</AlertTitle>
      <AlertDescription>
        Your audio analysis is being processed. This may take a few moments.
      </AlertDescription>
    </Alert>
  );
}

// ============================================
// EXAMPLE 3: Success Alert
// ============================================
export function SuccessAlertExample() {
  return (
    <Alert variant="success">
      <AlertTitle>✅ Success</AlertTitle>
      <AlertDescription>
        Your pronunciation analysis has been completed successfully!
      </AlertDescription>
    </Alert>
  );
}

// ============================================
// EXAMPLE 4: Warning Alert
// ============================================
export function WarningAlertExample() {
  return (
    <Alert variant="warning">
      <AlertTitle>⚠️ Warning</AlertTitle>
      <AlertDescription>
        Audio file size is large. Processing may take longer than usual.
      </AlertDescription>
    </Alert>
  );
}

// ============================================
// EXAMPLE 5: Destructive Alert (Error)
// ============================================
export function DestructiveAlertExample() {
  return (
    <Alert variant="destructive">
      <AlertTitle>❌ Error</AlertTitle>
      <AlertDescription>
        Failed to analyze audio file. Please ensure the file is a valid audio format.
      </AlertDescription>
    </Alert>
  );
}

// ============================================
// EXAMPLE 6: Alert without Title
// ============================================
export function SimpleAlertExample() {
  return (
    <Alert variant="info">
      <AlertDescription>
        Recording in progress... Speak clearly into your microphone.
      </AlertDescription>
    </Alert>
  );
}

// ============================================
// EXAMPLE 7: Alert with Icon (SVG support)
// ============================================
export function AlertWithIconExample() {
  return (
    <Alert variant="success">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <AlertTitle>Analysis Complete</AlertTitle>
      <AlertDescription>
        Your phoneme analysis scored 85% accuracy!
      </AlertDescription>
    </Alert>
  );
}

// ============================================
// EXAMPLE 8: Alert with Custom Styling
// ============================================
export function CustomStyledAlertExample() {
  return (
    <Alert 
      variant="info" 
      className="max-w-md shadow-glass-hover"
    >
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-semibold">Pro Tip:</p>
          <p>For best results, record in a quiet environment with minimal background noise.</p>
        </div>
      </AlertDescription>
    </Alert>
  );
}

// ============================================
// EXAMPLE 9: Stacked Alerts
// ============================================
export function StackedAlertsExample() {
  return (
    <div className="space-y-4">
      <Alert variant="info">
        <AlertDescription>
          Step 1: Record your audio
        </AlertDescription>
      </Alert>
      
      <Alert variant="warning">
        <AlertDescription>
          Step 2: Review the waveform
        </AlertDescription>
      </Alert>
      
      <Alert variant="success">
        <AlertDescription>
          Step 3: Submit for analysis
        </AlertDescription>
      </Alert>
    </div>
  );
}

// ============================================
// EXAMPLE 10: Conditional Alert (Real-world usage)
// ============================================
interface ConditionalAlertProps {
  error?: string | null;
  success?: boolean;
  loading?: boolean;
}

export function ConditionalAlertExample({ error, success, loading }: ConditionalAlertProps) {
  if (loading) {
    return (
      <Alert variant="info">
        <AlertDescription>
          Processing your request...
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (success) {
    return (
      <Alert variant="success">
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Operation completed successfully!
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

// ============================================
// DESIGN SYSTEM NOTES
// ============================================
/*
 * GLASSMORPHISM FEATURES:
 * ✅ Uses .glass-panel utility for backdrop blur
 * ✅ Follows Nebula Glass color palette (primary, info, success, warning, danger)
 * ✅ Proper contrast ratios for accessibility (WCAG AA)
 * ✅ Border opacity matches design system (30% for variants)
 * ✅ Background opacity: 50% light mode, 20% dark mode
 * ✅ Smooth transitions (duration-300)
 * ✅ Rounded corners using rounded-glass (1rem)
 * 
 * ACCESSIBILITY:
 * ✅ role="alert" for screen readers
 * ✅ Proper color contrast in both light/dark modes
 * ✅ Text opacity (90%) for AlertDescription
 * ✅ SVG icon support with proper sizing and positioning
 * 
 * WHEN TO USE EACH VARIANT:
 * - default: Neutral information or notices
 * - info: Informational messages, tips, guidance
 * - success: Confirmations, completed actions
 * - warning: Cautions, important notices (non-critical)
 * - destructive: Errors, failed operations, critical issues
 */
