import * as SecureStore from 'expo-secure-store';
import { logger } from '@/utils/logger';

const SECURE_STORE_OPTIONS = {
  // Prevent sensitive tokens from migrating across unencrypted device backups on iOS.
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

let availabilityPromise = null;

async function isSecureStoreAvailable() {
  if (!availabilityPromise) {
    availabilityPromise = SecureStore.isAvailableAsync().catch(() => false);
  }
  return availabilityPromise;
}

/**
 * Hardware-backed encrypted storage wrapper (iOS Keychain / Android Keystore).
 * Use exclusively for tokens, session credentials, and sensitive user data.
 */
export const secureStorage = {
  async getItem(key) {
    try {
      if (!(await isSecureStoreAvailable())) {
        return null;
      }
      return await SecureStore.getItemAsync(key, SECURE_STORE_OPTIONS);
    } catch (error) {
      logger.error('secureStorage.getItem failed', { key, error });
      return null;
    }
  },

  async setItem(key, value) {
    try {
      if (!(await isSecureStoreAvailable())) {
        logger.warn('SecureStore unavailable on this platform; value was not persisted.', { key });
        return false;
      }
      await SecureStore.setItemAsync(key, String(value), SECURE_STORE_OPTIONS);
      return true;
    } catch (error) {
      logger.error('secureStorage.setItem failed', { key, error });
      return false;
    }
  },

  async removeItem(key) {
    try {
      if (!(await isSecureStoreAvailable())) {
        return true;
      }
      await SecureStore.deleteItemAsync(key, SECURE_STORE_OPTIONS);
      return true;
    } catch (error) {
      logger.error('secureStorage.removeItem failed', { key, error });
      return false;
    }
  },
};
