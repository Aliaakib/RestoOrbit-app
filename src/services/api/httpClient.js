import { HTTP_CONFIG } from '@/config/constants';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';
import { ApiError } from './apiError';

let tokenProvider = async () => null;
let unauthorizedHandler = null;

/**
 * Registers dynamic token lookup and 401 session-expiry callbacks
 * without introducing circular imports between AuthContext and httpClient.
 */
export function configureHttpClient({ getAccessToken, onUnauthorized }) {
  if (typeof getAccessToken === 'function') {
    tokenProvider = getAccessToken;
  }
  if (typeof onUnauthorized === 'function') {
    unauthorizedHandler = onUnauthorized;
  }
}

async function parseResponseBody(response) {
  const contentType = response.headers.get('content-type') || '';

  if (response.status === 204) {
    return null;
  }

  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  const text = await response.text();
  return text || null;
}

/**
 * Hardened fetch wrapper with automatic timeout, Bearer auth injection,
 * normalized ApiError responses, and 401 session expiry notification.
 */
async function request(path, options = {}) {
  if (!env.apiUrl) {
    throw new ApiError({
      message: 'API base URL is not configured.',
      code: 'CONFIG_ERROR',
    });
  }

  const {
    method = 'GET',
    body,
    headers = {},
    timeoutMs = env.apiTimeoutMs,
    requiresAuth = true,
    signal: externalSignal,
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Forward external caller aborts (e.g., component unmount) into our timeout controller.
  const onExternalAbort = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) {
      clearTimeout(timeoutId);
      throw new ApiError({ message: 'Request cancelled.', code: 'ABORT_ERROR' });
    }
    externalSignal.addEventListener('abort', onExternalAbort, { once: true });
  }

  try {
    const requestHeaders = {
      Accept: HTTP_CONFIG.JSON_CONTENT_TYPE,
      ...headers,
    };

    if (body !== undefined && !(body instanceof FormData)) {
      requestHeaders['Content-Type'] = HTTP_CONFIG.JSON_CONTENT_TYPE;
    }

    if (requiresAuth) {
      const token = await tokenProvider();
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }
    }

    const url = `${env.apiUrl}${path.startsWith('/') ? path : `/${path}`}`;
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await parseResponseBody(response);

    if (!response.ok) {
      if (response.status === 401 && requiresAuth && unauthorizedHandler) {
        unauthorizedHandler();
      }

      const serverMessage =
        (data && typeof data === 'object' && (data.message || data.error)) ||
        `Request failed with status ${response.status}.`;

      throw new ApiError({
        message: serverMessage,
        status: response.status,
        code: `HTTP_${response.status}`,
        details: data,
      });
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error?.name === 'AbortError') {
      throw new ApiError({
        message: 'Request timed out. Please check your connection and try again.',
        code: 'TIMEOUT_ERROR',
      });
    }

    logger.warn('Network request failed', { path, method });
    throw new ApiError({
      message: 'Unable to reach the server. Please check your internet connection.',
      code: 'NETWORK_ERROR',
    });
  } finally {
    clearTimeout(timeoutId);
    if (externalSignal) {
      externalSignal.removeEventListener('abort', onExternalAbort);
    }
  }
}

export const httpClient = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};
