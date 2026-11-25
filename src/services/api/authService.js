import { env } from '@/config/env';
import { httpClient } from './httpClient';

/**
 * Authentication domain service.
 * Mirrors resto-orbit-frontend auth endpoints and runs in local demo mode
 * until EXPO_PUBLIC_API_URL is configured.
 */
export const authService = {
  async signIn({ email, password }) {
    if (env.isDemoApiMode) {
      await new Promise((resolve) => setTimeout(resolve, 400));

      return {
        accessToken: 'demo-local-session-token',
        user: {
          id: 'USR-001',
          name: 'Sarah Jenkins',
          email: email.trim().toLowerCase(),
          role: 'Admin',
          storeName: 'Downtown Bistro (Main)',
        },
      };
    }

    return httpClient.post(
      '/auth/login',
      { email: email.trim().toLowerCase(), password },
      { requiresAuth: false }
    );
  },

  async register({ firstName, lastName, email, password, organizationName }) {
    if (env.isDemoApiMode) {
      await new Promise((resolve) => setTimeout(resolve, 450));
      return {
        message: `Account created for ${firstName} ${lastName} (${organizationName}).`,
      };
    }

    return httpClient.post(
      '/auth/register',
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        organizationName: organizationName.trim(),
      },
      { requiresAuth: false }
    );
  },

  async requestPasswordReset({ email }) {
    if (env.isDemoApiMode) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        message: 'Password reset instructions have been sent.',
      };
    }

    return httpClient.post(
      '/auth/forgot-password',
      { email: email.trim().toLowerCase() },
      { requiresAuth: false }
    );
  },

  async getCurrentUser() {
    if (env.isDemoApiMode) {
      return null;
    }

    return httpClient.get('/auth/me');
  },

  async signOut() {
    if (env.isDemoApiMode) {
      return;
    }

    await httpClient.post('/auth/logout');
  },
};
