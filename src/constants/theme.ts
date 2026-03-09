import { MD3LightTheme } from 'react-native-paper';

export const colors = {
  primary: '#1E3A8A',
  secondary: '#3B82F6',
  accent: '#FBBF24',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  
  border: '#E5E7EB',
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    tertiary: colors.accent,
    surface: colors.surface,
    background: colors.background,
    error: colors.error,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};
