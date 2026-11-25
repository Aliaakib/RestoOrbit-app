import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { AUTH_STATUS, STORAGE_KEYS } from '@/config/constants';
import { env } from '@/config/env';
import { authService } from '@/services/api/authService';
import { configureHttpClient } from '@/services/api/httpClient';
import { secureStorage } from '@/services/storage/secureStorage';
import { logger } from '@/utils/logger';

export const AuthContext = createContext(null);

async function clearPersistedCredentials() {
  await Promise.all([
    secureStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
    secureStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
    secureStorage.removeItem(STORAGE_KEYS.USER_SESSION),
  ]);
}

/**
 * Manages authenticated session lifecycle, encrypted token persistence,
 * and automatic 401 session cleanup.
 */
export function AuthProvider({ children }) {
  const [status, setStatus] = useState(AUTH_STATUS.LOADING);
  const [user, setUser] = useState(null);

  const clearSession = useCallback(async () => {
    await clearPersistedCredentials();
    setUser(null);
    setStatus(AUTH_STATUS.UNAUTHENTICATED);
  }, []);

  const loadPersistedSession = useCallback(async () => {
    try {
      const [token, cachedUserRaw] = await Promise.all([
        secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
        secureStorage.getItem(STORAGE_KEYS.USER_SESSION),
      ]);

      if (!token) {
        return { nextStatus: AUTH_STATUS.UNAUTHENTICATED, nextUser: null };
      }

      let hydratedUser = null;
      if (cachedUserRaw) {
        try {
          hydratedUser = JSON.parse(cachedUserRaw);
        } catch {
          logger.warn('Corrupted cached user session; resetting.');
        }
      }

      if (!env.isDemoApiMode) {
        const freshUser = await authService.getCurrentUser();
        if (freshUser) {
          hydratedUser = freshUser;
          await secureStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(freshUser));
        }
      }

      return { nextStatus: AUTH_STATUS.AUTHENTICATED, nextUser: hydratedUser };
    } catch (error) {
      logger.warn('Session restoration failed; signing out.', error);
      await clearPersistedCredentials();
      return { nextStatus: AUTH_STATUS.UNAUTHENTICATED, nextUser: null };
    }
  }, []);

  const restoreSession = useCallback(async () => {
    const { nextStatus, nextUser } = await loadPersistedSession();
    setUser(nextUser);
    setStatus(nextStatus);
  }, [loadPersistedSession]);

  useEffect(() => {
    configureHttpClient({
      getAccessToken: () => secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
      onUnauthorized: () => {
        clearSession();
      },
    });
  }, [clearSession]);

  useEffect(() => {
    let isMounted = true;

    loadPersistedSession().then(({ nextStatus, nextUser }) => {
      if (!isMounted) return;
      setUser(nextUser);
      setStatus(nextStatus);
    });

    return () => {
      isMounted = false;
    };
  }, [loadPersistedSession]);

  const signIn = useCallback(async (credentials) => {
    const result = await authService.signIn(credentials);

    if (!result?.accessToken) {
      throw new Error('Authentication response did not include an access token.');
    }

    await secureStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, result.accessToken);
    if (result.refreshToken) {
      await secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, result.refreshToken);
    }
    if (result.user) {
      await secureStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(result.user));
    }

    setUser(result.user || null);
    setStatus(AUTH_STATUS.AUTHENTICATED);
    return result.user;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authService.signOut();
    } catch (error) {
      // Clear local credentials even if server logout fails (e.g., offline).
      logger.warn('Server sign-out failed; clearing local session anyway.', error);
    } finally {
      await clearSession();
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({
      status,
      user,
      isLoading: status === AUTH_STATUS.LOADING,
      isAuthenticated: status === AUTH_STATUS.AUTHENTICATED,
      signIn,
      signOut,
      restoreSession,
    }),
    [status, user, signIn, signOut, restoreSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
