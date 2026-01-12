// Design System - UmrahConnect 2.0 (Based on Professional Design)
// Dark theme with green gradient and gold accents

export const colors = {
  // Primary Brand Colors (Green)
  primary: {
    main: '#0f6b3f',
    light: '#14532d',
    dark: '#0a4d2c',
    gradient: 'linear-gradient(135deg, #0f6b3f 0%, #14532d 100%)',
  },

  // Secondary/Accent Colors (Gold)
  secondary: {
    main: '#d4af37',
    light: '#f4d03f',
    dark: '#b8942c',
    gradient: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%)',
  },

  // Background Colors (Dark Theme)
  background: {
    primary: '#0b0b0b',
    secondary: '#0f1a14',
    gradient: 'linear-gradient(180deg, #0b0b0b 0%, #0f1a14 50%, #0b0b0b 100%)',
  },

  // Glass Morphism
  glass: {
    card: 'rgba(255, 255, 255, 0.03)',
    cardLight: 'rgba(255, 255, 255, 0.95)',
    border: 'rgba(255, 255, 255, 0.08)',
  },

  // Text Colors
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.9)',
    muted: 'rgba(255, 255, 255, 0.6)',
    dark: '#0b0b0b',
  },

  // Semantic Colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

export const typography = {
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    arabic: "'Amiri', serif",
  },

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
    '7xl': '4.5rem',    // 72px
  },

  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
};

export const spacing = {
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
  sm: '0.5rem',     // 8px
  base: '0.75rem',  // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  '3xl': '3rem',    // 48px
  full: '9999px',
};

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  glow: '0 0 40px rgba(15, 107, 63, 0.3)',
  glowPulse: '0 0 20px rgba(15, 107, 63, 0.3)',
};

export const animations = {
  float: {
    keyframes: `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
    `,
    animation: 'float 6s ease-in-out infinite',
  },
  pulseGlow: {
    keyframes: `
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(15, 107, 63, 0.3); }
        50% { box-shadow: 0 0 40px rgba(15, 107, 63, 0.5); }
      }
    `,
    animation: 'pulse-glow 3s ease-in-out infinite',
  },
  fadeIn: {
    keyframes: `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `,
    animation: 'fadeIn 0.5s ease-in-out',
  },
  slideUp: {
    keyframes: `
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
    animation: 'slideUp 0.5s ease-out',
  },
};

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  breakpoints,
};
