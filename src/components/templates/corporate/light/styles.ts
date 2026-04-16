export const corporateLightTheme = {
  colors: {
    background: '#FFFFFF',
    backgroundAlt: '#F9F9F9',
    textPrimary: '#191919',
    textSecondary: '#666666',
    textTertiary: '#999999',
    accent: '#FEE500', // Kakao yellow - use sparingly as point color
    border: '#E5E5E5',
    cardBg: '#FFFFFF',
    cardHover: '#F5F5F5',
    ctaBg: '#191919',
    ctaText: '#FFFFFF',
    ctaHover: '#333333',
    headerBg: '#FFFFFF',
    footerBg: '#F2F2F2',
  },
  typography: {
    fontFamily:
      "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    heading: {
      xl: {
        fontSize: '40px',
        fontWeight: '700',
        lineHeight: '1.2',
        letterSpacing: '-0.02em',
      },
      lg: {
        fontSize: '32px',
        fontWeight: '700',
        lineHeight: '1.3',
        letterSpacing: '-0.01em',
      },
      md: {
        fontSize: '24px',
        fontWeight: '600',
        lineHeight: '1.4',
      },
      sm: {
        fontSize: '18px',
        fontWeight: '600',
        lineHeight: '1.5',
      },
    },
    body: {
      lg: {
        fontSize: '16px',
        fontWeight: '400',
        lineHeight: '1.7',
      },
      md: {
        fontSize: '14px',
        fontWeight: '400',
        lineHeight: '1.6',
      },
      sm: {
        fontSize: '12px',
        fontWeight: '400',
        lineHeight: '1.5',
      },
    },
  },
  spacing: {
    sectionGap: '80px',
    containerMaxWidth: '1200px',
    containerPadding: '24px',
    cardGap: '24px',
    cardPadding: '32px',
    cardRadius: '12px',
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px',
  },
} as const;

export type CorporateLightTheme = typeof corporateLightTheme;
