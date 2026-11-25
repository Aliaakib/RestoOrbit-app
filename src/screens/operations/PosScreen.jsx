import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { INITIAL_POS_ORDERS } from '@/data/mockData';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { formatCurrency } from '@/utils/formatters';

const STATUS_TONE = {
  Preparing: 'warning',
  Ready: 'success',
  Paid: 'primary',
};

/**
 * POS & Orders view mirroring resto-orbit-frontend PosView.
 */
export function PosScreen() {
  const [orders, setOrders] = useState(INITIAL_POS_ORDERS);

  function handleAdvanceStatus(orderId) {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const nextStatus =
          order.status === 'Preparing' ? 'Ready' : order.status === 'Ready' ? 'Paid' : 'Paid';
        return { ...order, status: nextStatus };
      })
    );
  }

  return (
    <ScreenContainer edges={['left', 'right', 'bottom']}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.subtitle}>
              Table seating layout, rapid checkout registers, and active counter orders.
            </Text>
            <View style={styles.statsRow}>
              <StatCard
                title="Active Checks"
                value={orders.filter((o) => o.status !== 'Paid').length}
                icon="receipt-outline"
                tone="primary"
                style={styles.statHalf}
              />
              <StatCard
                title="Open Total"
                value={formatCurrency(orders.reduce((s, o) => s + o.total, 0))}
                icon="cash-outline"
                tone="success"
                style={styles.statHalf}
              />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <AppCard style={styles.card}>
            <View style={styles.topRow}>
              <View>
                <Text style={styles.orderId}>
                  {item.id} • {item.channel}
                </Text>
                <Text style={styles.meta}>
                  {item.table} • Server: {item.server} • {item.elapsed} ago
                </Text>
              </View>
              <StatusBadge label={item.status} tone={STATUS_TONE[item.status] || 'neutral'} />
            </View>

            <View style={styles.bottomRow}>
              <Text style={styles.amount}>
                {item.itemsCount} items • {formatCurrency(item.total)}
              </Text>
              {item.status !== 'Paid' ? (
                <AppButton
                  label={item.status === 'Preparing' ? 'Mark Ready' : 'Settle Paid'}
                  variant="outline"
                  onPress={() => handleAdvanceStatus(item.id)}
                  style={styles.smallBtn}
                />
              ) : null}
            </View>
          </AppCard>
        )}
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
  header: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statHalf: {
    flex: 1,
  },
  card: {
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  meta: {
    marginTop: 2,
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceMuted,
  },
  amount: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  smallBtn: {
    minHeight: 36,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },
});
