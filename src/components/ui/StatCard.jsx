import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { AppCard } from './AppCard';
import { StatusBadge } from './StatusBadge';

const TONE_ICON_COLORS = {
  primary: { bg: colors.primarySoft, fg: colors.primary },
  success: { bg: colors.successSoft, fg: colors.successAccent },
  danger: { bg: colors.dangerSoft, fg: colors.dangerAccent },
  info: { bg: colors.infoSoft, fg: colors.info },
  warning: { bg: colors.warningSoft, fg: colors.warningDark },
};

/**
 * KPI / Stats summary card matching DailySalesKpis, StoreStatsHeader, and UserStatsHeader.
 */
export function StatCard({
  title,
  value,
  subtitle,
  icon,
  tone = 'primary',
  chipLabel,
  progressPercent,
  valueColor,
  style,
}) {
  const iconPalette = TONE_ICON_COLORS[tone] || TONE_ICON_COLORS.primary;

  return (
    <AppCard style={[styles.card, style]}>
      <View style={styles.topRow}>
        {icon ? (
          <View style={[styles.iconBox, { backgroundColor: iconPalette.bg }]}>
            <Ionicons name={icon} size={18} color={iconPalette.fg} />
          </View>
        ) : (
          <Text style={styles.titleCompact}>{title}</Text>
        )}

        {chipLabel ? <StatusBadge label={chipLabel} tone={tone} /> : null}
      </View>

      <Text style={[styles.value, valueColor ? { color: valueColor } : null]} numberOfLines={1}>
        {value}
      </Text>

      {typeof progressPercent === 'number' ? (
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(100, Math.max(0, progressPercent))}%`,
                backgroundColor: iconPalette.fg,
              },
            ]}
          />
        </View>
      ) : null}

      {icon ? (
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      ) : null}

      {subtitle ? (
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.sm,
    borderRadius: radii.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  title: {
    marginTop: spacing.xxs,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  titleCompact: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 11,
    color: colors.textMuted,
  },
  progressTrack: {
    height: 4,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceMuted,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radii.full,
  },
});
