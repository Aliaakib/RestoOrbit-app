import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppCard } from '@/components/ui/AppCard';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { OPERATIONAL_MODULES } from '@/config/modules';
import { APP_ROUTES } from '@/navigation/routes';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

/**
 * Operations Launcher Hub mirroring the permission-driven navigation modules
 * from resto-orbit-frontend/src/core/navigation/menu.js.
 */
export function OperationsHubScreen({ navigation }) {
  function handleOpenModule(mod) {
    if (mod.routeTarget === APP_ROUTES.MODULE_PREVIEW) {
      navigation.navigate(APP_ROUTES.MODULE_PREVIEW, { moduleInfo: mod });
      return;
    }

    navigation.navigate(mod.routeTarget);
  }

  return (
    <ScreenContainer scrollable edges={['left', 'right']}>
      <Text style={styles.subtitle}>
        Access RestoOrbit operational modules tailored for mobile shift supervision, cashiering,
        POS, and kitchen display workflows.
      </Text>

      <View style={styles.grid}>
        {OPERATIONAL_MODULES.map((mod) => (
          <Pressable
            key={mod.key}
            accessibilityRole="button"
            onPress={() => handleOpenModule(mod)}
            style={({ pressed }) => [styles.cardWrap, pressed && styles.pressed]}
          >
            <AppCard style={styles.moduleCard}>
              <View style={styles.topRow}>
                <View style={styles.iconBox}>
                  <Ionicons name={mod.icon} size={22} color={colors.primary} />
                </View>
                <StatusBadge
                  label={mod.implemented ? mod.category : 'Roadmap'}
                  tone={mod.implemented ? 'primary' : 'neutral'}
                />
              </View>

              <Text style={styles.moduleTitle}>{mod.title}</Text>
              <Text style={styles.moduleDesc} numberOfLines={2}>
                {mod.description}
              </Text>
            </AppCard>
          </Pressable>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  cardWrap: {
    width: '48%',
  },
  pressed: {
    opacity: 0.9,
  },
  moduleCard: {
    padding: spacing.sm,
    minHeight: 146,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: radii.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  moduleDesc: {
    marginTop: 4,
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
