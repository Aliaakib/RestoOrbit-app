import { VALIDATION_RULES } from '@/config/constants';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates an email address and returns an error message or null when valid.
 */
export function validateEmail(email) {
  const trimmed = (email || '').trim();

  if (!trimmed) {
    return 'Email address is required.';
  }

  if (trimmed.length > VALIDATION_RULES.MAX_EMAIL_LENGTH) {
    return 'Email address is too long.';
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Please enter a valid email address.';
  }

  return null;
}

/**
 * Validates a password against baseline security length rules.
 */
export function validatePassword(password) {
  if (!password) {
    return 'Password is required.';
  }

  if (password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} characters.`;
  }

  return null;
}

/**
 * Validates the sign-in form and returns a field error map.
 */
export function validateSignInForm({ email, password }) {
  const errors = {};
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  if (emailError) {
    errors.email = emailError;
  }

  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
}
