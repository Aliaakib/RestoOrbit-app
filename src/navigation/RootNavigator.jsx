import { hideAsync } from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { useAuth } from '@/hooks/useAuth';
import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';

/**
 * Coordinates auth hydration with native SplashScreen dismissal so users never see
 * an unauthenticated screen flash when a valid session exists.
 */
export function RootNavigator() {
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      hideAsync().catch(() => {
        // Ignore if splash screen was already hidden on fast refresh.
      });
    }
  }, [isLoading]);

  if (isLoading) {
    return <LoadingOverlay message="Restoring session..." />;
  }

  return (
    <View style={{ flex: 1 }}>
      <OfflineBanner />
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </View>
  );
}
