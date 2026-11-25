import { DefaultTheme } from '@react-navigation/native';
import { colors } from './colors';
import { radii, shadows, spacing } from './spacing';
import { typography } from './typography';

export const theme = Object.freeze({
  colors,
  spacing,
  radii,
  shadows,
  typography,
});

/**
 * React Navigation theme synchronized with app design tokens.
 */
export const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    notification: colors.danger,
  },
};
