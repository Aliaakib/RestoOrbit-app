import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme/colors';
import { radii, shadows, spacing } from '@/theme/spacing';

/**
 * Elevated surface card matching iOS shadow and Android elevation tokens.
 */
export function AppCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
});
