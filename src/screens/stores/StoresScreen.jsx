import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SearchFilterBar } from '@/components/ui/SearchFilterBar';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MODULE_STATUS } from '@/config/modules';
import { INITIAL_STORES } from '@/data/mockData';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

const STATUS_FILTERS = ['All', MODULE_STATUS.ACTIVE, MODULE_STATUS.INACTIVE];

/**
 * Multi-Store / Branch Management screen mirroring resto-orbit-frontend StoreList.jsx.
 */
export function StoresScreen() {
  const [stores, setStores] = useState(INITIAL_STORES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [formError, setFormError] = useState('');

  const stats = useMemo(() => {
    const total = stores.length;
    const active = stores.filter((s) => s.status === MODULE_STATUS.ACTIVE).length;
    const inactive = total - active;
    const activePct = total > 0 ? Math.round((active / total) * 100) : 0;
    return { total, active, inactive, activePct };
  }, [stores]);

  const filteredStores = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return stores.filter((store) => {
      if (statusFilter !== 'All' && store.status !== statusFilter) return false;
      if (!query) return true;
      return (
        store.name.toLowerCase().includes(query) ||
        store.code.toLowerCase().includes(query) ||
        store.address.toLowerCase().includes(query)
      );
    });
  }, [stores, searchQuery, statusFilter]);

  function handleToggleStatus(storeId) {
    setStores((prev) =>
      prev.map((s) =>
        s.id === storeId
          ? {
              ...s,
              status:
                s.status === MODULE_STATUS.ACTIVE ? MODULE_STATUS.INACTIVE : MODULE_STATUS.ACTIVE,
            }
          : s
      )
    );
  }

  function handleCreateStore() {
    if (!newName.trim() || !/^\d{5}$/.test(newCode.trim())) {
      setFormError('Enter a branch name and a 5-digit store code.');
      return;
    }

    const created = {
      id: `STR-${Date.now()}`,
      name: newName.trim(),
      code: newCode.trim(),
      address: newAddress.trim() || 'Address pending branch setup',
      phoneNumber: '+1 (555) 000-0000',
      status: MODULE_STATUS.ACTIVE,
      isHeadquarters: false,
      totalRegisters: 2,
      permissions: ['daily_sales', 'pos_orders', 'kitchen_display'],
    };

    setStores((prev) => [created, ...prev]);
    setNewName('');
    setNewCode('');
    setNewAddress('');
    setFormError('');
    setIsAddModalVisible(false);
  }

  const renderHeader = () => (
    <View>
      <View style={styles.topActionsRow}>
        <Text style={styles.subtitle}>
          Manage branch locations, 5-digit store codes, operating status, and module scopes.
        </Text>
        <AppButton
          label="+ Add Store"
          onPress={() => setIsAddModalVisible(true)}
          style={styles.addBtn}
        />
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Total Stores"
          value={stats.total}
          subtitle="Registered branches"
          icon="business-outline"
          tone="primary"
          chipLabel="All"
          style={styles.statHalf}
        />
        <StatCard
          title="Active Stores"
          value={stats.active}
          subtitle={`${stats.activePct}% trading`}
          icon="checkmark-done-outline"
          tone="success"
          chipLabel="Operational"
          style={styles.statHalf}
        />
        <StatCard
          title="Inactive Stores"
          value={stats.inactive}
          subtitle="Paused locations"
          icon="pause-circle-outline"
          tone="danger"
          chipLabel="Restricted"
          style={styles.statHalf}
        />
        <StatCard
          title="Modules Scope"
          value="10 Modules"
          subtitle="Store access control"
          icon="shield-checkmark-outline"
          tone="info"
          chipLabel="Security"
          style={styles.statHalf}
        />
      </View>

      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search branch name, 5-digit code, address..."
        filterOptions={STATUS_FILTERS}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />
    </View>
  );

  const renderStoreCard = ({ item }) => {
    const isActive = item.status === MODULE_STATUS.ACTIVE;

    return (
      <AppCard style={styles.itemCard}>
        <View style={styles.itemTop}>
          <View style={styles.itemTitleBlock}>
            <View style={styles.nameRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              {item.isHeadquarters ? <StatusBadge label="HQ" tone="primary" /> : null}
            </View>
            <Text style={styles.itemCode}>Store Code #{item.code}</Text>
          </View>
          <StatusBadge label={item.status} tone={isActive ? 'success' : 'danger'} />
        </View>

        <Text style={styles.itemAddress} numberOfLines={2}>
          {item.address}
        </Text>

        <View style={styles.itemFooter}>
          <Text style={styles.itemMeta}>
            {item.totalRegisters} Registers • {item.permissions.length} Modules
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => handleToggleStatus(item.id)}
            style={styles.toggleBtn}
          >
            <Ionicons
              name={isActive ? 'power-outline' : 'checkmark-circle-outline'}
              size={15}
              color={colors.primary}
            />
            <Text style={styles.toggleText}>{isActive ? 'Deactivate' : 'Activate'}</Text>
          </Pressable>
        </View>
      </AppCard>
    );
  };

  return (
    <ScreenContainer edges={['left', 'right']}>
      <FlatList
        data={filteredStores}
        keyExtractor={(item) => item.id}
        renderItem={renderStoreCard}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="storefront-outline"
            title="No stores found"
            subtitle="Try adjusting your search query or status filter."
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <AppCard style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add New Store</Text>
            {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

            <AppInput
              label="Branch Name*"
              value={newName}
              onChangeText={setNewName}
              placeholder="e.g. Midtown Bistro"
              autoCapitalize="words"
            />
            <AppInput
              label="5-Digit Store Code*"
              value={newCode}
              onChangeText={setNewCode}
              placeholder="e.g. 60421"
              keyboardType="number-pad"
            />
            <AppInput
              label="Street Address"
              value={newAddress}
              onChangeText={setNewAddress}
              placeholder="120 Main St, Suite 4"
              autoCapitalize="words"
              returnKeyType="done"
            />

            <View style={styles.modalActions}>
              <AppButton
                label="Cancel"
                variant="outline"
                onPress={() => setIsAddModalVisible(false)}
                style={styles.modalBtn}
              />
              <AppButton label="Save Store" onPress={handleCreateStore} style={styles.modalBtn} />
            </View>
          </AppCard>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: spacing.xl,
  },
  topActionsRow: {
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  addBtn: {
    alignSelf: 'flex-start',
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statHalf: {
    width: '48%',
  },
  itemCard: {
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  itemTitleBlock: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  itemName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  itemCode: {
    marginTop: 2,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  itemAddress: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceMuted,
  },
  itemMeta: {
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(19, 25, 32, 0.5)',
    justifyContent: 'center',
    padding: spacing.md,
  },
  modalCard: {
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: typography.sizes.xs,
    color: colors.dangerAccent,
    marginBottom: spacing.sm,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  modalBtn: {
    flex: 1,
  },
});
