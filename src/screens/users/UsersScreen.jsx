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
import { getRoleTone, MODULE_STATUS, USER_ROLE_FILTERS, USER_ROLES } from '@/config/modules';
import { INITIAL_USERS } from '@/data/mockData';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { getInitials } from '@/utils/formatters';
import { validateEmail } from '@/utils/validators';

/**
 * Staff & User Role Management screen mirroring resto-orbit-frontend UserList.jsx.
 */
export function UsersScreen() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newStoreName, setNewStoreName] = useState('Downtown Bistro (Main)');
  const [newRole, setNewRole] = useState(USER_ROLES.MANAGER);
  const [formError, setFormError] = useState('');

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === MODULE_STATUS.ACTIVE).length;
    const inactive = total - active;
    const admins = users.filter((u) => u.role.toLowerCase().includes('admin')).length;
    const managers = users.filter((u) => u.role.toLowerCase().includes('manager')).length;
    const staff = total - admins - managers;
    return { total, active, inactive, admins, managers, staff };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return users.filter((user) => {
      if (roleFilter !== 'All' && user.role !== roleFilter) return false;
      if (!query) return true;
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.storeName.toLowerCase().includes(query)
      );
    });
  }, [users, searchQuery, roleFilter]);

  function handleToggleStatus(userId) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              status:
                u.status === MODULE_STATUS.ACTIVE ? MODULE_STATUS.INACTIVE : MODULE_STATUS.ACTIVE,
            }
          : u
      )
    );
  }

  function handleCreateUser() {
    const emailError = validateEmail(newEmail);
    if (!newName.trim() || emailError) {
      setFormError(emailError || 'Full name is required.');
      return;
    }

    const created = {
      id: `USR-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      phoneNumber: '+1 (555) 000-0000',
      role: newRole,
      storeName: newStoreName.trim() || 'Downtown Bistro (Main)',
      status: MODULE_STATUS.ACTIVE,
    };

    setUsers((prev) => [created, ...prev]);
    setNewName('');
    setNewEmail('');
    setFormError('');
    setIsAddModalVisible(false);
  }

  const renderHeader = () => (
    <View>
      <View style={styles.topActionsRow}>
        <Text style={styles.subtitle}>
          Manage employee accounts, role-based permissions, and assigned store locations.
        </Text>
        <AppButton
          label="+ Add User"
          onPress={() => setIsAddModalVisible(true)}
          style={styles.addBtn}
        />
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Total Users"
          value={stats.total}
          subtitle="Registered accounts"
          icon="people-outline"
          tone="primary"
          chipLabel="Total"
          style={styles.statHalf}
        />
        <StatCard
          title="Active Users"
          value={stats.active}
          subtitle="Operational access"
          icon="person-add-outline"
          tone="success"
          chipLabel="Active"
          style={styles.statHalf}
        />
        <StatCard
          title="Inactive Users"
          value={stats.inactive}
          subtitle="Deactivated accounts"
          icon="person-remove-outline"
          tone="danger"
          chipLabel="Paused"
          style={styles.statHalf}
        />
        <StatCard
          title="Role Breakdown"
          value={`${stats.admins}A · ${stats.managers}M · ${stats.staff}S`}
          subtitle="Admin, Mgr, Staff"
          icon="shield-outline"
          tone="info"
          chipLabel="Roles"
          style={styles.statHalf}
        />
      </View>

      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search name, email, or branch..."
        filterOptions={USER_ROLE_FILTERS}
        activeFilter={roleFilter}
        onFilterChange={setRoleFilter}
      />
    </View>
  );

  const renderUserCard = ({ item }) => {
    const isActive = item.status === MODULE_STATUS.ACTIVE;

    return (
      <AppCard style={styles.userCard}>
        <View style={styles.userTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
          </View>
          <View style={styles.userMain}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <View style={styles.badgesRow}>
              <StatusBadge label={item.role} tone={getRoleTone(item.role)} />
              <StatusBadge label={item.status} tone={isActive ? 'success' : 'danger'} />
            </View>
          </View>
        </View>

        <View style={styles.userFooter}>
          <Text style={styles.storeLabel}>{item.storeName}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => handleToggleStatus(item.id)}
            style={styles.toggleBtn}
          >
            <Ionicons
              name={isActive ? 'lock-closed-outline' : 'lock-open-outline'}
              size={14}
              color={colors.primary}
            />
            <Text style={styles.toggleText}>{isActive ? 'Suspend' : 'Restore'}</Text>
          </Pressable>
        </View>
      </AppCard>
    );
  };

  return (
    <ScreenContainer edges={['left', 'right']}>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUserCard}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title="No users found"
            subtitle="Try clearing the search query or selecting All roles."
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
            <Text style={styles.modalTitle}>Add Staff User</Text>
            {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

            <AppInput
              label="Full Name*"
              value={newName}
              onChangeText={setNewName}
              placeholder="e.g. Alex Rivera"
              autoCapitalize="words"
            />
            <AppInput
              label="Work Email*"
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="alex.r@restoorbit.com"
              keyboardType="email-address"
            />
            <AppInput
              label="Assigned Store"
              value={newStoreName}
              onChangeText={setNewStoreName}
              autoCapitalize="words"
            />

            <Text style={styles.roleLabel}>Role</Text>
            <View style={styles.rolePills}>
              {[USER_ROLES.MANAGER, USER_ROLES.STAFF, USER_ROLES.ADMIN].map((roleOption) => {
                const selected = newRole === roleOption;
                return (
                  <Pressable
                    key={roleOption}
                    onPress={() => setNewRole(roleOption)}
                    style={[styles.rolePill, selected && styles.rolePillSelected]}
                  >
                    <Text style={[styles.rolePillText, selected && styles.rolePillTextSelected]}>
                      {roleOption}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.modalActions}>
              <AppButton
                label="Cancel"
                variant="outline"
                onPress={() => setIsAddModalVisible(false)}
                style={styles.modalBtn}
              />
              <AppButton label="Create User" onPress={handleCreateUser} style={styles.modalBtn} />
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
  userCard: {
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  userTop: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
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
  userMain: {
    flex: 1,
  },
  userName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  userFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceMuted,
  },
  storeLabel: {
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
  roleLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  rolePills: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  rolePill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rolePillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rolePillText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  rolePillTextSelected: {
    color: colors.textInverse,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalBtn: {
    flex: 1,
  },
});
