/**
 * Alert Component - Accessibility Tests
 * 
 * Tests WCAG 2.1 Level AA compliance for Alert component:
 * - Color contrast ratios (WCAG 1.4.3 - minimum 4.5:1)
 * - Semantic HTML and ARIA attributes (WCAG 4.1.2)
 * - Keyboard navigation (WCAG 2.1.1)
 * - Screen reader compatibility
 * 
 * Uses jest-axe for automated accessibility testing
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Alert, AlertTitle } from '@/shared/ui/alert';

// Extend matchers
expect.extend(toHaveNoViolations);

describe('Alert - Accessibility Tests', () => {
  describe('WCAG Compliance - All Variants', () => {
    it('should have no accessibility violations - default variant', async () => {
      const { container } = render(
        <Alert>
          <AlertTitle>Default Alert</AlertTitle>
          This is a default alert message with standard styling.
        </Alert>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - info variant', async () => {
      const { container } = render(
        <Alert variant="info">
          <AlertTitle>Information</AlertTitle>
          This is an informational alert with blue accent.
        </Alert>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - success variant', async () => {
      const { container } = render(
        <Alert variant="success">
          <AlertTitle>Success</AlertTitle>
          Operation completed successfully!
        </Alert>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - warning variant', async () => {
      const { container } = render(
        <Alert variant="warning">
          <AlertTitle>Warning</AlertTitle>
          Please review this important notice.
        </Alert>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - destructive variant', async () => {
      const { container } = render(
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          An error occurred while processing your request.
        </Alert>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Semantic HTML and ARIA', () => {
    it('should use semantic div with proper role', () => {
      const { container } = render(
        <Alert>
          <AlertTitle>Test Alert</AlertTitle>
          Test content
        </Alert>
      );

      const alert = container.querySelector('[role="alert"]');
      expect(alert).toBeInTheDocument();
    });

    it('should have proper heading structure for AlertTitle', () => {
      const { getByRole } = render(
        <Alert>
          <AlertTitle>Test Title</AlertTitle>
          Test content
        </Alert>
      );

      const heading = getByRole('heading', { level: 5 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Test Title');
    });

    it('should allow custom className without breaking accessibility', async () => {
      const { container } = render(
        <Alert className="custom-class">
          <AlertTitle>Custom Alert</AlertTitle>
          Custom content
        </Alert>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Content Visibility and Screen Readers', () => {
    it('should expose text content to screen readers', () => {
      const { getByText } = render(
        <Alert>
          <AlertTitle>Accessible Title</AlertTitle>
          This content should be readable by screen readers.
        </Alert>
      );

      expect(getByText('Accessible Title')).toBeInTheDocument();
      expect(getByText(/This content should be readable/)).toBeInTheDocument();
    });

    it('should not hide content from assistive technologies', () => {
      const { container } = render(
        <Alert variant="info">
          <AlertTitle>Important Information</AlertTitle>
          All users should see this message.
        </Alert>
      );

      const alert = container.querySelector('[role="alert"]');
      expect(alert).not.toHaveAttribute('aria-hidden', 'true');
      expect(alert).toBeVisible();
    });
  });

  describe('Color Contrast - WCAG 1.4.3', () => {
    it('should maintain sufficient contrast in default variant', () => {
      const { container } = render(
        <Alert>
          <AlertTitle>Contrast Test</AlertTitle>
          Text content
        </Alert>
      );

      const alert = container.firstChild;
      expect(alert).toBeInTheDocument();
      // Visual contrast verified through jest-axe color-contrast rule
    });

    it('should maintain sufficient contrast in all color variants', async () => {
      const variants: Array<'default' | 'info' | 'success' | 'warning' | 'destructive'> = [
        'default',
        'info',
        'success',
        'warning',
        'destructive',
      ];

      for (const variant of variants) {
        const { container } = render(
          <Alert variant={variant}>
            <AlertTitle>Contrast Test - {variant}</AlertTitle>
            Testing color contrast for {variant} variant
          </Alert>
        );

        const results = await axe(container, {
          rules: {
            'color-contrast': { enabled: true },
          },
        });

        expect(results).toHaveNoViolations();
      }
    });
  });

  describe('Keyboard Navigation', () => {
    it('should be keyboard accessible when interactive elements are present', async () => {
      const { container } = render(
        <Alert>
          <AlertTitle>Interactive Alert</AlertTitle>
          <button type="button">Dismiss</button>
        </Alert>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not trap keyboard focus', () => {
      const { container } = render(
        <Alert>
          <AlertTitle>Focus Test</AlertTitle>
          Content without focus trap
        </Alert>
      );

      const alert = container.firstChild as HTMLElement;
      expect(alert).not.toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Complex Content Scenarios', () => {
    it('should handle alerts with links accessibly', async () => {
      const { container } = render(
        <Alert variant="info">
          <AlertTitle>Action Required</AlertTitle>
          Please <a href="/docs">read the documentation</a> for more information.
        </Alert>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should handle alerts with buttons accessibly', async () => {
      const { container } = render(
        <Alert variant="warning">
          <AlertTitle>Confirmation Needed</AlertTitle>
          <div className="mt-2 flex gap-2">
            <button type="button">Confirm</button>
            <button type="button">Cancel</button>
          </div>
        </Alert>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should handle alerts without AlertTitle', async () => {
      const { container } = render(
        <Alert variant="success">
          Simple success message without a title.
        </Alert>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Responsive Design Accessibility', () => {
    it('should maintain accessibility with different viewport sizes', async () => {
      const { container } = render(
        <div style={{ width: '320px' }}>
          <Alert variant="info">
            <AlertTitle>Mobile Viewport</AlertTitle>
            Testing accessibility on mobile screens.
          </Alert>
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
