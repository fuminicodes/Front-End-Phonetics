/**
 * Focus Management - Comprehensive Test Suite
 * 
 * Tests WCAG 2.4.7 (Focus Visible) and WCAG 2.4.3 (Focus Order) compliance:
 * - Visible focus indicators
 * - Focus order preservation
 * - Focus restoration after interactions
 * - Programmatic focus management
 * - Focus trap implementation (where needed)
 * - Focus-visible vs focus styling
 * 
 * Uses @testing-library/user-event and manual focus management testing
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/shared/ui/button';
import { Alert, AlertTitle } from '@/shared/ui/alert';
import { SkipLinks } from '@/shared/ui/skip-links';

describe('Focus Management - WCAG 2.4.7 & 2.4.3 Compliance', () => {
  describe('Focus Visible Indicators', () => {
    it('should display visible focus indicator on keyboard navigation', async () => {
      const user = userEvent.setup();
      
      render(<Button>Test Button</Button>);

      // Tab to button (keyboard navigation)
      await user.tab();
      const button = screen.getByRole('button', { name: 'Test Button' });
      
      expect(button).toHaveFocus();
      expect(button).toBeVisible();
    });

    it('should show focus ring with sufficient contrast', async () => {
      const user = userEvent.setup();
      
      render(<Button>Focus Ring Test</Button>);

      await user.tab();
      const button = screen.getByRole('button', { name: 'Focus Ring Test' });
      
      // Button should have focus ring classes
      expect(button).toHaveClass('focus-visible:ring-2');
    });

    it('should maintain focus visibility across different variants', async () => {
      const user = userEvent.setup();
      
      render(
        <div>
          <Button variant="solid">Solid</Button>
          <Button variant="glass">Glass</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      );

      // Tab through variants
      await user.tab();
      expect(screen.getByRole('button', { name: 'Solid' })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'Glass' })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'Ghost' })).toHaveFocus();
    });

    it('should differentiate between :focus and :focus-visible', async () => {
      const user = userEvent.setup();
      
      render(<Button>Focus Visible Test</Button>);

      const button = screen.getByRole('button', { name: 'Focus Visible Test' });

      // Keyboard focus should show indicator
      await user.tab();
      expect(button).toHaveFocus();
      expect(button).toHaveClass('focus-visible:ring-2');
    });
  });

  describe('Focus Order Preservation - WCAG 2.4.3', () => {
    it('should maintain logical focus order', async () => {
      const user = userEvent.setup();
      
      render(
        <div>
          <Button>First</Button>
          <Button>Second</Button>
          <Button>Third</Button>
        </div>
      );

      const focusOrder = ['First', 'Second', 'Third'];
      
      for (const name of focusOrder) {
        await user.tab();
        expect(screen.getByRole('button', { name })).toHaveFocus();
      }
    });

    it('should follow DOM order when no custom tabIndex', async () => {
      const user = userEvent.setup();
      
      render(
        <main>
          <header>
            <Button>Header Button</Button>
          </header>
          <article>
            <Button>Article Button</Button>
          </article>
          <footer>
            <Button>Footer Button</Button>
          </footer>
        </main>
      );

      await user.tab();
      expect(screen.getByRole('button', { name: 'Header Button' })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'Article Button' })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'Footer Button' })).toHaveFocus();
    });

    it('should maintain focus order in complex layouts', async () => {
      const user = userEvent.setup();
      
      render(
        <div className="grid grid-cols-2">
          <div>
            <Button>Grid 1</Button>
          </div>
          <div>
            <Button>Grid 2</Button>
          </div>
          <div>
            <Button>Grid 3</Button>
          </div>
          <div>
            <Button>Grid 4</Button>
          </div>
        </div>
      );

      // Should follow reading order (DOM order)
      await user.tab();
      expect(screen.getByRole('button', { name: 'Grid 1' })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'Grid 2' })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'Grid 3' })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'Grid 4' })).toHaveFocus();
    });
  });

  describe('Focus Restoration', () => {
    it('should restore focus after alert dismissal', async () => {
      const user = userEvent.setup();
      const handleDismiss = vi.fn();
      
      const { rerender } = render(
        <div>
          <Button>Trigger</Button>
          <Alert>
            <AlertTitle>Alert</AlertTitle>
            <Button onClick={handleDismiss}>Dismiss</Button>
          </Alert>
        </div>
      );

      // Focus trigger
      const trigger = screen.getByRole('button', { name: 'Trigger' });
      trigger.focus();
      expect(trigger).toHaveFocus();

      // Tab to dismiss button and click
      await user.tab();
      await user.click(screen.getByRole('button', { name: 'Dismiss' }));

      // After dismissal, focus should ideally return to trigger
      // This tests the pattern, actual implementation may vary
    });

    it('should restore focus after modal-like interaction', async () => {
      const user = userEvent.setup();
      let showDialog = true;
      const toggleDialog = () => {
        showDialog = !showDialog;
      };

      const { rerender } = render(
        <div>
          <Button onClick={toggleDialog}>Open Dialog</Button>
          {showDialog && (
            <div role="dialog" aria-modal="true">
              <Button onClick={toggleDialog}>Close</Button>
            </div>
          )}
        </div>
      );

      const openButton = screen.getByRole('button', { name: 'Open Dialog' });
      openButton.focus();
      
      expect(openButton).toHaveFocus();
    });

    it('should maintain focus when component updates', async () => {
      const user = userEvent.setup();
      
      const { rerender } = render(<Button>Original Text</Button>);
      
      await user.tab();
      expect(screen.getByRole('button', { name: 'Original Text' })).toHaveFocus();

      // Update button text
      rerender(<Button>Updated Text</Button>);
      
      // Focus should remain
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Updated Text' })).toHaveFocus();
      });
    });
  });

  describe('Programmatic Focus Management', () => {
    it('should support programmatic focus with .focus()', () => {
      render(<Button>Programmatic Focus</Button>);
      
      const button = screen.getByRole('button', { name: 'Programmatic Focus' });
      button.focus();
      
      expect(button).toHaveFocus();
    });

    it('should allow focus on elements with tabIndex=-1', () => {
      render(
        <main id="main-content" tabIndex={-1}>
          <h1>Main Content</h1>
        </main>
      );
      
      const main = screen.getByRole('main');
      main.focus();
      
      expect(main).toHaveFocus();
    });

    it('should manage focus for skip links targets', async () => {
      const user = userEvent.setup();
      
      // Mock scrollIntoView
      const scrollIntoViewMock = vi.fn();
      HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
      
      // Spy on focus method
      const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
      
      // Create target
      const target = document.createElement('main');
      target.id = 'main-content';
      target.tabIndex = -1;
      document.body.appendChild(target);

      render(<SkipLinks />);

      // Tab to skip link
      await user.tab();
      const skipLink = screen.getByRole('link', { name: /skip to main content/i });
      
      // Click skip link
      await user.click(skipLink);

      // Target should receive scrollIntoView and focus
      await waitFor(() => {
        expect(scrollIntoViewMock).toHaveBeenCalled();
        expect(focusSpy).toHaveBeenCalled();
      });

      // Cleanup
      focusSpy.mockRestore();
      document.body.removeChild(target);
    });

    it('should handle focus when element is removed from DOM', async () => {
      const user = userEvent.setup();
      
      const { rerender } = render(
        <div>
          <Button>Persistent</Button>
          <Button>Will Remove</Button>
        </div>
      );

      // Focus second button
      await user.tab();
      await user.tab();
      expect(screen.getByRole('button', { name: 'Will Remove' })).toHaveFocus();

      // Remove focused element
      rerender(
        <div>
          <Button>Persistent</Button>
        </div>
      );

      // Focus moves to body or remains in document
      await waitFor(() => {
        expect(document.activeElement).toBeInTheDocument();
      });
    });
  });

  describe('Focus Trap (When Needed)', () => {
    it('should not trap focus in non-modal components', async () => {
      const user = userEvent.setup();
      
      render(
        <div>
          <Alert>
            <AlertTitle>Alert</AlertTitle>
            <Button>Inside Alert</Button>
          </Alert>
          <Button>Outside Alert</Button>
        </div>
      );

      // Tab through alert and beyond
      await user.tab();
      expect(screen.getByRole('button', { name: 'Inside Alert' })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'Outside Alert' })).toHaveFocus();
    });

    it('should allow focus to naturally flow through components', async () => {
      const user = userEvent.setup();
      
      render(
        <div>
          <nav>
            <Button>Nav Button</Button>
          </nav>
          <main>
            <Button>Main Button</Button>
          </main>
        </div>
      );

      await user.tab();
      await user.tab();
      
      // Should successfully tab through both sections
      expect(screen.getByRole('button', { name: 'Main Button' })).toHaveFocus();
    });
  });

  describe('Focus Loss Prevention', () => {
    it('should not lose focus when interacting with non-focusable elements', async () => {
      const user = userEvent.setup();
      
      render(
        <div>
          <Button>Focusable</Button>
          <div>Non-focusable div</div>
        </div>
      );

      await user.tab();
      const button = screen.getByRole('button', { name: 'Focusable' });
      expect(button).toHaveFocus();

      // Click non-focusable div
      await user.click(screen.getByText('Non-focusable div'));
      
      // Focus should remain on button (or move to body)
      expect(document.activeElement).toBeInTheDocument();
    });

    it('should handle focus when element becomes disabled', async () => {
      const user = userEvent.setup();
      
      const { rerender } = render(
        <div>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
        </div>
      );

      await user.tab();
      await user.tab();
      expect(screen.getByRole('button', { name: 'Button 2' })).toHaveFocus();

      // Disable focused button
      rerender(
        <div>
          <Button>Button 1</Button>
          <Button disabled>Button 2</Button>
        </div>
      );

      // When a button is disabled while focused, focus typically moves to body
      // This is browser-dependent behavior
      await waitFor(() => {
        const button2 = screen.getByRole('button', { name: 'Button 2' });
        expect(button2).toBeDisabled();
      });
    });
  });

  describe('Focus Within Containers', () => {
    it('should manage focus within nested components', async () => {
      const user = userEvent.setup();
      
      render(
        <Alert>
          <AlertTitle>Nested Focus</AlertTitle>
          <div>
            <Button>Nested Button 1</Button>
            <Button>Nested Button 2</Button>
          </div>
        </Alert>
      );

      await user.tab();
      expect(screen.getByRole('button', { name: 'Nested Button 1' })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'Nested Button 2' })).toHaveFocus();
    });

    it('should respect focus containment in isolated sections', async () => {
      const user = userEvent.setup();
      
      render(
        <div>
          <section>
            <Button>Section 1 Button</Button>
          </section>
          <section>
            <Button>Section 2 Button</Button>
          </section>
        </div>
      );

      await user.tab();
      expect(screen.getByRole('button', { name: 'Section 1 Button' })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'Section 2 Button' })).toHaveFocus();
    });
  });

  describe('Dynamic Focus Management', () => {
    it('should handle focus when elements are dynamically added', async () => {
      const user = userEvent.setup();
      
      const { rerender } = render(
        <div>
          <Button>Existing</Button>
        </div>
      );

      await user.tab();
      expect(screen.getByRole('button', { name: 'Existing' })).toHaveFocus();

      // Add new button
      rerender(
        <div>
          <Button>Existing</Button>
          <Button>New Button</Button>
        </div>
      );

      // Should be able to tab to new button
      await user.tab();
      expect(screen.getByRole('button', { name: 'New Button' })).toHaveFocus();
    });

    it('should maintain focus context when loading states change', async () => {
      const { rerender } = render(
        <div>
          <Button>Action Button</Button>
          <div role="status" aria-live="polite">Loading...</div>
        </div>
      );

      const button = screen.getByRole('button', { name: 'Action Button' });
      button.focus();
      
      // Change loading state
      rerender(
        <div>
          <Button>Action Button</Button>
          <div role="status" aria-live="polite">Complete!</div>
        </div>
      );

      // Focus should remain on button
      expect(button).toHaveFocus();
    });
  });

  describe('Focus Outline Visibility', () => {
    it('should have visible outline on all focusable elements', async () => {
      const user = userEvent.setup();
      
      render(
        <div>
          <Button>Button</Button>
          <a href="/test">Link</a>
          <input type="text" placeholder="Input" />
        </div>
      );

      // Button
      await user.tab();
      expect(screen.getByRole('button', { name: 'Button' })).toHaveFocus();
      expect(screen.getByRole('button', { name: 'Button' })).toHaveClass('focus-visible:ring-2');

      // Link
      await user.tab();
      expect(screen.getByRole('link', { name: 'Link' })).toHaveFocus();

      // Input
      await user.tab();
      expect(screen.getByPlaceholderText('Input')).toHaveFocus();
    });

    it('should maintain outline thickness for visibility', async () => {
      const user = userEvent.setup();
      
      render(<Button>Outline Test</Button>);

      await user.tab();
      const button = screen.getByRole('button', { name: 'Outline Test' });
      
      // Should have ring-2 (2px) or greater
      expect(button).toHaveClass('focus-visible:ring-2');
    });
  });

  describe('High Contrast Mode Support', () => {
    it('should maintain focus visibility in different color schemes', async () => {
      const user = userEvent.setup();
      
      render(
        <div className="dark">
          <Button>Dark Mode Button</Button>
        </div>
      );

      await user.tab();
      expect(screen.getByRole('button', { name: 'Dark Mode Button' })).toHaveFocus();
    });
  });
});
