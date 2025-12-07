/**
 * Skeleton Component - Usage Examples
 * Refactored to follow Nebula Glass Design System
 * 
 * This file demonstrates the correct usage of the Skeleton component
 * with all available variants following the glassmorphism aesthetic.
 */

import { Skeleton } from './skeleton';
import { Card, CardHeader, CardContent, CardTitle } from './card';
import { Typography } from './typography';

// ============================================
// EXAMPLE 1: Glass Skeleton (Default)
// ============================================
export function GlassSkeletonExample() {
  return (
    <div className="space-y-4">
      <Skeleton variant="glass" className="h-10 w-full" />
      <Skeleton variant="glass" className="h-10 w-3/4" />
      <Skeleton variant="glass" className="h-10 w-1/2" />
    </div>
  );
}

// ============================================
// EXAMPLE 2: Solid Skeleton
// ============================================
export function SolidSkeletonExample() {
  return (
    <div className="space-y-4">
      <Skeleton variant="solid" className="h-10 w-full" />
      <Skeleton variant="solid" className="h-10 w-3/4" />
      <Skeleton variant="solid" className="h-10 w-1/2" />
    </div>
  );
}

// ============================================
// EXAMPLE 3: Light Skeleton
// ============================================
export function LightSkeletonExample() {
  return (
    <div className="space-y-4">
      <Skeleton variant="light" className="h-10 w-full" />
      <Skeleton variant="light" className="h-10 w-3/4" />
      <Skeleton variant="light" className="h-10 w-1/2" />
    </div>
  );
}

// ============================================
// EXAMPLE 4: Shimmer Skeleton (Animated Gradient)
// ============================================
export function ShimmerSkeletonExample() {
  return (
    <div className="space-y-4">
      <Skeleton variant="shimmer" className="h-10 w-full" />
      <Skeleton variant="shimmer" className="h-10 w-3/4" />
      <Skeleton variant="shimmer" className="h-10 w-1/2" />
    </div>
  );
}

// ============================================
// EXAMPLE 5: Card Skeleton
// ============================================
export function CardSkeletonExample() {
  return (
    <Card className="p-6">
      <CardHeader>
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  );
}

// ============================================
// EXAMPLE 6: User Profile Skeleton
// ============================================
export function UserProfileSkeletonExample() {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <Skeleton className="h-16 w-16 rounded-full" />
        
        {/* Info */}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </Card>
  );
}

// ============================================
// EXAMPLE 7: Form Skeleton
// ============================================
export function FormSkeletonExample() {
  return (
    <div className="space-y-6">
      {/* Input fields */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" /> {/* Label */}
        <Skeleton className="h-10 w-full" /> {/* Input */}
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-24 w-full" /> {/* Textarea */}
      </div>
      
      {/* Button */}
      <Skeleton className="h-12 w-32" />
    </div>
  );
}

// ============================================
// EXAMPLE 8: Table Skeleton
// ============================================
export function TableSkeletonExample() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-20" />
      </div>
      
      {/* Rows */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

// ============================================
// EXAMPLE 9: Audio Waveform Skeleton
// ============================================
export function AudioWaveformSkeletonExample() {
  return (
    <div className="flex items-end justify-between gap-1 h-32">
      {Array.from({ length: 50 }).map((_, i) => (
        <Skeleton
          key={i}
          variant="shimmer"
          className="w-1 flex-1"
          style={{ height: `${Math.random() * 100}%` }}
        />
      ))}
    </div>
  );
}

// ============================================
// EXAMPLE 10: Analysis Results Skeleton
// ============================================
export function AnalysisResultsSkeletonExample() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-48 mx-auto" />
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          {/* Loading spinner placeholder */}
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          
          {/* Status text */}
          <Skeleton className="h-4 w-64 mx-auto" />
          
          {/* Progress bars */}
          <div className="space-y-2 max-w-md mx-auto">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// EXAMPLE 11: Grid Layout Skeleton
// ============================================
export function GridLayoutSkeletonExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="p-6">
          <Skeleton className="h-40 w-full mb-4 rounded-glass-lg" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </Card>
      ))}
    </div>
  );
}

// ============================================
// EXAMPLE 12: Suspense Fallback Pattern
// ============================================
export function SuspenseFallbackExample() {
  return (
    <div className="space-y-6">
      <Skeleton variant="glass" className="h-10 w-full" />
      <Skeleton variant="glass" className="h-10 w-full" />
      <Skeleton variant="glass" className="h-10 w-full" />
    </div>
  );
}

// ============================================
// EXAMPLE 13: Mixed Variants
// ============================================
export function MixedVariantsExample() {
  return (
    <div className="space-y-8">
      <div>
        <Typography variant="h4" className="mb-4">Glass Variant</Typography>
        <GlassSkeletonExample />
      </div>
      
      <div>
        <Typography variant="h4" className="mb-4">Solid Variant</Typography>
        <SolidSkeletonExample />
      </div>
      
      <div>
        <Typography variant="h4" className="mb-4">Shimmer Variant</Typography>
        <ShimmerSkeletonExample />
      </div>
      
      <div>
        <Typography variant="h4" className="mb-4">Light Variant</Typography>
        <LightSkeletonExample />
      </div>
    </div>
  );
}

// ============================================
// DESIGN SYSTEM NOTES
// ============================================
/*
 * GLASSMORPHISM FEATURES:
 * ✅ Uses glassmorphism utilities (glass-light, glass-dark)
 * ✅ Backdrop blur for glass variant
 * ✅ Proper borders with glass-border colors
 * ✅ Rounded corners using rounded-glass (1rem)
 * ✅ Smooth transitions (duration-300)
 * ✅ Pulse animation for loading state
 * ✅ Shimmer animation for enhanced visual feedback
 * 
 * VARIANTS:
 * - glass (default): Glassmorphism effect with blur and borders
 * - solid: More visible, uses accent colors with opacity
 * - light: Subtle, minimal opacity for light backgrounds
 * - shimmer: Animated gradient for premium loading experience
 * 
 * ACCESSIBILITY:
 * ✅ Respects prefers-reduced-motion (disables shimmer)
 * ✅ Proper contrast in both light/dark modes
 * ✅ Semantic HTML (div with role implicit)
 * 
 * WHEN TO USE EACH VARIANT:
 * - glass: Default, works well on any background with BackgroundWrapper
 * - solid: When you need more visible loading indicators
 * - light: On already light/bright backgrounds
 * - shimmer: For premium feel, data-heavy components
 * 
 * COMMON PATTERNS:
 * - Form loading: Use FormSkeletonExample pattern
 * - Card loading: Use CardSkeletonExample pattern
 * - List loading: Use multiple skeletons with decreasing widths
 * - Profile loading: Combine rounded-full for avatars
 * - Table loading: Use flex layout with consistent gaps
 * 
 * BEST PRACTICES:
 * 1. Match skeleton dimensions to actual content
 * 2. Use consistent spacing between skeleton elements
 * 3. Consider using shimmer for long-running operations
 * 4. Always use Suspense boundaries with Skeleton fallbacks
 * 5. Keep skeleton count reasonable (3-5 items for lists)
 */
