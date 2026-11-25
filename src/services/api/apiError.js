/**
 * Normalized API error for consistent error handling across services and UI.
 */
export class ApiError extends Error {
  constructor({ message, status = 0, code = 'UNKNOWN_ERROR', details = null }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isNetworkError() {
    return this.code === 'NETWORK_ERROR' || this.code === 'TIMEOUT_ERROR';
  }
}

/**
 * Converts unknown thrown values into a safe, user-presentable message.
 */
export function getReadableErrorMessage(
  error,
  fallback = 'Something went wrong. Please try again.'
) {
  if (error instanceof ApiError) {
    return error.message || fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
