import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { BrandLogo } from '@/components/common/BrandLogo';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { env } from '@/config/env';
import { useAuth } from '@/hooks/useAuth';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { APP_ROUTES } from '@/navigation/routes';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { getInitials } from '@/utils/formatters';

/**
 * Account, organization navigation, device diagnostics, and secure sign-out screen.
 */
export function SettingsScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const { isOnline, connectionType } = useNetworkStatus();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <ScreenContainer scrollable edges={['left', 'right']}>
      <AppCard style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(user?.name || 'RestoOrbit')}</Text>
        </View>
        <View style={styles.profileMain}>
          <Text style={styles.profileName}>{user?.name || 'Sarah Jenkins'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'sarah.jenkins@restoorbit.com'}</Text>
          <StatusBadge label={user?.role || 'Admin'} tone="primary" style={styles.roleBadge} />
        </View>
      </AppCard>

      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate(APP_ROUTES.ABOUT_ORGANIZATION)}
      >
        <AppCard style={styles.navCard}>
          <View style={styles.navLeft}>
            <BrandLogo variant="icon" width={36} height={36} />
            <View>
              <Text style={styles.navTitle}>About Organization</Text>
              <Text style={styles.navSubtitle}>Company profile, root admin & branch modules</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </AppCard>
      </Pressable>

      <AppCard style={styles.card}>
        <Text style={styles.sectionTitle}>App & Runtime Diagnostics</Text>
        <InfoRow label="Application" value={env.appName} />
        <InfoRow label="Version" value={env.appVersion} />
        <InfoRow label="Platform" value={`${Platform.OS.toUpperCase()} (${Platform.Version})`} />
        <InfoRow label="API Mode" value={env.isDemoApiMode ? 'Demo (Local)' : 'Live Endpoint'} />
        <InfoRow label="Connectivity" value={isOnline ? `Online (${connectionType})` : 'Offline'} />
        <InfoRow label="Token Storage" value="Encrypted SecureStore" />
      </AppCard>

      <View style={styles.actions}>
        <AppButton
          label="Sign Out"
          variant="danger"
          onPress={handleSignOut}
          loading={isSigningOut}
        />
      </View>
    </ScreenContainer>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radii.full,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.primaryDark,
  },
  profileMain: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  profileEmail: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  roleBadge: {
    marginTop: spacing.xs,
  },
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  navTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  navSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  card: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xxs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xxs,
  },
  label: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  value: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  actions: {
    marginTop: spacing.xs,
  },
});
