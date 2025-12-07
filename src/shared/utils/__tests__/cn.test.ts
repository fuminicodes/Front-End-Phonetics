import { describe, it, expect } from 'vitest';
import { cn } from '../cn';

/**
 * Unit Tests for cn (classNames) Utility
 * 
 * Tests cover:
 * - Basic class merging
 * - Tailwind class conflicts resolution
 * - Conditional classes
 * - Edge cases
 */
describe('cn utility', () => {
  describe('Basic Functionality', () => {
    it('should merge simple class names', () => {
      // Act
      const result = cn('text-red-500', 'bg-blue-500');

      // Assert
      expect(result).toBe('text-red-500 bg-blue-500');
    });

    it('should handle single class name', () => {
      // Act
      const result = cn('text-center');

      // Assert
      expect(result).toBe('text-center');
    });

    it('should handle empty input', () => {
      // Act
      const result = cn();

      // Assert
      expect(result).toBe('');
    });

    it('should handle undefined and null values', () => {
      // Act
      const result = cn('text-red-500', undefined, 'bg-blue-500', null);

      // Assert
      expect(result).toBe('text-red-500 bg-blue-500');
    });

    it('should handle false and empty string values', () => {
      // Act
      const result = cn('text-red-500', false, '', 'bg-blue-500');

      // Assert
      expect(result).toBe('text-red-500 bg-blue-500');
    });
  });

  describe('Tailwind Conflicts Resolution', () => {
    it('should resolve conflicting text colors (last wins)', () => {
      // Act
      const result = cn('text-red-500', 'text-blue-500');

      // Assert
      expect(result).toBe('text-blue-500');
    });

    it('should resolve conflicting background colors', () => {
      // Act
      const result = cn('bg-red-500', 'bg-green-500', 'bg-blue-500');

      // Assert
      expect(result).toBe('bg-blue-500');
    });

    it('should resolve conflicting padding', () => {
      // Act
      const result = cn('p-4', 'p-8');

      // Assert
      expect(result).toBe('p-8');
    });

    it('should resolve conflicting margins', () => {
      // Act
      const result = cn('m-2', 'm-4', 'm-6');

      // Assert
      expect(result).toBe('m-6');
    });

    it('should keep non-conflicting classes', () => {
      // Act
      const result = cn('text-red-500', 'bg-blue-500', 'p-4', 'rounded-lg');

      // Assert
      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-500');
      expect(result).toContain('p-4');
      expect(result).toContain('rounded-lg');
    });

    it('should resolve specific padding over general padding', () => {
      // Act
      const result = cn('p-4', 'px-8');

      // Assert
      expect(result).toContain('px-8');
      // p-4 should be kept for py (vertical padding)
    });
  });

  describe('Conditional Classes', () => {
    it('should handle conditional classes with boolean', () => {
      // Arrange
      const isActive = true;
      const isDisabled = false;

      // Act
      const result = cn(
        'base-class',
        isActive && 'active-class',
        isDisabled && 'disabled-class'
      );

      // Assert
      expect(result).toContain('base-class');
      expect(result).toContain('active-class');
      expect(result).not.toContain('disabled-class');
    });

    it('should handle object-based conditional classes', () => {
      // Act
      const result = cn({
        'text-red-500': true,
        'bg-blue-500': false,
        'p-4': true,
      });

      // Assert
      expect(result).toContain('text-red-500');
      expect(result).not.toContain('bg-blue-500');
      expect(result).toContain('p-4');
    });

    it('should handle array of conditional classes', () => {
      // Act
      const result = cn([
        'base-class',
        true && 'conditional-class',
        false && 'hidden-class',
      ]);

      // Assert
      expect(result).toContain('base-class');
      expect(result).toContain('conditional-class');
      expect(result).not.toContain('hidden-class');
    });
  });

  describe('Real-world Component Scenarios', () => {
    it('should handle button variant classes', () => {
      // Arrange
      const variant = 'primary' as 'primary' | 'secondary';
      const size = 'lg' as 'sm' | 'lg';

      // Act
      const result = cn(
        'rounded-lg font-semibold transition-colors',
        variant === 'primary' && 'bg-blue-500 text-white hover:bg-blue-600',
        variant === 'secondary' && 'bg-gray-500 text-white hover:bg-gray-600',
        size === 'sm' && 'px-3 py-1 text-sm',
        size === 'lg' && 'px-6 py-3 text-lg'
      );

      // Assert
      expect(result).toContain('rounded-lg');
      expect(result).toContain('bg-blue-500');
      expect(result).toContain('px-6');
      expect(result).toContain('py-3');
      expect(result).not.toContain('bg-gray-500');
      expect(result).not.toContain('px-3');
    });

    it('should handle input state classes', () => {
      // Arrange
      const hasError = true;
      const isFocused = false;
      const isDisabled = false;

      // Act
      const result = cn(
        'w-full border rounded-md px-3 py-2',
        hasError && 'border-red-500 focus:ring-red-500',
        !hasError && 'border-gray-300 focus:ring-blue-500',
        isFocused && 'ring-2',
        isDisabled && 'bg-gray-100 cursor-not-allowed'
      );

      // Assert
      expect(result).toContain('border-red-500');
      expect(result).toContain('focus:ring-red-500');
      expect(result).not.toContain('border-gray-300');
      expect(result).not.toContain('ring-2');
      expect(result).not.toContain('cursor-not-allowed');
    });

    it('should handle card component with multiple states', () => {
      // Arrange
      const isSelected = true;
      const isHovered = false;
      const hasContent = true;

      // Act
      const result = cn(
        'rounded-lg shadow-md transition-all',
        'bg-white',
        isSelected && 'ring-2 ring-blue-500',
        isHovered && 'shadow-lg',
        hasContent ? 'p-6' : 'p-4'
      );

      // Assert
      expect(result).toContain('rounded-lg');
      expect(result).toContain('ring-2');
      expect(result).toContain('ring-blue-500');
      expect(result).toContain('p-6');
      expect(result).not.toContain('p-4');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long class strings', () => {
      // Act
      const result = cn(
        'text-center',
        'flex',
        'items-center',
        'justify-center',
        'bg-gradient-to-r',
        'from-blue-500',
        'to-purple-500',
        'hover:from-blue-600',
        'hover:to-purple-600',
        'rounded-full',
        'shadow-2xl',
        'transition-all',
        'duration-300'
      );

      // Assert
      expect(result).toContain('text-center');
      expect(result).toContain('shadow-2xl');
      expect(result).toContain('duration-300');
    });

    it('should handle duplicate classes', () => {
      // Act
      const result = cn('text-red-500', 'text-red-500', 'text-red-500');

      // Assert
      expect(result).toBe('text-red-500');
    });

    it('should handle responsive classes', () => {
      // Act
      const result = cn('text-sm', 'md:text-base', 'lg:text-lg', 'xl:text-xl');

      // Assert
      expect(result).toContain('text-sm');
      expect(result).toContain('md:text-base');
      expect(result).toContain('lg:text-lg');
      expect(result).toContain('xl:text-xl');
    });

    it('should handle pseudo-classes', () => {
      // Act
      const result = cn(
        'hover:bg-blue-500',
        'focus:ring-2',
        'active:scale-95',
        'disabled:opacity-50'
      );

      // Assert
      expect(result).toContain('hover:bg-blue-500');
      expect(result).toContain('focus:ring-2');
      expect(result).toContain('active:scale-95');
      expect(result).toContain('disabled:opacity-50');
    });

    it('should handle dark mode classes', () => {
      // Act
      const result = cn(
        'bg-white',
        'dark:bg-gray-800',
        'text-gray-900',
        'dark:text-white'
      );

      // Assert
      expect(result).toContain('bg-white');
      expect(result).toContain('dark:bg-gray-800');
      expect(result).toContain('text-gray-900');
      expect(result).toContain('dark:text-white');
    });

    it('should handle arbitrary values', () => {
      // Act
      const result = cn('bg-[#1da1f2]', 'text-[14px]', 'w-[calc(100%-2rem)]');

      // Assert
      expect(result).toContain('bg-[#1da1f2]');
      expect(result).toContain('text-[14px]');
      expect(result).toContain('w-[calc(100%-2rem)]');
    });
  });

  describe('Performance', () => {
    it('should handle many classes efficiently', () => {
      // Arrange
      const classes = Array.from({ length: 100 }, (_, i) => `class-${i}`);

      // Act
      const start = performance.now();
      const result = cn(...classes);
      const duration = performance.now() - start;

      // Assert
      expect(result).toBeTruthy();
      expect(duration).toBeLessThan(10); // Should be very fast
    });

    it('should handle repeated calls efficiently', () => {
      // Act
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        cn('text-red-500', 'bg-blue-500', i % 2 === 0 && 'p-4');
      }
      const duration = performance.now() - start;

      // Assert
      expect(duration).toBeLessThan(100); // 1000 calls in less than 100ms
    });
  });
});
