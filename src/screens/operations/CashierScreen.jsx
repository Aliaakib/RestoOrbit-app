import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppCard } from '@/components/ui/AppCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SearchFilterBar } from '@/components/ui/SearchFilterBar';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MODULE_STATUS } from '@/config/modules';
import { INITIAL_CASHIERS } from '@/data/mockData';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { getInitials } from '@/utils/formatters';

const STATUS_FILTERS = ['All', MODULE_STATUS.ACTIVE, MODULE_STATUS.INACTIVE];

/**
 * Cashier Staff Directory mirroring resto-orbit-frontend CashierList.jsx.
 */
export function CashierScreen() {
  const [cashiers, setCashiers] = useState(INITIAL_CASHIERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const stats = useMemo(() => {
    const total = cashiers.length;
    const active = cashiers.filter((c) => c.status === MODULE_STATUS.ACTIVE).length;
    const inactive = total - active;
    const activePct = total > 0 ? Math.round((active / total) * 100) : 0;
    return { total, active, inactive, activePct };
  }, [cashiers]);

  const filteredCashiers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return cashiers.filter((item) => {
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;
      if (!query) return true;
      return (
        item.name.toLowerCase().includes(query) ||
        item.terminalId.toLowerCase().includes(query) ||
        item.storeName.toLowerCase().includes(query)
      );
    });
  }, [cashiers, searchQuery, statusFilter]);

  function handleToggleStatus(cashierId) {
    setCashiers((prev) =>
      prev.map((c) =>
        c.id === cashierId
          ? {
              ...c,
              status:
                c.status === MODULE_STATUS.ACTIVE ? MODULE_STATUS.INACTIVE : MODULE_STATUS.ACTIVE,
            }
          : c
      )
    );
  }

  const renderHeader = () => (
    <View>
      <Text style={styles.subtitle}>
        Manage cashier staff directory, POS terminal access, and operational active status.
      </Text>

      <View style={styles.statsGrid}>
        <StatCard
          title="Total Cashiers"
          value={stats.total}
          icon="people-outline"
          tone="primary"
          style={styles.statHalf}
        />
        <StatCard
          title="POS Ready"
          value={`${stats.active} (${stats.activePct}%)`}
          icon="card-outline"
          tone="success"
          style={styles.statHalf}
        />
      </View>

      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search cashier name, terminal, branch..."
        filterOptions={STATUS_FILTERS}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />
    </View>
  );

  const renderCashierCard = ({ item }) => {
    const isActive = item.status === MODULE_STATUS.ACTIVE;
    return (
      <AppCard style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
          </View>
          <View style={styles.mainInfo}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.terminalId}</Text>
            <Text style={styles.meta}>{item.storeName}</Text>
          </View>
          <StatusBadge label={item.status} tone={isActive ? 'success' : 'danger'} />
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.pinText}>Terminal PIN: ••••</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => handleToggleStatus(item.id)}
            style={styles.toggleBtn}
          >
            <Ionicons name="swap-horizontal-outline" size={14} color={colors.primary} />
            <Text style={styles.toggleText}>{isActive ? 'Disable' : 'Enable'}</Text>
          </Pressable>
        </View>
      </AppCard>
    );
  };

  return (
    <ScreenContainer edges={['left', 'right', 'bottom']}>
      <FlatList
        data={filteredCashiers}
        keyExtractor={(item) => item.id}
        renderItem={renderCashierCard}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="card-outline"
            title="No cashiers found"
            subtitle="Adjust your search or status filter."
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: spacing.xl,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statHalf: {
    flex: 1,
  },
  card: {
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: radii.full,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.primaryDark,
  },
  mainInfo: {
    flex: 1,
  },
  name: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  meta: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceMuted,
  },
  pinText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  toggleText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
});
