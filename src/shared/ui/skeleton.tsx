import * as React from 'react';
import { cn } from '@/shared/utils/cn';
import { type VariantProps, cva } from 'class-variance-authority';

const skeletonVariants = cva(
  // Base styles - glassmorphism loading effect
  "animate-pulse rounded-glass backdrop-blur-sm transition-all duration-300",
  {
    variants: {
      variant: {
        // Glass - Glassmorphism effect (default)
        glass: "bg-glass-light dark:bg-glass-dark border border-glass-border dark:border-glass-border-dark",
        
        // Solid - More visible loading state
        solid: "bg-accent-primary/10 dark:bg-light-base/10",
        
        // Light - Subtle loading state
        light: "bg-white/20 dark:bg-white/5",
        
        // Shimmer - Animated gradient effect
        shimmer: "bg-gradient-to-r from-glass-light via-white/30 to-glass-light dark:from-glass-dark dark:via-white/10 dark:to-glass-dark bg-[length:200%_100%] animate-shimmer",
      },
    },
    defaultVariants: {
      variant: "glass",
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label="Cargando..."
        className={cn(skeletonVariants({ variant, className }))}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

export { Skeleton, skeletonVariants };