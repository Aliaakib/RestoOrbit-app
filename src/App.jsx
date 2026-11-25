import { preventAutoHideAsync } from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { AppProviders } from '@/context/AppProviders';
import { RootNavigator } from '@/navigation/RootNavigator';

// Keep native splash screen visible until encrypted session hydration resolves.
preventAutoHideAsync().catch(() => {
  // Safe to ignore in environments where splash screen is already handled.
});

/**
 * Root application component mounted from ./App.js.
 */
export default function App() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <RootNavigator />
    </AppProviders>
  );
}
