import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { INITIAL_REGISTERS_DATA } from '@/data/mockData';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { formatCurrency, formatSignedCurrency } from '@/utils/formatters';

const ENTRY_TABS = ['Registers', 'Safe Count', 'Overview'];
const REGISTER_KEYS = ['front-left', 'front-right', 'drive-thru'];

function calculateDrawerCash(register) {
  const billsSum = register.bills.reduce((sum, b) => sum + b.denom * b.qty, 0);
  const coinsSum = register.coins.reduce((sum, c) => sum + c.denom * c.qty, 0);
  return Number((billsSum + coinsSum).toFixed(2));
}

/**
 * Interactive Mobile Shift Entry Wizard mirroring resto-orbit-frontend ShiftEntry.jsx.
 * Supports Register denomination counting, Safe Count verification, and Overview submission.
 */
export function ShiftEntryScreen({ route, navigation }) {
  const shiftRecord = route.params?.shiftRecord || {
    id: 'SHF-NEW',
    shift: 'Shift 2',
    date: 'Nov 26, 2026',
    storeName: 'Downtown Bistro (Main)',
    shiftTiming: '4:00 PM – 12:00 AM',
    manager: 'Michael Chang',
    safeCount: 1250,
    notes: '',
  };
  const onSaveShift = route.params?.onSaveShift;

  const [activeTab, setActiveTab] = useState('Registers');
  const [activeRegisterKey, setActiveRegisterKey] = useState('front-left');
  const [registers, setRegisters] = useState(() =>
    JSON.parse(JSON.stringify(INITIAL_REGISTERS_DATA))
  );
  const [safeBalance, setSafeBalance] = useState(String(shiftRecord.safeCount || 1250));
  const [notes, setNotes] = useState(shiftRecord.notes || '');

  const currentRegister = registers[activeRegisterKey];

  const drawerTotals = useMemo(() => {
    const cashOnHand = calculateDrawerCash(currentRegister);
    const overShort = Number((cashOnHand - currentRegister.cashPerRegister).toFixed(2));
    return { cashOnHand, overShort };
  }, [currentRegister]);

  const shiftSummary = useMemo(() => {
    return REGISTER_KEYS.reduce(
      (acc, key) => {
        const reg = registers[key];
        const cashOnHand = calculateDrawerCash(reg);
        acc.totalCash += cashOnHand;
        acc.totalCard += reg.externalCreditCard;
        acc.totalOverShort += cashOnHand - reg.cashPerRegister;
        return acc;
      },
      { totalCash: 0, totalCard: 0, totalOverShort: 0 }
    );
  }, [registers]);

  function updateDenomQty(groupKey, itemId, delta) {
    setRegisters((prev) => {
      const target = prev[activeRegisterKey];
      const updatedItems = target[groupKey].map((item) =>
        item.id === itemId ? { ...item, qty: Math.max(0, item.qty + delta) } : item
      );
      return {
        ...prev,
        [activeRegisterKey]: {
          ...target,
          [groupKey]: updatedItems,
        },
      };
    });
  }

  function handleSave(nextStatus) {
    const totalSales = Number((shiftSummary.totalCash + shiftSummary.totalCard).toFixed(2));
    const updatedRecord = {
      ...shiftRecord,
      status: nextStatus,
      shiftSale: totalSales,
      cashOverShort: Number(shiftSummary.totalOverShort.toFixed(2)),
      safeCount: Number(safeBalance) || 0,
      registersCount: '3 of 3',
      notes: notes.trim(),
    };

    if (typeof onSaveShift === 'function') {
      onSaveShift(updatedRecord);
    }

    Alert.alert(
      nextStatus === 'Submitted' ? 'Shift Submitted' : 'Draft Saved',
      `Shift total ${formatCurrency(totalSales)} recorded as ${nextStatus}.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  }

  return (
    <ScreenContainer scrollable edges={['left', 'right', 'bottom']}>
      {/* Metadata Header Card */}
      <AppCard style={styles.metaCard}>
        <View style={styles.metaRow}>
          <View>
            <Text style={styles.metaTitle}>
              {shiftRecord.shift} • {shiftRecord.date}
            </Text>
            <Text style={styles.metaSubtitle}>
              {shiftRecord.storeName} • {shiftRecord.shiftTiming}
            </Text>
          </View>
          <StatusBadge label={shiftRecord.status || 'Pending'} tone="info" />
        </View>
      </AppCard>

      {/* Top Section Tabs (Registers | Safe Count | Overview) */}
      <View style={styles.tabBar}>
        {ENTRY_TABS.map((tab) => {
          const active = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabItem, active && styles.tabItemActive]}
            >
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab}</Text>
            </Pressable>
          );
        })}
      </View>

      {activeTab === 'Registers' ? (
        <View>
          {/* Station Switcher */}
          <View style={styles.stationRow}>
            {REGISTER_KEYS.map((key) => {
              const station = registers[key];
              const selected = key === activeRegisterKey;
              return (
                <Pressable
                  key={key}
                  onPress={() => setActiveRegisterKey(key)}
                  style={[styles.stationPill, selected && styles.stationPillActive]}
                >
                  <Text style={[styles.stationText, selected && styles.stationTextActive]}>
                    {station.name}
                  </Text>
                  <Text style={[styles.stationCode, selected && styles.stationTextActive]}>
                    {station.code}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Drawer Live Reconciliation Summary */}
          <AppCard style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View>
                <Text style={styles.summaryCaption}>Cash On Hand</Text>
                <Text style={styles.summaryValue}>{formatCurrency(drawerTotals.cashOnHand)}</Text>
              </View>
              <View>
                <Text style={styles.summaryCaption}>POS Expected</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(currentRegister.cashPerRegister)}
                </Text>
              </View>
              <View>
                <Text style={styles.summaryCaption}>Over / Short</Text>
                <Text
                  style={[
                    styles.summaryValue,
                    {
                      color:
                        drawerTotals.overShort < 0 ? colors.dangerAccent : colors.successAccent,
                    },
                  ]}
                >
                  {formatSignedCurrency(drawerTotals.overShort)}
                </Text>
              </View>
            </View>
          </AppCard>

          {/* Bills Counter */}
          <AppCard style={styles.denomCard}>
            <Text style={styles.sectionTitle}>Bills ({currentRegister.cashier})</Text>
            {currentRegister.bills.map((bill) => (
              <DenomRow
                key={bill.id}
                label={bill.label}
                qty={bill.qty}
                subtotal={bill.denom * bill.qty}
                onDecrement={() => updateDenomQty('bills', bill.id, -1)}
                onIncrement={() => updateDenomQty('bills', bill.id, 1)}
              />
            ))}
          </AppCard>

          {/* Coins Counter */}
          <AppCard style={styles.denomCard}>
            <Text style={styles.sectionTitle}>Coins</Text>
            {currentRegister.coins.map((coin) => (
              <DenomRow
                key={coin.id}
                label={coin.label}
                qty={coin.qty}
                subtotal={coin.denom * coin.qty}
                onDecrement={() => updateDenomQty('coins', coin.id, -1)}
                onIncrement={() => updateDenomQty('coins', coin.id, 1)}
              />
            ))}
          </AppCard>
        </View>
      ) : null}

      {activeTab === 'Safe Count' ? (
        <AppCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Physical Safe Verification</Text>
          <Text style={styles.helperText}>
            Confirm total physical bills and coin rolls held in the store safe for this shift.
          </Text>
          <AppInput
            label="Total Safe Count ($)"
            value={safeBalance}
            onChangeText={setSafeBalance}
            keyboardType="decimal-pad"
            placeholder="1250.00"
          />
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Prior Shift Baseline</Text>
            <Text style={styles.overviewValue}>$1,250.00</Text>
          </View>
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Variance</Text>
            <Text style={[styles.overviewValue, { color: colors.primary }]}>
              {formatSignedCurrency((Number(safeBalance) || 0) - 1250)}
            </Text>
          </View>
        </AppCard>
      ) : null}

      {activeTab === 'Overview' ? (
        <AppCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Shift Reconciliation Overview</Text>
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Combined Drawer Cash</Text>
            <Text style={styles.overviewValue}>{formatCurrency(shiftSummary.totalCash)}</Text>
          </View>
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>External Card Sales</Text>
            <Text style={styles.overviewValue}>{formatCurrency(shiftSummary.totalCard)}</Text>
          </View>
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Net Shift Over / Short</Text>
            <Text
              style={[
                styles.overviewValue,
                {
                  color:
                    shiftSummary.totalOverShort < 0 ? colors.dangerAccent : colors.successAccent,
                },
              ]}
            >
              {formatSignedCurrency(shiftSummary.totalOverShort)}
            </Text>
          </View>
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Total Shift Revenue</Text>
            <Text style={[styles.overviewValue, { color: colors.primary }]}>
              {formatCurrency(shiftSummary.totalCash + shiftSummary.totalCard)}
            </Text>
          </View>

          <AppInput
            label="Shift Supervisor Notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Record voids, safe drops, or register discrepancies..."
            style={styles.notesInput}
          />
        </AppCard>
      ) : null}

      {/* Footer Actions */}
      <View style={styles.footerActions}>
        <AppButton
          label="Save Draft"
          variant="outline"
          onPress={() => handleSave('Draft')}
          style={styles.footerBtn}
        />
        <AppButton
          label="Submit Shift"
          onPress={() => handleSave('Submitted')}
          style={styles.footerBtn}
        />
      </View>
    </ScreenContainer>
  );
}

function DenomRow({ label, qty, subtotal, onDecrement, onIncrement }) {
  return (
    <View style={styles.denomRow}>
      <Text style={styles.denomLabel}>{label}</Text>
      <View style={styles.stepper}>
        <Pressable accessibilityRole="button" onPress={onDecrement} style={styles.stepBtn}>
          <Ionicons name="remove" size={16} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.qtyText}>{qty}</Text>
        <Pressable accessibilityRole="button" onPress={onIncrement} style={styles.stepBtn}>
          <Ionicons name="add" size={16} color={colors.primary} />
        </Pressable>
      </View>
      <Text style={styles.subtotalText}>{formatCurrency(subtotal)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  metaCard: {
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  metaTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  metaSubtitle: {
    marginTop: 2,
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMuted,
    padding: 4,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
  },
  tabItem: {
    flex: 1,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    borderRadius: radii.sm,
  },
  tabItemActive: {
    backgroundColor: colors.surface,
  },
  tabLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  tabLabelActive: {
    color: colors.primary,
  },
  stationRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  stationPill: {
    flex: 1,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  stationPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stationText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  stationCode: {
    fontSize: 10,
    color: colors.textMuted,
  },
  stationTextActive: {
    color: colors.textInverse,
  },
  summaryCard: {
    marginBottom: spacing.sm,
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryLight,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCaption: {
    fontSize: 11,
    color: colors.primaryDark,
    fontWeight: typography.weights.medium,
  },
  summaryValue: {
    marginTop: 2,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  denomCard: {
    marginBottom: spacing.sm,
  },
  sectionCard: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  helperText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  denomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  denomLabel: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: radii.xs,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  qtyText: {
    minWidth: 24,
    textAlign: 'center',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  subtotalText: {
    width: 78,
    textAlign: 'right',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  overviewLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  overviewValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  notesInput: {
    marginTop: spacing.md,
    marginBottom: 0,
  },
  footerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  footerBtn: {
    flex: 1,
  },
});
