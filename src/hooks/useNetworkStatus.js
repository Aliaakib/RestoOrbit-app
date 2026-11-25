import { useNetworkState } from 'expo-network';

/**
 * Reactive device connectivity hook built on expo-network.
 * Treats unknown initial state as online to avoid false offline flashes on launch.
 */
export function useNetworkStatus() {
  const networkState = useNetworkState();

  const isConnected = networkState.isConnected ?? true;
  const isInternetReachable = networkState.isInternetReachable ?? true;
  const isOnline = isConnected && isInternetReachable;

  return {
    isConnected,
    isInternetReachable,
    isOnline,
    connectionType: networkState.type || 'UNKNOWN',
  };
}
