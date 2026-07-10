/**
 * Validation rules for the settings form fields.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_PATTERN = /^[a-zA-Z\s'-]{2,50}$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

/**
 * Validates the name field.
 * @param {string} name
 * @returns {string|null} Error message or null if valid
 */
export function validateName(name) {
  const trimmed = name.trim();

  if (!trimmed) {
    return 'Name is required';
  }

  if (!NAME_PATTERN.test(trimmed)) {
    return 'Name must be 2-50 characters and contain only letters, spaces, hyphens, or apostrophes';
  }

  return null;
}

/**
 * Validates the email field.
 * @param {string} email
 * @returns {string|null} Error message or null if valid
 */
export function validateEmail(email) {
  const trimmed = email.trim();

  if (!trimmed) {
    return 'Email is required';
  }

  if (!EMAIL_PATTERN.test(trimmed)) {
    return 'Enter a valid email address';
  }

  return null;
}

/**
 * Validates the password field.
 * @param {string} password
 * @returns {string|null} Error message or null if valid
 */
export function validatePassword(password) {
  if (!password) {
    return 'Password is required';
  }

  if (!PASSWORD_PATTERN.test(password)) {
    return 'Password must be at least 8 characters with uppercase, lowercase, and a number';
  }

  return null;
}

/**
 * Validates all settings form fields.
 * @param {{ name: string, email: string, password: string }} values
 * @returns {{ name: string|null, email: string|null, password: string|null }}
 */
export function validateSettingsForm(values) {
  return {
    name: validateName(values.name),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
  };
}

/**
 * Returns true when every field passes validation.
 * @param {{ name: string|null, email: string|null, password: string|null }} errors
 * @returns {boolean}
 */
export function isFormValid(errors) {
  return !errors.name && !errors.email && !errors.password;
}
