export const corporateDarkTheme = {
  colors: {
    background: '#000000',
    backgroundAlt: '#111111',
    backgroundCard: '#1A1A1A',
    textPrimary: '#FFFFFF',
    textSecondary: '#AAAAAA',
    textTertiary: '#666666',
    accent: '#00D54B', // subtle green accent (optional, use sparingly)
    border: '#333333',
    cardBg: '#1A1A1A',
    cardHover: '#252525',
    ctaBg: '#FFFFFF',
    ctaText: '#000000',
    ctaHover: '#E0E0E0',
    headerBg: 'rgba(0, 0, 0, 0.9)',
    footerBg: '#0A0A0A',
  },
  typography: {
    fontFamily:
      "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    heading: {
      xl: {
        fontSize: '56px',
        fontWeight: '700',
        lineHeight: '1.1',
        letterSpacing: '0.02em',
        textTransform: 'uppercase' as const,
      },
      lg: {
        fontSize: '40px',
        fontWeight: '700',
        lineHeight: '1.2',
        letterSpacing: '0.01em',
        textTransform: 'uppercase' as const,
      },
      md: {
        fontSize: '28px',
        fontWeight: '600',
        lineHeight: '1.3',
        letterSpacing: '0.01em',
      },
      sm: {
        fontSize: '20px',
        fontWeight: '600',
        lineHeight: '1.4',
        letterSpacing: '0.005em',
      },
    },
    body: {
      lg: {
        fontSize: '16px',
        fontWeight: '300',
        lineHeight: '1.8',
        letterSpacing: '0.01em',
      },
      md: {
        fontSize: '14px',
        fontWeight: '300',
        lineHeight: '1.7',
        letterSpacing: '0.01em',
      },
      sm: {
        fontSize: '12px',
        fontWeight: '400',
        lineHeight: '1.5',
      },
    },
  },
  spacing: {
    sectionGap: '120px',
    containerMaxWidth: '1280px',
    containerPadding: '32px',
    cardGap: '24px',
    cardPadding: '32px',
    cardRadius: '0px', // Krafton uses sharp corners
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1280px',
  },
} as const;

export type CorporateDarkTheme = typeof corporateDarkTheme;
