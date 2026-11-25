import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ShiftEntryScreen } from '@/screens/dailySales/ShiftEntryScreen';
import { ViewShiftScreen } from '@/screens/dailySales/ViewShiftScreen';
import { CashierScreen } from '@/screens/operations/CashierScreen';
import { KdsScreen } from '@/screens/operations/KdsScreen';
import { ModulePreviewScreen } from '@/screens/operations/ModulePreviewScreen';
import { PosScreen } from '@/screens/operations/PosScreen';
import { AboutOrganizationScreen } from '@/screens/settings/AboutOrganizationScreen';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { MainTabNavigator } from './MainTabNavigator';
import { APP_ROUTES } from './routes';

const Stack = createNativeStackNavigator();

/**
 * Authenticated native stack wrapping MainTabNavigator and pushed operational screens.
 */
export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
        headerTintColor: colors.primary,
        headerTitleStyle: {
          color: colors.textPrimary,
          fontSize: typography.sizes.md,
          fontWeight: typography.weights.bold,
        },
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen
        name={APP_ROUTES.MAIN_TABS}
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={APP_ROUTES.SHIFT_ENTRY}
        component={ShiftEntryScreen}
        options={{ title: 'Shift Entry' }}
      />
      <Stack.Screen
        name={APP_ROUTES.VIEW_SHIFT}
        component={ViewShiftScreen}
        options={{ title: 'Shift Report' }}
      />
      <Stack.Screen
        name={APP_ROUTES.CASHIER}
        component={CashierScreen}
        options={{ title: 'Cashier Directory' }}
      />
      <Stack.Screen
        name={APP_ROUTES.POS}
        component={PosScreen}
        options={{ title: 'POS & Orders' }}
      />
      <Stack.Screen
        name={APP_ROUTES.KDS}
        component={KdsScreen}
        options={{ title: 'Kitchen Display (KDS)' }}
      />
      <Stack.Screen
        name={APP_ROUTES.MODULE_PREVIEW}
        component={ModulePreviewScreen}
        options={({ route }) => ({
          title: route.params?.moduleInfo?.title || 'Module',
        })}
      />
      <Stack.Screen
        name={APP_ROUTES.ABOUT_ORGANIZATION}
        component={AboutOrganizationScreen}
        options={{ title: 'About Organization' }}
      />
    </Stack.Navigator>
  );
}
