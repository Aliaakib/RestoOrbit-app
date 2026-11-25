import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppCard } from '@/components/ui/AppCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SearchFilterBar } from '@/components/ui/SearchFilterBar';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { INITIAL_DAILY_SHIFTS, INITIAL_STORES, INITIAL_WEATHER_CONTEXT } from '@/data/mockData';
import { APP_ROUTES } from '@/navigation/routes';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { formatCurrency, formatSignedCurrency } from '@/utils/formatters';

const SHIFT_FILTERS = ['All', 'Shift 1', 'Shift 2'];

const STATUS_TONE = {
  Submitted: 'success',
  Draft: 'warning',
  Pending: 'info',
};

/**
 * Primary Daily Sales Dashboard mirroring resto-orbit-frontend DailySalesView.
 */
export function DailySalesScreen({ navigation }) {
  const [shifts, setShifts] = useState(INITIAL_DAILY_SHIFTS);
  const [selectedStoreId, setSelectedStoreId] = useState('all');
  const [selectedShiftFilter, setSelectedShiftFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const storeChips = useMemo(
    () => [
      { id: 'all', label: 'All Stores' },
      ...INITIAL_STORES.slice(0, 3).map((s) => ({ id: s.id, label: s.name })),
    ],
    []
  );

  const filteredShifts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return shifts.filter((item) => {
      if (selectedStoreId !== 'all' && item.storeId !== selectedStoreId) return false;
      if (selectedShiftFilter !== 'All' && item.shift !== selectedShiftFilter) return false;
      if (!query) return true;

      return (
        item.storeName.toLowerCase().includes(query) ||
        item.manager.toLowerCase().includes(query) ||
        item.date.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query)
      );
    });
  }, [shifts, selectedStoreId, selectedShiftFilter, searchQuery]);

  const kpis = useMemo(() => {
    const submitted = filteredShifts.filter((s) => s.status === 'Submitted');
    const netSales = submitted.reduce((sum, s) => sum + Number(s.shiftSale || 0), 0);
    const cashOverShort = submitted.reduce((sum, s) => sum + Number(s.cashOverShort || 0), 0);
    const latestSafeCount =
      filteredShifts.length > 0 ? Number(filteredShifts[0].safeCount || 0) : 0;
    const totalShifts = filteredShifts.length;
    const submittedShifts = submitted.length;
    const progressPct = totalShifts > 0 ? Math.round((submittedShifts / totalShifts) * 100) : 0;

    return {
      netSales,
      cashOverShort,
      safeCount: latestSafeCount,
      submittedShifts,
      totalShifts,
      progressPct,
    };
  }, [filteredShifts]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 450);
  }, []);

  const handleShiftPress = useCallback(
    (shiftRecord) => {
      if (shiftRecord.status === 'Submitted') {
        navigation.navigate(APP_ROUTES.VIEW_SHIFT, { shiftRecord });
        return;
      }

      navigation.navigate(APP_ROUTES.SHIFT_ENTRY, {
        shiftRecord,
        onSaveShift: (updatedRecord) => {
          setShifts((prev) =>
            prev.map((row) => (row.id === updatedRecord.id ? updatedRecord : row))
          );
        },
      });
    },
    [navigation]
  );

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <Text style={styles.pageSubtitle}>
        Daily restaurant revenue, shift performance, cash drawer reconciliation & safe counts.
      </Text>

      {/* Store Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storeFilterRow}
      >
        {storeChips.map((chip) => {
          const active = selectedStoreId === chip.id;
          return (
            <Pressable
              key={chip.id}
              onPress={() => setSelectedStoreId(chip.id)}
              style={[styles.storePill, active && styles.storePillActive]}
            >
              <Text style={[styles.storePillText, active && styles.storePillTextActive]}>
                {chip.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Weather & Event Card (matching WeatherCard.jsx) */}
      <AppCard style={styles.weatherCard}>
        <View style={styles.weatherTopRow}>
          <Text style={styles.overline}>WEATHER & DAILY CONTEXT</Text>
          <StatusBadge label={INITIAL_WEATHER_CONTEXT.locationLabel} tone="neutral" />
        </View>

        <View style={styles.weatherBody}>
          <View style={styles.weatherIconBox}>
            <Ionicons name="partly-sunny" size={26} color={colors.primary} />
          </View>
          <View style={styles.weatherInfo}>
            <Text style={styles.tempText}>
              {INITIAL_WEATHER_CONTEXT.temperatureC}°C{' '}
              <Text style={styles.tempRange}>
                ({INITIAL_WEATHER_CONTEXT.tempMinC}°C – {INITIAL_WEATHER_CONTEXT.tempMaxC}°C)
              </Text>
            </Text>
            <Text style={styles.conditionText}>
              {INITIAL_WEATHER_CONTEXT.condition} • Humidity{' '}
              {INITIAL_WEATHER_CONTEXT.humidityPercent}% • Wind{' '}
              {INITIAL_WEATHER_CONTEXT.windSpeedKmh} km/h
            </Text>
          </View>
        </View>

        <View style={styles.eventBar}>
          <Ionicons name="musical-notes-outline" size={15} color={colors.primaryDark} />
          <Text style={styles.eventText}>Event: {INITIAL_WEATHER_CONTEXT.event}</Text>
        </View>
      </AppCard>

      {/* KPI Grid (matching DailySalesKpis.jsx) */}
      <View style={styles.kpiGrid}>
        <StatCard
          title="Net Sales"
          value={formatCurrency(kpis.netSales)}
          subtitle="Submitted shifts only"
          icon="cash-outline"
          tone="success"
          style={styles.kpiHalf}
        />
        <StatCard
          title="Cash Over / Short"
          value={formatSignedCurrency(kpis.cashOverShort)}
          subtitle="Submitted cash variance"
          icon="wallet-outline"
          tone={kpis.cashOverShort < 0 ? 'danger' : 'success'}
          valueColor={kpis.cashOverShort < 0 ? colors.dangerAccent : colors.textPrimary}
          style={styles.kpiHalf}
        />
        <StatCard
          title="Safe Count"
          value={formatCurrency(kpis.safeCount)}
          subtitle="Physical safe balance"
          icon="lock-closed-outline"
          tone="primary"
          style={styles.kpiHalf}
        />
        <StatCard
          title="Shift Progress"
          value={`${kpis.submittedShifts} of ${kpis.totalShifts}`}
          subtitle={`Completed · ${kpis.progressPct}%`}
          icon="checkmark-circle-outline"
          tone="success"
          progressPercent={kpis.progressPct}
          style={styles.kpiHalf}
        />
      </View>

      <Text style={styles.sectionTitle}>Daily Shift Records ({filteredShifts.length})</Text>

      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search store, manager, date..."
        filterOptions={SHIFT_FILTERS}
        activeFilter={selectedShiftFilter}
        onFilterChange={setSelectedShiftFilter}
      />
    </View>
  );

  const renderShiftItem = ({ item }) => {
    const isSubmitted = item.status === 'Submitted';
    const isNegative = Number(item.cashOverShort) < 0;

    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => handleShiftPress(item)}
        style={({ pressed }) => [pressed && styles.pressedCard]}
      >
        <AppCard style={styles.recordCard}>
          <View style={styles.recordHeader}>
            <View>
              <Text style={styles.recordTitle}>
                {item.shift} • {item.date}
              </Text>
              <Text style={styles.recordSubtitle}>
                {item.storeName} • {item.shiftTiming}
              </Text>
            </View>
            <StatusBadge label={item.status} tone={STATUS_TONE[item.status] || 'neutral'} />
          </View>

          <View style={styles.recordMetrics}>
            <View>
              <Text style={styles.metricCaption}>Shift Sale</Text>
              <Text style={styles.metricValue}>
                {isSubmitted || item.shiftSale > 0 ? formatCurrency(item.shiftSale) : '—'}
              </Text>
            </View>
            <View>
              <Text style={styles.metricCaption}>Over / Short</Text>
              <Text
                style={[
                  styles.metricValue,
                  isNegative && { color: colors.dangerAccent },
                  !isNegative && isSubmitted && { color: colors.successAccent },
                ]}
              >
                {isSubmitted ? formatSignedCurrency(item.cashOverShort) : '—'}
              </Text>
            </View>
            <View style={styles.actionHint}>
              <Text style={styles.actionHintText}>
                {isSubmitted ? 'View Report' : 'Enter Shift'}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </View>
          </View>
        </AppCard>
      </Pressable>
    );
  };

  return (
    <ScreenContainer edges={['left', 'right']}>
      <FlatList
        data={filteredShifts}
        keyExtractor={(item) => item.id}
        renderItem={renderShiftItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="calendar-outline"
            title="No shift records match filters"
            subtitle="Adjust store, shift, or search filters to view records."
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: spacing.xl,
  },
  headerContent: {
    marginBottom: spacing.xs,
  },
  pageSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  storeFilterRow: {
    gap: spacing.xs,
    paddingBottom: spacing.sm,
  },
  storePill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  storePillActive: {
    backgroundColor: colors.brandNavy,
    borderColor: colors.brandNavy,
  },
  storePillText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  storePillTextActive: {
    color: colors.textInverse,
  },
  weatherCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
  },
  weatherTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  overline: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.8,
    color: colors.primary,
  },
  weatherBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  weatherIconBox: {
    width: 46,
    height: 46,
    borderRadius: radii.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherInfo: {
    flex: 1,
  },
  tempText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  tempRange: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
  },
  conditionText: {
    marginTop: 2,
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  eventBar: {
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  eventText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
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
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  recordCard: {
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  pressedCard: {
    opacity: 0.9,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  recordTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  recordSubtitle: {
    marginTop: 2,
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  recordMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceMuted,
  },
  metricCaption: {
    fontSize: 11,
    color: colors.textMuted,
  },
  metricValue: {
    marginTop: 2,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  actionHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionHintText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
});
