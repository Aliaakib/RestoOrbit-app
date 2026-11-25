/**
 * Application-wide immutable constants.
 * Centralizes storage keys, HTTP defaults, and validation limits
 * so no magic strings are duplicated across features.
 */

export const STORAGE_KEYS = Object.freeze({
  ACCESS_TOKEN: 'restoorbit.auth.access_token',
  REFRESH_TOKEN: 'restoorbit.auth.refresh_token',
  USER_SESSION: 'restoorbit.auth.user_session',
  THEME_PREFERENCE: 'restoorbit.prefs.theme',
  ONBOARDING_COMPLETED: 'restoorbit.prefs.onboarding_completed',
});

export const AUTH_STATUS = Object.freeze({
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
});

export const HTTP_CONFIG = Object.freeze({
  DEFAULT_TIMEOUT_MS: 15000,
  JSON_CONTENT_TYPE: 'application/json',
});

export const VALIDATION_RULES = Object.freeze({
  MIN_PASSWORD_LENGTH: 6,
  MAX_EMAIL_LENGTH: 254,
});
