/**
 * Theme Configuration
 * LOCKED - Do not modify without updating GLOBAL CONDITIONS
 * 
 * This file contains the locked design system for Ice Crumble POS
 * All colors and fonts must remain consistent across the application
 */

export const theme = {
  // Locked color palette - Summer-Autumn theme (4 colors only)
  colors: {
    primary: '#FF6B6B',      // Warm Coral - Main actions, buttons
    secondary: '#FFB347',    // Golden Amber - Secondary actions, highlights
    accent: '#C1785A',       // Soft Terracotta - Accents, borders
    background: '#FFF8F0',   // Creamy Ivory - Page background
    
    // Utility colors (allowed for text contrast only)
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      light: '#F5F5F5',
      medium: '#9CA3AF',
      dark: '#374151'
    }
  },
  
  // Locked font family - Verdana everywhere
  fonts: {
    primary: 'Verdana, Geneva, sans-serif'
  },
  
  // Spacing scale (mobile-first)
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    xxl: '3rem'      // 48px
  },
  
  // Border radius
  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem'       // 16px
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  }
};

export default theme;