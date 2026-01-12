// Design System - UmrahConnect 2.0
// Professional color palette, typography, and spacing standards

export const colors = {
  // Primary Brand Colors
  primary: {
    main: '#0d7c66',      // Teal Green (Trust, Islamic)
    light: '#41b8a5',     // Light Teal
    dark: '#095a4d',      // Dark Teal
    50: '#f0fdf9',
    100: '#ccfbef',
    200: '#99f6e0',
    300: '#5fe9d0',
    400: '#2dd4bf',
    500: '#0d7c66',
    600: '#0a6b58',
    700: '#085a4a',
    800: '#06493c',
    900: '#04382e',
  },

  // Secondary/Accent Colors
  secondary: {
    main: '#d4af37',      // Gold (Premium, Luxury)
    light: '#f4d03f',     // Light Gold
    dark: '#c19b2b',      // Dark Gold
  },

  // Semantic Colors
  success: '#10b981',     // Green
  warning: '#f59e0b',     // Orange
  error: '#ef4444',       // Red
  info: '#3b82f6',        // Blue

  // Neutral Colors
  neutral: {
    white: '#ffffff',
    black: '#000000',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Background Colors
  background: {
    default: '#f8f9fa',
    paper: '#ffffff',
    dark: '#1a1a1a',
  },

  // Text Colors
  text: {
    primary: '#333333',
    secondary: '#666666',
    disabled: '#999999',
    hint: '#cccccc',
  },
};

export const typography = {
  // Font Families
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    secondary: "'Poppins', sans-serif",
    mono: "'Fira Code', 'Courier New', monospace",
  },

  // Font Sizes
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },

  // Font Weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
};

export const spacing = {
  // Spacing Scale (in rem)
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
};

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  base: '0.5rem',   // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  full: '9999px',
};

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

export const transitions = {
  fast: '150ms ease-in-out',
  base: '300ms ease-in-out',
  slow: '500ms ease-in-out',
};

// Component-specific styles
export const components = {
  button: {
    primary: {
      background: colors.primary.main,
      color: colors.neutral.white,
      hover: colors.primary.dark,
      shadow: shadows.md,
    },
    secondary: {
      background: colors.secondary.main,
      color: colors.neutral.white,
      hover: colors.secondary.dark,
      shadow: shadows.md,
    },
    outline: {
      background: 'transparent',
      color: colors.primary.main,
      border: `2px solid ${colors.primary.main}`,
      hover: colors.primary.main,
    },
  },

  card: {
    background: colors.background.paper,
    border: `1px solid ${colors.neutral.200}`,
    borderRadius: borderRadius.lg,
    shadow: shadows.base,
    hoverShadow: shadows.xl,
  },

  input: {
    background: colors.background.paper,
    border: `2px solid ${colors.neutral.200}`,
    borderRadius: borderRadius.base,
    focusBorder: colors.primary.main,
    errorBorder: colors.error,
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  zIndex,
  transitions,
  components,
};
