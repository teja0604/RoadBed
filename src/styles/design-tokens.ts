/**
 * Design Tokens - Single Source of Truth
 * Import these tokens into tailwind.config.ts
 */

export const colors = {
  primary: '221.2 83.2 53.3', // #1266F1 - Deep azure
  'primary-glow': '221.2 83.2 63.3', // Lighter primary
  accent: '14 100 60', // #FF6B35 - Vibrant coral
  secondary: '222.2 47.4 11.2', // #0F172A - Charcoal
  surface: '0 0 100', // #FFFFFF - White
  'muted-text': '220 8.9 46.1', // #6B7280 - Gray
  success: '142.1 76.2 36.3', // #10B981 - Green
  error: '0 84.2 60.2', // #EF4444 - Red
  'soft-bg': '210 40 98', // #F8FAFC - Soft background
} as const;

export const fontSizes = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  base: '1rem', // 16px
  lg: '1.125rem', // 18px
  xl: '1.25rem', // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '2rem', // 32px
  '4xl': '2.5rem', // 40px
  '5xl': '3.5rem', // 56px
} as const;

export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
  '4xl': '6rem', // 96px
} as const;

export const borderRadius = {
  sm: '0.25rem', // 4px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const;

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

/**
 * Usage Examples:
 * 
 * In Tailwind classes:
 * - text-primary (uses primary color from design tokens)
 * - bg-accent (uses accent color)
 * - text-2xl (uses 2xl font size)
 * - rounded-2xl (uses 2xl border radius)
 * 
 * In components:
 * import { colors, fontSizes } from '@/styles/design-tokens';
 * <div style={{ color: `hsl(${colors.primary})` }}>Text</div>
 */
