import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandLogo } from '@/components/common/BrandLogo';
import { DailySalesScreen } from '@/screens/dailySales/DailySalesScreen';
import { OperationsHubScreen } from '@/screens/operations/OperationsHubScreen';
import { SettingsScreen } from '@/screens/settings/SettingsScreen';
import { StoresScreen } from '@/screens/stores/StoresScreen';
import { UsersScreen } from '@/screens/users/UsersScreen';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { MAIN_TABS } from './routes';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  [MAIN_TABS.DAILY_SALES]: { active: 'bar-chart', inactive: 'bar-chart-outline' },
  [MAIN_TABS.STORES]: { active: 'storefront', inactive: 'storefront-outline' },
  [MAIN_TABS.OPERATIONS]: { active: 'grid', inactive: 'grid-outline' },
  [MAIN_TABS.USERS]: { active: 'people', inactive: 'people-outline' },
  [MAIN_TABS.SETTINGS]: { active: 'settings', inactive: 'settings-outline' },
};

function HeaderBrandMark() {
  return (
    <View style={{ marginLeft: spacing.md }}>
      <BrandLogo variant="icon" width={28} height={28} />
    </View>
  );
}

/**
 * Primary authenticated bottom tabs matching RestoOrbit's core modules.
 */
export function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          color: colors.textPrimary,
          fontSize: typography.sizes.lg,
          fontWeight: typography.weights.bold,
        },
        headerLeft: () => <HeaderBrandMark />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: typography.weights.semibold,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 58 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 6),
          paddingTop: 6,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.active : icons.inactive;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name={MAIN_TABS.DAILY_SALES}
        component={DailySalesScreen}
        options={{ title: 'Daily Sales' }}
      />
      <Tab.Screen name={MAIN_TABS.STORES} component={StoresScreen} options={{ title: 'Stores' }} />
      <Tab.Screen
        name={MAIN_TABS.OPERATIONS}
        component={OperationsHubScreen}
        options={{ title: 'Operations' }}
      />
      <Tab.Screen name={MAIN_TABS.USERS} component={UsersScreen} options={{ title: 'Users' }} />
      <Tab.Screen
        name={MAIN_TABS.SETTINGS}
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}
