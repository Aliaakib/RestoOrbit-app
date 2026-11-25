import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { AppCard } from '@/components/ui/AppCard';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

/**
 * Clean mobile module preview screen mirroring ModulePlaceholderView.jsx.
 */
export function ModulePreviewScreen({ route }) {
  const moduleInfo = route.params?.moduleInfo || {
    title: 'Operational Module',
    description: 'This RestoOrbit module is enabled in your store permissions.',
    category: 'Operations',
    icon: 'cube-outline',
  };

  return (
    <ScreenContainer scrollable edges={['left', 'right', 'bottom']}>
      <AppCard style={styles.card}>
        <View style={styles.iconWrap}>
          <Ionicons name={moduleInfo.icon || 'cube-outline'} size={32} color={colors.primary} />
        </View>
        <StatusBadge label={moduleInfo.category} tone="primary" style={styles.badge} />
        <Text style={styles.title}>{moduleInfo.title}</Text>
        <Text style={styles.description}>{moduleInfo.description}</Text>
        <Text style={styles.hint}>
          Ready for API wiring via src/services/api/. All role and module permission keys stay
          synchronized with resto-orbit-frontend.
        </Text>
      </AppCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radii.lg,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  badge: {
    alignSelf: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    marginTop: spacing.xs,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  hint: {
    marginTop: spacing.md,
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
