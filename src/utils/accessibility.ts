import { useEffect, useState } from 'react';

/**
 * Hook to detect if user prefers reduced motion
 * Use this to disable/simplify animations for accessibility
 */
export const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

/**
 * Utility class names for consistent focus rings
 * Use these classes for keyboard focus indicators
 */
export const focusRingClasses = {
  default: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  primary: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  destructive: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2',
  none: 'focus-visible:outline-none',
} as const;

/**
 * Trap focus within a container (for modals, menus)
 * @param containerRef - Ref to the container element
 * @param isActive - Whether focus trap is active
 */
export const useFocusTrap = (
  containerRef: React.RefObject<HTMLElement>,
  isActive: boolean
) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTab);
    firstElement.focus();

    return () => container.removeEventListener('keydown', handleTab);
  }, [containerRef, isActive]);
};

/**
 * Announce text to screen readers
 * @param message - Message to announce
 * @param priority - 'polite' or 'assertive'
 */
export const announceToScreenReader = (
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
};

/**
 * Usage Examples:
 * 
 * // Detect reduced motion preference
 * const prefersReducedMotion = usePrefersReducedMotion();
 * const animation = prefersReducedMotion ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 } };
 * 
 * // Apply focus ring
 * import { focusRingClasses } from '@/utils/accessibility';
 * <button className={focusRingClasses.primary}>Button</button>
 * 
 * // Announce to screen reader
 * announceToScreenReader('Item added to cart', 'polite');
 */
