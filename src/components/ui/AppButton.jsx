import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

const VARIANT_STYLES = {
  primary: {
    container: { backgroundColor: colors.primary, borderColor: colors.primary },
    label: { color: colors.textInverse },
    spinner: colors.textInverse,
  },
  secondary: {
    container: { backgroundColor: colors.secondary, borderColor: colors.secondary },
    label: { color: colors.textInverse },
    spinner: colors.textInverse,
  },
  outline: {
    container: { backgroundColor: 'transparent', borderColor: colors.border },
    label: { color: colors.textPrimary },
    spinner: colors.primary,
  },
  danger: {
    container: { backgroundColor: colors.danger, borderColor: colors.danger },
    label: { color: colors.textInverse },
    spinner: colors.textInverse,
  },
};

/**
 * Accessible, multi-variant button with built-in loading and disabled states.
 */
export function AppButton({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}) {
  const palette = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        palette.container,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={palette.spinner} />
      ) : (
        <Text style={[styles.label, palette.label]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.55,
  },
});
