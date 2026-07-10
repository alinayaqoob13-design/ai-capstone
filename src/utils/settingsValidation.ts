/**
 * Validation rules for the settings form fields.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates the full name field.
 * @param fullName - User's full name
 * @returns Error message or null if valid
 */
export function validateFullName(fullName: string): string | null {
  const trimmed = fullName.trim();

  if (!trimmed) {
    return 'Full name is required';
  }

  if (trimmed.length < 2) {
    return 'Full name must be at least 2 characters';
  }

  return null;
}

/**
 * Validates the email field.
 * @param email - User's email address
 * @returns Error message or null if valid
 */
export function validateEmail(email: string): string | null {
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
 * @param password - User's password
 * @returns Error message or null if valid
 */
export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters with 1 uppercase letter and 1 number';
  }

  if (!/[A-Z]/.test(password)) {
    return 'Password must be at least 8 characters with 1 uppercase letter and 1 number';
  }

  if (!/\d/.test(password)) {
    return 'Password must be at least 8 characters with 1 uppercase letter and 1 number';
  }

  return null;
}

export type SettingsFormValues = {
  fullName: string;
  email: string;
  password: string;
};

export type SettingsFormErrors = {
  fullName: string | null;
  email: string | null;
  password: string | null;
};

export type SettingsFormField = keyof SettingsFormValues;

/**
 * Validates all settings form fields.
 * @param values - Current form values
 * @returns Validation errors per field
 */
export function validateSettingsForm(values: SettingsFormValues): SettingsFormErrors {
  return {
    fullName: validateFullName(values.fullName),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
  };
}

/**
 * Returns true when every field passes validation.
 * @param errors - Current validation errors
 * @returns Whether the form is valid
 */
export function isFormValid(errors: SettingsFormErrors): boolean {
  return !errors.fullName && !errors.email && !errors.password;
}
