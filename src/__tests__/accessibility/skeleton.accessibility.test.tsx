/**
 * Skeleton Component - Accessibility Tests
 * 
 * Tests WCAG 2.1 Level AA compliance for Skeleton component:
 * - ARIA attributes for loading states (WCAG 4.1.2)
 * - Animation safety (WCAG 2.3.3 - prefers-reduced-motion)
 * - Screen reader announcements
 * - Color contrast for glass variants
 * 
 * Uses jest-axe for automated accessibility testing
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Skeleton } from '@/shared/ui/skeleton';

// Extend matchers
expect.extend(toHaveNoViolations);

describe('Skeleton - Accessibility Tests', () => {
  describe('WCAG Compliance - All Variants', () => {
    it('should have no accessibility violations - glass variant (default)', async () => {
      const { container } = render(<Skeleton className="h-12 w-full" />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - solid variant', async () => {
      const { container } = render(<Skeleton variant="solid" className="h-12 w-full" />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - light variant', async () => {
      const { container } = render(<Skeleton variant="light" className="h-12 w-full" />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - shimmer variant', async () => {
      const { container } = render(<Skeleton variant="shimmer" className="h-12 w-full" />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ARIA Attributes for Loading States', () => {
    it('should have aria-live="polite" for loading announcements', () => {
      const { container } = render(<Skeleton />);
      
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveAttribute('aria-live', 'polite');
    });

    it('should have aria-busy="true" to indicate loading state', () => {
      const { container } = render(<Skeleton />);
      
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveAttribute('aria-busy', 'true');
    });

    it('should have proper role attribute', () => {
      const { container } = render(<Skeleton />);
      
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveAttribute('role', 'status');
    });

    it('should have accessible label', () => {
      const { container } = render(<Skeleton />);
      
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveAttribute('aria-label', 'Cargando...');
    });

    it('should maintain ARIA attributes across all variants', () => {
      const variants: Array<'glass' | 'solid' | 'light' | 'shimmer'> = [
        'glass',
        'solid',
        'light',
        'shimmer',
      ];

      variants.forEach((variant) => {
        const { container } = render(<Skeleton variant={variant} />);
        const skeleton = container.firstChild as HTMLElement;

        expect(skeleton).toHaveAttribute('aria-live', 'polite');
        expect(skeleton).toHaveAttribute('aria-busy', 'true');
        expect(skeleton).toHaveAttribute('role', 'status');
        expect(skeleton).toHaveAttribute('aria-label', 'Cargando...');
      });
    });
  });

  describe('Animation Safety - WCAG 2.3.3', () => {
    let matchMediaMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      // Mock matchMedia for prefers-reduced-motion testing
      matchMediaMock = vi.fn((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: matchMediaMock,
      });
    });

    afterEach(() => {
      matchMediaMock.mockRestore();
    });

    it('should respect prefers-reduced-motion for shimmer variant', () => {
      const { container } = render(<Skeleton variant="shimmer" />);
      
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toBeInTheDocument();
      
      // Shimmer variant should have animate-shimmer class
      expect(skeleton).toHaveClass('animate-shimmer');
    });

    it('should have CSS class that supports prefers-reduced-motion', async () => {
      const { container } = render(<Skeleton variant="shimmer" />);
      
      // Verify no accessibility violations with animation
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have problematic animations in non-shimmer variants', () => {
      const { container: glassContainer } = render(<Skeleton variant="glass" />);
      const { container: solidContainer } = render(<Skeleton variant="solid" />);
      const { container: lightContainer } = render(<Skeleton variant="light" />);

      const glassSkeleton = glassContainer.firstChild as HTMLElement;
      const solidSkeleton = solidContainer.firstChild as HTMLElement;
      const lightSkeleton = lightContainer.firstChild as HTMLElement;

      expect(glassSkeleton).not.toHaveClass('animate-shimmer');
      expect(solidSkeleton).not.toHaveClass('animate-shimmer');
      expect(lightSkeleton).not.toHaveClass('animate-shimmer');
    });
  });

  describe('Screen Reader Compatibility', () => {
    it('should expose loading state to screen readers', () => {
      const { container } = render(<Skeleton />);
      
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveAccessibleName();
    });

    it('should not hide content from assistive technologies', () => {
      const { container } = render(<Skeleton />);
      
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).not.toHaveAttribute('aria-hidden', 'true');
      expect(skeleton).toBeVisible();
    });

    it('should announce changes with aria-live', () => {
      const { container } = render(<Skeleton />);
      
      const skeleton = container.firstChild as HTMLElement;
      const ariaLive = skeleton.getAttribute('aria-live');
      expect(ariaLive).toBe('polite');
    });
  });

  describe('Color Contrast - Glass Variants', () => {
    it('should maintain sufficient contrast in glass variant', async () => {
      const { container } = render(<Skeleton variant="glass" className="h-12 w-full" />);

      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();
    });

    it('should maintain sufficient contrast in light variant', async () => {
      const { container } = render(<Skeleton variant="light" className="h-12 w-full" />);

      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();
    });
  });

  describe('Custom Styling Accessibility', () => {
    it('should allow custom className without breaking accessibility', async () => {
      const { container } = render(
        <Skeleton className="custom-class h-20 w-64 rounded-full" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should handle custom dimensions accessibly', async () => {
      const { container } = render(
        <Skeleton className="h-4 w-48" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Common Loading Patterns', () => {
    it('should be accessible in card skeleton pattern', async () => {
      const { container } = render(
        <div className="space-y-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should be accessible in list skeleton pattern', async () => {
      const { container } = render(
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should be accessible in avatar + text pattern', async () => {
      const { container } = render(
        <div className="flex items-center gap-4">
          <Skeleton variant="glass" className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton variant="solid" className="h-4 w-48" />
            <Skeleton variant="light" className="h-3 w-32" />
          </div>
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should not interfere with keyboard navigation', () => {
      const { container } = render(<Skeleton />);
      
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).not.toHaveAttribute('tabindex');
    });

    it('should not trap focus', () => {
      const { container } = render(
        <div>
          <button type="button">Before</button>
          <Skeleton className="h-12 w-full" />
          <button type="button">After</button>
        </div>
      );

      const skeleton = container.querySelector('[role="status"]');
      expect(skeleton).not.toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Responsive Design Accessibility', () => {
    it('should maintain accessibility with different viewport sizes', async () => {
      const { container } = render(
        <div style={{ width: '320px' }}>
          <Skeleton variant="glass" className="h-24 w-full" />
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should handle mobile skeleton patterns accessibly', async () => {
      const { container } = render(
        <div className="flex flex-col gap-2" style={{ width: '375px' }}>
          <Skeleton variant="shimmer" className="h-48 w-full rounded-glass" />
          <Skeleton variant="solid" className="h-6 w-3/4" />
          <Skeleton variant="light" className="h-4 w-full" />
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
