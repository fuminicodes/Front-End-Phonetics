# Alert Component Migration Guide

## 📋 Overview

The Alert component has been **refactored to follow the Nebula Glass Design System**. This guide helps you migrate existing Alert usage to the new implementation.

---

## ✅ What Changed

### Before (Old Implementation)
```tsx
import { Alert, AlertDescription } from '@/shared/ui/alert';

// Only 2 variants: 'default' | 'destructive'
<Alert variant="destructive">
  <AlertDescription>Error message</AlertDescription>
</Alert>
```

### After (New Implementation)
```tsx
import { Alert, AlertTitle, AlertDescription } from '@/shared/ui/alert';

// 5 variants: 'default' | 'info' | 'success' | 'warning' | 'destructive'
<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Error message</AlertDescription>
</Alert>
```

---

## 🎨 New Features

### 1. **More Variants**
- `default` - Neutral glassmorphism (replaces old default)
- `info` - Blue tones for informational messages ✨ NEW
- `success` - Green tones for success states ✨ NEW
- `warning` - Yellow/Orange tones for warnings ✨ NEW
- `destructive` - Red tones for errors (improved from old version)

### 2. **AlertTitle Component** ✨ NEW
Optional title component for better semantic structure:
```tsx
<Alert variant="success">
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>Your changes have been saved.</AlertDescription>
</Alert>
```

### 3. **Glassmorphism Integration**
- Uses `.glass-panel` utility
- Backdrop blur effect
- Proper color overlays (50% light, 20% dark)
- Border transparency (30%)
- Smooth transitions

### 4. **Better Accessibility**
- Improved color contrast ratios (WCAG AA compliant)
- Proper semantic HTML
- SVG icon support with correct positioning
- Dark mode optimization

---

## 🔄 Migration Steps

### Step 1: Update Imports
```diff
- import { Alert, AlertDescription } from '@/shared/ui/alert';
+ import { Alert, AlertTitle, AlertDescription } from '@/shared/ui/alert';
```

### Step 2: Review Variant Usage

#### If using `variant="default"`:
```tsx
// Old - generic border and text
<Alert variant="default">
  <AlertDescription>Message</AlertDescription>
</Alert>

// New - consider using a more specific variant
<Alert variant="info">  {/* or success, warning, etc. */}
  <AlertDescription>Message</AlertDescription>
</Alert>
```

#### If using `variant="destructive"`:
```tsx
// Old - still works but enhanced
<Alert variant="destructive">
  <AlertDescription>Error message</AlertDescription>
</Alert>

// New - same variant, better styling
<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>  {/* Optional but recommended */}
  <AlertDescription>Error message</AlertDescription>
</Alert>
```

### Step 3: Add Titles (Optional but Recommended)
```tsx
// Before
<Alert variant="destructive">
  <AlertDescription>
    Recording Error: Microphone not found
  </AlertDescription>
</Alert>

// After - Better semantic structure
<Alert variant="destructive">
  <AlertTitle>Recording Error</AlertTitle>
  <AlertDescription>
    Microphone not found. Please check your device settings.
  </AlertDescription>
</Alert>
```

---

## 📍 Files That Need Migration

### Critical Files (Used Alert component)

1. **`src/modules/phoneme-analysis/ui/components/audio-recorder.tsx`**
   - Line ~127: Uses `<Alert variant="destructive">`
   - Current usage is compatible but can be enhanced

### Recommended Changes

```diff
// audio-recorder.tsx (line ~127)
  {error && (
    <Alert variant="destructive">
+     <AlertTitle>Recording Error</AlertTitle>
      <AlertDescription>
-       <div>
-         <Typography variant="p" className="font-semibold">Recording Error:</Typography>
-         <Typography variant="p">{error}</Typography>
-       </div>
+       {error}
      </AlertDescription>
    </Alert>
  )}
```

---

## 🎨 Variant Selection Guide

| Use Case | Recommended Variant | Example |
|----------|-------------------|---------|
| General notice | `default` | "Settings have been loaded" |
| Information, tips | `info` | "Recording in progress..." |
| Success confirmation | `success` | "Audio uploaded successfully!" |
| Warning, caution | `warning` | "File size is large" |
| Error, critical | `destructive` | "Failed to process audio" |

---

## 🧪 Testing Checklist

After migration, test:

- [ ] Alert appears with glassmorphism effect
- [ ] Colors match design system in **light mode**
- [ ] Colors match design system in **dark mode**
- [ ] Icons (if used) are properly positioned
- [ ] Text has good contrast ratio
- [ ] Transitions are smooth
- [ ] Component is responsive on mobile

---

## 🎯 Example: Complete Migration

### Before
```tsx
// Old implementation
import { Alert, AlertDescription } from '@/shared/ui/alert';

function ErrorDisplay({ error }: { error?: string }) {
  if (!error) return null;
  
  return (
    <Alert variant="destructive">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
```

### After
```tsx
// New implementation - Enhanced with design system
import { Alert, AlertTitle, AlertDescription } from '@/shared/ui/alert';

function ErrorDisplay({ error }: { error?: string }) {
  if (!error) return null;
  
  return (
    <Alert variant="destructive">
      <AlertTitle>⚠️ Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
```

---

## 🔗 Related Documentation

- **Design System**: `documentation/DESIGN_SYSTEM.md` - Section 5 (Accesibilidad)
- **Examples**: `src/shared/ui/alert.examples.tsx` - 10 usage examples
- **Color Palette**: `tailwind.config.ts` - Status colors (success, warning, danger, info)

---

## ❓ FAQ

**Q: Do I need to update all Alerts immediately?**  
A: No, the old usage still works for `destructive` variant. But updating provides better UX and consistency.

**Q: Can I still use Alert without AlertTitle?**  
A: Yes! AlertTitle is optional. Use it when you need semantic structure.

**Q: Will this break my existing code?**  
A: No. The `destructive` variant is backward compatible. Only new variants are added.

**Q: How do I test the glassmorphism effect?**  
A: Make sure your Alert is placed over a BackgroundWrapper or colored background to see the blur effect.

---

## ✅ Completion Checklist

- [x] Alert component refactored
- [x] AlertTitle component added
- [x] 5 variants implemented (default, info, success, warning, destructive)
- [x] Glassmorphism utilities integrated
- [x] Dark mode support
- [x] Accessibility improvements (contrast, semantics)
- [x] Migration guide created
- [x] Usage examples documented
- [ ] **TODO**: Update audio-recorder.tsx to use new pattern
- [ ] **TODO**: Add accessibility tests (jest-axe)

---

**Last Updated**: December 7, 2025  
**Status**: ✅ Refactoring Complete - Ready for Use
