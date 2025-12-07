'use client';

import * as React from 'react';
import { cn } from '@/shared/utils/cn';

interface SkipLink {
  href: string;
  label: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
  className?: string;
}

const defaultLinks: SkipLink[] = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#navigation', label: 'Skip to navigation' },
];

/**
 * SkipLinks Component
 * 
 * Provides keyboard navigation shortcuts for accessibility.
 * Hidden by default, becomes visible when focused via Tab key.
 * 
 * Meets WCAG 2.1 Success Criterion 2.4.1 (Bypass Blocks)
 * 
 * @example
 * // In layout.tsx
 * <SkipLinks />
 * 
 * @example
 * // With custom links
 * <SkipLinks links={[
 *   { href: '#content', label: 'Skip to content' },
 *   { href: '#footer', label: 'Skip to footer' }
 * ]} />
 */
const SkipLinks = React.forwardRef<HTMLDivElement, SkipLinksProps>(
  ({ links = defaultLinks, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'fixed top-4 left-4 z-[9999]',
          'flex flex-col gap-2',
          className
        )}
        role="navigation"
        aria-label="Skip links"
      >
        {links.map((link, index) => (
          <a
            key={`${link.href}-${index}`}
            href={link.href}
            className={cn(
              // Absolutely positioned off-screen by default
              'sr-only',
              // Glass panel styling
              'glass-panel px-4 py-2 text-sm font-medium',
              'glass-text backdrop-blur-glass',
              'rounded-glass border-2 border-primary-500/50',
              'shadow-glass-hover',
              // Focus state - becomes visible (not sr-only)
              'focus:not-sr-only focus:absolute',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'focus:ring-offset-light-base dark:focus:ring-offset-dark-deep',
              // Smooth transitions
              'transition-all duration-200 ease-out',
              // Hover effect when visible
              'hover:shadow-glass-hover hover:border-primary-500',
              'hover:scale-105 active:scale-100'
            )}
            onClick={(e) => {
              e.preventDefault();
              const target = document.querySelector(link.href);
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Set focus to the target element for screen readers
                if (target instanceof HTMLElement) {
                  target.focus({ preventScroll: true });
                }
              }
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    );
  }
);

SkipLinks.displayName = 'SkipLinks';

export { SkipLinks };
export type { SkipLinksProps, SkipLink };
