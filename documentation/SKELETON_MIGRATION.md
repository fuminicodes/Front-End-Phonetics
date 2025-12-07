# Skeleton Component Migration Guide

## 📋 Overview

The Skeleton component has been **refactored to follow the Nebula Glass Design System**. This guide helps you migrate existing Skeleton usage to the new implementation with glassmorphism support.

---

## ✅ What Changed

### Before (Old Implementation)
```tsx
import { Skeleton } from '@/shared/ui/skeleton';

// Single variant with bg-muted (undefined color)
<Skeleton className="h-10 w-full" />
```

### After (New Implementation)
```tsx
import { Skeleton } from '@/shared/ui/skeleton';

// 4 variants: 'glass' | 'solid' | 'light' | 'shimmer'
<Skeleton variant="glass" className="h-10 w-full" />
```

---

## 🎨 New Features

### 1. **Multiple Variants**
- `glass` (default) - Glassmorphism with backdrop blur ✨ NEW
- `solid` - More visible with accent colors ✨ NEW
- `light` - Subtle for light backgrounds ✨ NEW
- `shimmer` - Animated gradient effect ✨ NEW

### 2. **Glassmorphism Integration**
- Uses `.glass-panel` utilities
- Backdrop blur effect (glass variant)
- Proper borders with `glass-border` colors
- Border radius using `rounded-glass` (1rem)
- Smooth transitions (300ms)

### 3. **Enhanced Animations**
- **Pulse**: Standard loading animation (all variants)
- **Shimmer**: Gradient sweep animation (shimmer variant only) ✨ NEW

### 4. **Better Accessibility**
- Respects `prefers-reduced-motion` (disables shimmer)
- Proper contrast in both light/dark modes
- Type-safe with `SkeletonProps` interface

---

## 🔄 Migration Steps

### Step 1: Update Basic Usage

```diff
// Old - works but uses undefined color
<Skeleton className="h-10 w-full" />

// New - explicit variant (recommended)
+ <Skeleton variant="glass" className="h-10 w-full" />
```

**Note**: The default variant is `glass`, so if you don't specify a variant, it will use glassmorphism automatically.

### Step 2: Choose Appropriate Variant

```tsx
// For standard loading (default)
<Skeleton variant="glass" className="h-10 w-full" />

// For more visible loading indicators
<Skeleton variant="solid" className="h-10 w-full" />

// For subtle loading on light backgrounds
<Skeleton variant="light" className="h-10 w-full" />

// For premium/enhanced loading experience
<Skeleton variant="shimmer" className="h-10 w-full" />
```

### Step 3: Update Imports (Optional)

```tsx
// If you want to use the type
import { Skeleton, type SkeletonProps } from '@/shared/ui/skeleton';
```

---

## 📍 Files That Need Migration

### Critical Files (Currently use Skeleton)

1. **`src/modules/phoneme-analysis/ui/components/analysis-results.tsx`**
   - Lines 32-34: Uses Skeleton in loading state
   - Current usage is compatible (will use default glass variant)

2. **`src/app/login/page.tsx`**
   - Lines 11-13: Uses Skeleton in Suspense fallback
   - Current usage is compatible (will use default glass variant)

---

## 🔄 Recommended Updates

### File 1: `analysis-results.tsx`

**Current Code:**
```tsx
<div className="space-y-2 max-w-md mx-auto">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4 mx-auto" />
  <Skeleton className="h-4 w-1/2 mx-auto" />
</div>
```

**Enhanced Version:**
```diff
<div className="space-y-2 max-w-md mx-auto">
- <Skeleton className="h-4 w-full" />
- <Skeleton className="h-4 w-3/4 mx-auto" />
- <Skeleton className="h-4 w-1/2 mx-auto" />
+ <Skeleton variant="shimmer" className="h-4 w-full" />
+ <Skeleton variant="shimmer" className="h-4 w-3/4 mx-auto" />
+ <Skeleton variant="shimmer" className="h-4 w-1/2 mx-auto" />
</div>
```

**Why**: Shimmer variant provides better visual feedback during audio analysis.

---

### File 2: `login/page.tsx`

**Current Code:**
```tsx
function LoginFormFallback() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
```

**Enhanced Version (Optional):**
```diff
function LoginFormFallback() {
  return (
    <div className="space-y-6">
-     <Skeleton className="h-10 w-full" />
-     <Skeleton className="h-10 w-full" />
-     <Skeleton className="h-10 w-full" />
+     <Skeleton variant="glass" className="h-10 w-full" />
+     <Skeleton variant="glass" className="h-10 w-full" />
+     <Skeleton variant="glass" className="h-10 w-full" />
    </div>
  );
}
```

**Why**: Explicit variant declaration makes code more maintainable.

---

## 🎨 Variant Selection Guide

| Use Case | Recommended Variant | Example |
|----------|-------------------|---------|
| Default loading | `glass` | Form inputs, general content |
| High visibility needed | `solid` | Important data, metrics |
| Light backgrounds | `light` | Already bright/white areas |
| Long operations | `shimmer` | Audio analysis, file uploads |
| Premium experience | `shimmer` | Dashboard, data visualization |

---

## 📐 Common Patterns

### Pattern 1: Form Loading
```tsx
<div className="space-y-6">
  <div className="space-y-2">
    <Skeleton className="h-4 w-24" /> {/* Label */}
    <Skeleton className="h-10 w-full" /> {/* Input */}
  </div>
  <Skeleton className="h-12 w-32" /> {/* Button */}
</div>
```

### Pattern 2: Card Loading
```tsx
<Card className="p-6">
  <Skeleton className="h-8 w-3/4 mb-4" /> {/* Title */}
  <Skeleton className="h-4 w-full mb-2" /> {/* Line 1 */}
  <Skeleton className="h-4 w-5/6" /> {/* Line 2 */}
</Card>
```

### Pattern 3: Profile Loading
```tsx
<div className="flex items-center space-x-4">
  <Skeleton className="h-16 w-16 rounded-full" /> {/* Avatar */}
  <div className="flex-1 space-y-2">
    <Skeleton className="h-5 w-1/2" /> {/* Name */}
    <Skeleton className="h-4 w-3/4" /> {/* Email */}
  </div>
</div>
```

### Pattern 4: Analysis Loading (Shimmer)
```tsx
<div className="space-y-2 max-w-md mx-auto">
  <Skeleton variant="shimmer" className="h-4 w-full" />
  <Skeleton variant="shimmer" className="h-4 w-3/4 mx-auto" />
  <Skeleton variant="shimmer" className="h-4 w-1/2 mx-auto" />
</div>
```

---

## 🧪 Testing Checklist

After migration, verify:

- [ ] Skeleton appears with glassmorphism effect (glass variant)
- [ ] Colors match design system in **light mode**
- [ ] Colors match design system in **dark mode**
- [ ] Pulse animation is smooth
- [ ] Shimmer animation works (shimmer variant)
- [ ] Respects `prefers-reduced-motion` setting
- [ ] Rounded corners are consistent (1rem)
- [ ] Component is responsive

---

## 🎯 Visual Comparison

### Glass Variant (Default)
- ✅ Backdrop blur effect
- ✅ Subtle borders
- ✅ Matches glass-panel aesthetic
- ✅ Works on any background

### Solid Variant
- ✅ More visible
- ✅ No blur (better performance)
- ✅ Uses accent colors with 10% opacity
- ✅ Good for important placeholders

### Light Variant
- ✅ Very subtle
- ✅ Best for light/bright backgrounds
- ✅ Minimal opacity (20% light, 5% dark)
- ✅ Doesn't distract from content

### Shimmer Variant
- ✅ Animated gradient sweep
- ✅ Premium loading experience
- ✅ Good for long operations
- ✅ Respects reduced motion preferences

---

## 🔗 CSS Additions

The following CSS was added to support the shimmer effect:

```css
/* In globals.css */
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@utility animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}

/* Respects accessibility preference */
@media (prefers-reduced-motion: reduce) {
  .animate-shimmer {
    animation: none;
  }
}
```

---

## ❓ FAQ

**Q: Do I need to update all Skeletons immediately?**  
A: No. The old usage still works and will use the default `glass` variant.

**Q: When should I use shimmer variant?**  
A: Use it for operations that take 2+ seconds, like audio analysis, file uploads, or data processing.

**Q: Will this impact performance?**  
A: Glass variant uses `backdrop-blur` (minimal GPU cost). Shimmer uses CSS animations (very lightweight). Both are optimized.

**Q: Can I create custom variants?**  
A: Yes, but it's better to use the provided variants or combine with custom classes.

**Q: How do I disable animations?**  
A: The component automatically respects `prefers-reduced-motion` system setting.

---

## 🎨 Example: Complete Migration

### Before
```tsx
// analysis-results.tsx
import { Skeleton } from '@/shared/ui/skeleton';

function LoadingState() {
  return (
    <div className="space-y-2 max-w-md mx-auto">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-1/2 mx-auto" />
    </div>
  );
}
```

### After (Enhanced)
```tsx
// analysis-results.tsx
import { Skeleton } from '@/shared/ui/skeleton';

function LoadingState() {
  return (
    <div className="space-y-2 max-w-md mx-auto">
      {/* Using shimmer for audio analysis feedback */}
      <Skeleton variant="shimmer" className="h-4 w-full" />
      <Skeleton variant="shimmer" className="h-4 w-3/4 mx-auto" />
      <Skeleton variant="shimmer" className="h-4 w-1/2 mx-auto" />
    </div>
  );
}
```

---

## 🔗 Related Documentation

- **Design System**: `documentation/DESIGN_SYSTEM.md` - Section 2 (Glassmorphism)
- **Examples**: `src/shared/ui/skeleton.examples.tsx` - 13 usage patterns
- **Color Palette**: `tailwind.config.ts` - Glass system colors
- **Animations**: `src/app/globals.css` - Shimmer keyframes

---

## ✅ Completion Checklist

- [x] Skeleton component refactored with CVA
- [x] 4 variants implemented (glass, solid, light, shimmer)
- [x] Glassmorphism utilities integrated
- [x] Shimmer animation added to globals.css
- [x] Dark mode support
- [x] Accessibility (reduced-motion support)
- [x] SkeletonProps type exported
- [x] Migration guide created
- [x] 13 usage examples documented
- [x] **DONE**: Update analysis-results.tsx to use shimmer variant
- [x] **DONE**: Update login/page.tsx with explicit glass variant
- [ ] **TODO**: Add Storybook stories (future enhancement)

---

**Last Updated**: December 7, 2025  
**Status**: ✅ Refactoring Complete - Ready for Production  
**Backward Compatible**: Yes (default variant is glass)  
**All Known Usages**: Migrated ✅
