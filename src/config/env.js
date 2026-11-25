import Constants from 'expo-constants';
import { HTTP_CONFIG } from './constants';

/**
 * Parses a positive integer environment value safely, falling back on invalid input.
 */
function parsePositiveInt(rawValue, fallback) {
  const parsed = Number.parseInt(rawValue, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Strips trailing slashes so endpoint paths always join cleanly.
 */
function normalizeBaseUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return '';
  }

  return rawUrl.trim().replace(/\/+$/, '');
}

const rawEnv = process.env.EXPO_PUBLIC_APP_ENV || (__DEV__ ? 'development' : 'production');
const apiUrl = normalizeBaseUrl(process.env.EXPO_PUBLIC_API_URL);

/**
 * Validated runtime configuration exposed to the app.
 * Note: Only non-secret EXPO_PUBLIC_* values belong in client code.
 */
export const env = Object.freeze({
  appName: Constants.expoConfig?.extra?.appName || Constants.expoConfig?.name || 'RestoOrbit',
  appVersion: Constants.expoConfig?.version || '1.0.0',
  appEnv: rawEnv,
  isDev: __DEV__ || rawEnv === 'development',
  apiUrl,
  // Runs local demo auth flow until a real backend URL is configured in .env.
  isDemoApiMode: !apiUrl || apiUrl.includes('example.com'),
  apiTimeoutMs: parsePositiveInt(
    process.env.EXPO_PUBLIC_API_TIMEOUT_MS,
    HTTP_CONFIG.DEFAULT_TIMEOUT_MS
  ),
});
