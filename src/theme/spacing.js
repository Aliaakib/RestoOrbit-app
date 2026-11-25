import { Platform } from 'react-native';

/**
 * 4pt spacing scale, radii, and subtle Theme8-matched card borders/elevations.
 */
export const spacing = Object.freeze({
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
});

export const radii = Object.freeze({
  xs: 6,
  sm: 8,
  md: 10,
  lg: 14,
  full: 9999,
});

export const shadows = Object.freeze({
  card: Platform.select({
    ios: {
      shadowColor: '#131920',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    },
    android: {
      elevation: 1,
    },
    default: {},
  }),
});
