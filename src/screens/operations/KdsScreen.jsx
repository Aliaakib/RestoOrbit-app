import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { INITIAL_KDS_TICKETS } from '@/data/mockData';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

/**
 * Kitchen Display System (KDS) mobile view mirroring resto-orbit-frontend KdsView.
 */
export function KdsScreen() {
  const [tickets, setTickets] = useState(INITIAL_KDS_TICKETS);

  function handleBumpTicket(ticketId) {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
  }

  return (
    <ScreenContainer edges={['left', 'right', 'bottom']}>
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Text style={styles.subtitle}>
            Live kitchen ticket queue, preparation timers, station routing, and bump controls.
          </Text>
        }
        renderItem={({ item }) => (
          <AppCard style={styles.card}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.ticketTitle}>
                  {item.id} • {item.station}
                </Text>
                <Text style={styles.orderRef}>
                  {item.orderRef} • {item.elapsedMinutes}m elapsed
                </Text>
              </View>
              <StatusBadge
                label={item.priority === 'Rush' ? 'Rush' : item.status}
                tone={item.priority === 'Rush' ? 'danger' : 'primary'}
              />
            </View>

            <View style={styles.itemsList}>
              {item.items.map((line) => (
                <Text key={line} style={styles.itemLine}>
                  • {line}
                </Text>
              ))}
            </View>

            <AppButton
              label="Bump Ticket (Complete)"
              onPress={() => handleBumpTicket(item.id)}
              style={styles.bumpBtn}
            />
          </AppCard>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="checkmark-done-circle-outline"
            title="All kitchen tickets cleared"
            subtitle="New POS orders will appear in the KDS queue automatically."
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
    marginBottom: spacing.md,
  },
  card: {
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  ticketTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  orderRef: {
    marginTop: 2,
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  itemsList: {
    backgroundColor: colors.surfaceMuted,
    padding: spacing.sm,
    borderRadius: 8,
    gap: 4,
  },
  itemLine: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  bumpBtn: {
    minHeight: 40,
  },
});
