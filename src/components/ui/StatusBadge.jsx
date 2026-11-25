import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

const TONE_MAP = {
  primary: { bg: colors.primarySoft, fg: colors.primaryDark },
  success: { bg: colors.successSoft, fg: colors.successAccent },
  warning: { bg: colors.warningSoft, fg: colors.warningDark },
  danger: { bg: colors.dangerSoft, fg: colors.dangerAccent },
  info: { bg: colors.infoSoft, fg: colors.info },
  neutral: { bg: colors.surfaceMuted, fg: colors.textSecondary },
};

/**
 * Semantic status/role chip matching RestoOrbit's combined variant pills.
 */
export function StatusBadge({ label, tone = 'neutral', style }) {
  const palette = TONE_MAP[tone] || TONE_MAP.neutral;

  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }, style]}>
      <Text style={[styles.label, { color: palette.fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
});
