import { StyleSheet, Text, View } from 'react-native';
import { AppCard } from '@/components/ui/AppCard';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { INITIAL_REGISTERS_DATA } from '@/data/mockData';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { formatCurrency, formatSignedCurrency } from '@/utils/formatters';

/**
 * Submitted Shift Audit Report mirroring resto-orbit-frontend ViewShift.jsx.
 */
export function ViewShiftScreen({ route }) {
  const shiftRecord = route.params?.shiftRecord || {
    id: 'SHF-20261126-1',
    date: 'Nov 26, 2026',
    day: 'Thursday',
    storeName: 'Downtown Bistro (Main)',
    shift: 'Shift 1',
    shiftTiming: '8:00 AM – 4:00 PM',
    manager: 'Sarah Jenkins',
    status: 'Submitted',
    shiftSale: 3842.5,
    cashOverShort: 4.25,
    safeCount: 1450.0,
    laborCost: 890.0,
    laborPercent: 23.2,
    notes: 'Smooth lunch rush; Drive Thru card terminal settled on time.',
  };

  const registers = Object.values(INITIAL_REGISTERS_DATA);

  return (
    <ScreenContainer scrollable edges={['left', 'right', 'bottom']}>
      <AppCard style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.reportTitle}>{shiftRecord.shift} Audit Report</Text>
            <Text style={styles.reportMeta}>
              {shiftRecord.storeName} • {shiftRecord.date}
            </Text>
            <Text style={styles.reportMeta}>
              Manager: {shiftRecord.manager} • {shiftRecord.shiftTiming}
            </Text>
          </View>
          <StatusBadge label={shiftRecord.status} tone="success" />
        </View>
      </AppCard>

      <View style={styles.kpiGrid}>
        <StatCard
          title="Net Sales"
          value={formatCurrency(shiftRecord.shiftSale)}
          icon="cash-outline"
          tone="success"
          style={styles.kpiHalf}
        />
        <StatCard
          title="Over / Short"
          value={formatSignedCurrency(shiftRecord.cashOverShort)}
          icon="wallet-outline"
          tone={shiftRecord.cashOverShort < 0 ? 'danger' : 'success'}
          style={styles.kpiHalf}
        />
        <StatCard
          title="Safe Count"
          value={formatCurrency(shiftRecord.safeCount)}
          icon="lock-closed-outline"
          tone="primary"
          style={styles.kpiHalf}
        />
        <StatCard
          title="Labor %"
          value={`${shiftRecord.laborPercent ?? 23.2}%`}
          subtitle={formatCurrency(shiftRecord.laborCost ?? 890)}
          icon="people-outline"
          tone="info"
          style={styles.kpiHalf}
        />
      </View>

      <AppCard style={styles.card}>
        <Text style={styles.sectionTitle}>Register Reconciliation</Text>
        {registers.map((reg) => {
          const cashOnHand =
            reg.bills.reduce((s, b) => s + b.denom * b.qty, 0) +
            reg.coins.reduce((s, c) => s + c.denom * c.qty, 0);
          const overShort = cashOnHand - reg.cashPerRegister;

          return (
            <View key={reg.id} style={styles.regRow}>
              <View style={styles.regLeft}>
                <Text style={styles.regName}>
                  {reg.name} ({reg.code})
                </Text>
                <Text style={styles.regCashier}>Cashier: {reg.cashier}</Text>
              </View>
              <View style={styles.regRight}>
                <Text style={styles.regAmount}>{formatCurrency(cashOnHand)}</Text>
                <Text
                  style={[
                    styles.regVariance,
                    { color: overShort < 0 ? colors.dangerAccent : colors.successAccent },
                  ]}
                >
                  {formatSignedCurrency(overShort)}
                </Text>
              </View>
            </View>
          );
        })}
      </AppCard>

      <AppCard style={styles.card}>
        <Text style={styles.sectionTitle}>Supervisor Notes</Text>
        <Text style={styles.notesText}>
          {shiftRecord.notes || 'No discrepancies or supervisor notes logged for this shift.'}
        </Text>
      </AppCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    marginBottom: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reportTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  reportMeta: {
    marginTop: 2,
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  kpiHalf: {
    width: '48%',
  },
  card: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  regRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  regLeft: {
    flex: 1,
  },
  regName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  regCashier: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  regRight: {
    alignItems: 'flex-end',
  },
  regAmount: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  regVariance: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  notesText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
