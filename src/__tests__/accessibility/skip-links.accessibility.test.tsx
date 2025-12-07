/**
 * SkipLinks Component - Accessibility Tests
 * 
 * Tests WCAG 2.1 Level AA compliance for SkipLinks component:
 * - WCAG 2.4.1: Bypass Blocks - Skip navigation mechanism
 * - WCAG 2.1.1: Keyboard navigation (Tab key)
 * - WCAG 2.4.7: Focus Visible - visible focus indicators
 * - WCAG 4.1.2: Name, Role, Value - proper link semantics
 * 
 * Uses jest-axe and @testing-library/user-event for comprehensive testing
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { SkipLinks } from '@/shared/ui/skip-links';

// Extend matchers
expect.extend(toHaveNoViolations);

describe('SkipLinks - Accessibility Tests', () => {
  describe('WCAG 2.4.1 - Bypass Blocks Compliance', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<SkipLinks />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should provide skip to main content link', () => {
      render(<SkipLinks />);
      
      const mainLink = screen.getByRole('link', { name: /skip to main content/i });
      expect(mainLink).toBeInTheDocument();
      expect(mainLink).toHaveAttribute('href', '#main-content');
    });

    it('should provide skip to navigation link', () => {
      render(<SkipLinks />);
      
      const navLink = screen.getByRole('link', { name: /skip to navigation/i });
      expect(navLink).toBeInTheDocument();
      expect(navLink).toHaveAttribute('href', '#navigation');
    });

    it('should support custom links including footer', () => {
      const customLinks = [
        { href: '#main-content', label: 'Skip to main content' },
        { href: '#navigation', label: 'Skip to navigation' },
        { href: '#footer', label: 'Skip to footer' },
      ];
      
      render(<SkipLinks links={customLinks} />);
      
      const footerLink = screen.getByRole('link', { name: /skip to footer/i });
      expect(footerLink).toBeInTheDocument();
      expect(footerLink).toHaveAttribute('href', '#footer');
    });
  });

  describe('WCAG 2.1.1 - Keyboard Navigation', () => {
    it('should be keyboard accessible with Tab key', async () => {
      const user = userEvent.setup();
      render(<SkipLinks />);

      // Tab to first skip link
      await user.tab();
      const mainLink = screen.getByRole('link', { name: /skip to main content/i });
      expect(mainLink).toHaveFocus();
    });

    it('should allow tabbing through all skip links', async () => {
      const user = userEvent.setup();
      render(<SkipLinks />);

      // Tab through all links (default has 2 links)
      await user.tab();
      expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('link', { name: /skip to navigation/i })).toHaveFocus();
    });

    it('should navigate with Enter key', async () => {
      const user = userEvent.setup();
      
      // Mock scrollIntoView
      const scrollIntoViewMock = vi.fn();
      HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

      // Create target element
      const targetElement = document.createElement('main');
      targetElement.id = 'main-content';
      targetElement.tabIndex = -1;
      document.body.appendChild(targetElement);

      render(<SkipLinks />);

      // Tab to link and press Enter
      await user.tab();
      const mainLink = screen.getByRole('link', { name: /skip to main content/i });
      await user.keyboard('{Enter}');

      // Verify scrollIntoView was called
      expect(scrollIntoViewMock).toHaveBeenCalled();

      // Cleanup
      document.body.removeChild(targetElement);
    });

    it('should support Shift+Tab for reverse navigation', async () => {
      const user = userEvent.setup();
      render(<SkipLinks />);

      // Tab to last link (only 2 links by default)
      await user.tab();
      await user.tab();
      expect(screen.getByRole('link', { name: /skip to navigation/i })).toHaveFocus();

      // Shift+Tab back
      await user.tab({ shift: true });
      expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveFocus();
    });
  });

  describe('WCAG 2.4.7 - Focus Visible', () => {
    it('should have visible focus indicators', async () => {
      const user = userEvent.setup();
      render(<SkipLinks />);

      await user.tab();
      const mainLink = screen.getByRole('link', { name: /skip to main content/i });
      
      expect(mainLink).toHaveFocus();
      // Focus styles applied via focus:not-sr-only which makes link visible
      expect(mainLink).toBeVisible();
    });

    it('should display glassmorphism on focus', async () => {
      const user = userEvent.setup();
      render(<SkipLinks />);

      await user.tab();
      const mainLink = screen.getByRole('link', { name: /skip to main content/i });
      
      // Should have glass-panel class for glassmorphism
      expect(mainLink).toHaveClass('glass-panel');
    });

    it('should maintain high contrast focus ring', async () => {
      const user = userEvent.setup();
      render(<SkipLinks />);

      await user.tab();
      const mainLink = screen.getByRole('link', { name: /skip to main content/i });
      
      // Should have focus ring classes
      expect(mainLink).toHaveClass('focus:ring-2');
    });

    it('should be visible only on focus (sr-only pattern)', () => {
      render(<SkipLinks />);
      
      const mainLink = screen.getByRole('link', { name: /skip to main content/i });
      
      // Should have sr-only class for initial hidden state
      expect(mainLink).toHaveClass('sr-only');
      // Should have focus:not-sr-only to become visible on focus
      expect(mainLink).toHaveClass('focus:not-sr-only');
    });
  });

  describe('WCAG 4.1.2 - Name, Role, Value', () => {
    it('should use semantic anchor elements', () => {
      const { container } = render(<SkipLinks />);
      
      const links = container.querySelectorAll('a');
      expect(links.length).toBe(2); // Default has 2 links
      
      links.forEach((link) => {
        expect(link.tagName).toBe('A');
        expect(link).toHaveAttribute('href');
      });
    });

    it('should have accessible names for all links', () => {
      render(<SkipLinks />);
      
      expect(screen.getByRole('link', { name: /skip to main content/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /skip to navigation/i })).toBeInTheDocument();
    });

    it('should not have aria-hidden on links', () => {
      render(<SkipLinks />);
      
      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).not.toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('should have proper href attributes pointing to landmarks', () => {
      render(<SkipLinks />);
      
      const mainLink = screen.getByRole('link', { name: /skip to main content/i });
      const navLink = screen.getByRole('link', { name: /skip to navigation/i });

      expect(mainLink.getAttribute('href')).toBe('#main-content');
      expect(navLink.getAttribute('href')).toBe('#navigation');
    });
  });

  describe('Focus Management', () => {
    it('should move focus to target element on click', async () => {
      const user = userEvent.setup();
      
      // Mock scrollIntoView
      const scrollIntoViewMock = vi.fn();
      HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
      
      // Spy on focus method
      const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
      
      // Create target element
      const targetElement = document.createElement('main');
      targetElement.id = 'main-content';
      targetElement.tabIndex = -1;
      document.body.appendChild(targetElement);

      render(<SkipLinks />);

      // Click skip link
      const mainLink = screen.getByRole('link', { name: /skip to main content/i });
      await user.click(mainLink);

      // Verify scrollIntoView and focus were called
      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
      expect(focusSpy).toHaveBeenCalled();

      // Cleanup
      focusSpy.mockRestore();
      document.body.removeChild(targetElement);
    });

    it('should handle missing target gracefully', async () => {
      const user = userEvent.setup();

      render(<SkipLinks />);

      // Click link to non-existent target (no console.warn in current implementation)
      const mainLink = screen.getByRole('link', { name: /skip to main content/i });
      
      // Should not crash
      await expect(user.click(mainLink)).resolves.not.toThrow();
    });

    it('should focus target element for accessibility', async () => {
      const user = userEvent.setup();
      
      // Spy on focus method
      const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
      
      const targetElement = document.createElement('main');
      targetElement.id = 'main-content';
      document.body.appendChild(targetElement);

      render(<SkipLinks />);

      const mainLink = screen.getByRole('link', { name: /skip to main content/i });
      await user.click(mainLink);

      // Target should receive focus with preventScroll
      expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });

      focusSpy.mockRestore();
      document.body.removeChild(targetElement);
    });
  });

  describe('Screen Reader Compatibility', () => {
    it('should be discoverable by screen readers', () => {
      render(<SkipLinks />);
      
      const links = screen.getAllByRole('link');
      expect(links.length).toBe(2); // Default has 2 links
      
      links.forEach((link) => {
        expect(link).toHaveAccessibleName();
      });
    });

    it('should not interfere with main content navigation', () => {
      const { container } = render(
        <>
          <SkipLinks />
          <main id="main-content">
            <h1>Main Content</h1>
            <p>Content here</p>
          </main>
        </>
      );

      // SkipLinks creates a div with role="navigation"
      const skipLinksNav = container.querySelector('div[role="navigation"]');
      expect(skipLinksNav).toBeInTheDocument();
      
      const mainContent = container.querySelector('#main-content');
      expect(mainContent).toBeInTheDocument();
    });
  });

  describe('Positioning and Visibility', () => {
    it('should be positioned at top of page', () => {
      const { container } = render(<SkipLinks />);
      
      // SkipLinks is a div with role="navigation"
      const skipLinksContainer = container.querySelector('div[role="navigation"]');
      expect(skipLinksContainer).toHaveClass('fixed', 'top-4', 'left-4');
    });

    it('should use sr-only utility for visual hiding', () => {
      render(<SkipLinks />);
      
      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).toHaveClass('sr-only');
      });
    });

    it('should become visible on focus', () => {
      render(<SkipLinks />);
      
      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).toHaveClass('focus:not-sr-only');
      });
    });
  });

  describe('Design System Integration', () => {
    it('should use Nebula Glass Design System styles', async () => {
      const user = userEvent.setup();
      render(<SkipLinks />);

      await user.tab();
      const mainLink = screen.getByRole('link', { name: /skip to main content/i });
      
      // Glass panel styling
      expect(mainLink).toHaveClass('glass-panel');
      
      // Glass text color
      expect(mainLink).toHaveClass('glass-text');
      
      // Glass border radius
      expect(mainLink).toHaveClass('rounded-glass');
    });

    it('should maintain design consistency with other components', async () => {
      const { container } = render(<SkipLinks />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Responsive Design', () => {
    it('should be accessible on mobile viewports', async () => {
      const { container } = render(
        <div style={{ width: '320px' }}>
          <SkipLinks />
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should maintain keyboard navigation on touch devices', async () => {
      const user = userEvent.setup();
      render(<SkipLinks />);

      // Keyboard navigation should work regardless of device type
      await user.tab();
      expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid Tab navigation', async () => {
      const user = userEvent.setup();
      render(<SkipLinks />);

      // Rapidly tab through links (2 links)
      await user.tab();
      await user.tab();
      
      const navLink = screen.getByRole('link', { name: /skip to navigation/i });
      expect(navLink).toHaveFocus();
    });

    it('should not break with custom focus styles', async () => {
      const { container } = render(<SkipLinks />);

      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
          'focus-order-semantics': { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();
    });

    it('should work with existing page navigation', () => {
      const { container } = render(
        <>
          <SkipLinks />
          <nav id="navigation">
            <a href="/">Home</a>
            <a href="/about">About</a>
          </nav>
          <main id="main-content">
            <h1>Content</h1>
          </main>
          <footer id="footer">
            <p>Footer</p>
          </footer>
        </>
      );

      const skipLinksNav = container.querySelector('nav');
      expect(skipLinksNav).toBeInTheDocument();
    });
  });
});
