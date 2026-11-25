import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@/utils/logger';

/**
 * Wrapper around AsyncStorage for non-sensitive UI preferences and flags.
 * Never store auth tokens, passwords, or PII here—use secureStorage instead.
 */
export const asyncStorage = {
  async getItem(key) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      logger.error('asyncStorage.getItem failed', { key, error });
      return null;
    }
  },

  async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, String(value));
      return true;
    } catch (error) {
      logger.error('asyncStorage.setItem failed', { key, error });
      return false;
    }
  },

  async getJson(key) {
    const raw = await this.getItem(key);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch (error) {
      logger.error('asyncStorage.getJson parse failed', { key, error });
      return null;
    }
  },

  async setJson(key, value) {
    try {
      return await this.setItem(key, JSON.stringify(value));
    } catch (error) {
      logger.error('asyncStorage.setJson stringify failed', { key, error });
      return false;
    }
  },

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      logger.error('asyncStorage.removeItem failed', { key, error });
      return false;
    }
  },
};
