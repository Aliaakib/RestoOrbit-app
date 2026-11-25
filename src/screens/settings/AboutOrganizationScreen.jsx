import { StyleSheet, Text, View } from 'react-native';
import { BrandLogo } from '@/components/common/BrandLogo';
import { AppCard } from '@/components/ui/AppCard';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { OPERATIONAL_MODULES } from '@/config/modules';
import { INITIAL_ORGANIZATION } from '@/data/mockData';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

/**
 * Organization Profile & Granted Modules view mirroring AboutView.jsx & AboutOrganizationDetails.jsx.
 */
export function AboutOrganizationScreen() {
  const org = INITIAL_ORGANIZATION;
  const grantedModules = OPERATIONAL_MODULES.filter((mod) =>
    org.store.permissions.includes(mod.key)
  );

  return (
    <ScreenContainer scrollable edges={['left', 'right', 'bottom']}>
      <AppCard style={styles.brandCard}>
        <BrandLogo variant="horizontal" width={190} height={46} />
        <Text style={styles.orgName}>{org.organizationName}</Text>
        <Text style={styles.legalName}>{org.legalBusinessName}</Text>
      </AppCard>

      <AppCard style={styles.card}>
        <Text style={styles.sectionTitle}>Organization Profile</Text>
        <DetailRow label="Organization Code" value={org.organizationCode} />
        <DetailRow label="Phone" value={org.phoneNumber} />
        <DetailRow label="Headquarters" value={`${org.store.name} (#${org.store.code})`} />
      </AppCard>

      <AppCard style={styles.card}>
        <Text style={styles.sectionTitle}>Root Administrator</Text>
        <DetailRow label="Name" value={`${org.admin.firstName} ${org.admin.lastName}`} />
        <DetailRow label="Email" value={org.admin.email} />
        <DetailRow label="Phone" value={org.admin.phoneNumber} />
      </AppCard>

      <AppCard style={styles.card}>
        <Text style={styles.sectionTitle}>Granted Store Modules ({grantedModules.length})</Text>
        <View style={styles.chipsWrap}>
          {grantedModules.map((mod) => (
            <StatusBadge key={mod.key} label={mod.title} tone="primary" />
          ))}
        </View>
      </AppCard>
    </ScreenContainer>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brandCard: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  orgName: {
    marginTop: spacing.sm,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  legalName: {
    marginTop: 2,
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
    gap: spacing.sm,
  },
  label: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  value: {
    flex: 1,
    textAlign: 'right',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
});
