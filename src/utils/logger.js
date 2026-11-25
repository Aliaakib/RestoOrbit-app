import { env } from '@/config/env';

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'accesstoken',
  'refreshtoken',
  'authorization',
  'secret',
  'apikey',
]);

/**
 * Redacts sensitive fields recursively before emitting structured logs.
 */
function sanitizePayload(value) {
  if (value === null || value === undefined || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(sanitizePayload);
  }

  return Object.keys(value).reduce((acc, key) => {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      acc[key] = '[REDACTED]';
    } else {
      acc[key] = sanitizePayload(value[key]);
    }
    return acc;
  }, {});
}

/**
 * Environment-aware logger. Silences verbose logs in production and redacts secrets.
 */
export const logger = {
  debug(message, meta) {
    if (!env.isDev) return;
    // eslint-disable-next-line no-console
    console.debug(`[RestoOrbit] ${message}`, meta !== undefined ? sanitizePayload(meta) : '');
  },

  info(message, meta) {
    if (!env.isDev) return;
    // eslint-disable-next-line no-console
    console.info(`[RestoOrbit] ${message}`, meta !== undefined ? sanitizePayload(meta) : '');
  },

  warn(message, meta) {
    console.warn(`[RestoOrbit] ${message}`, meta !== undefined ? sanitizePayload(meta) : '');
  },

  error(message, error) {
    const safeError =
      error instanceof Error
        ? { name: error.name, message: error.message }
        : sanitizePayload(error);
    console.error(`[RestoOrbit] ${message}`, safeError ?? '');
  },
};
