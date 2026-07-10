import { useState } from 'react';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateSettingsForm,
  isFormValid,
} from '../utils/settingsValidation.js';
import './SettingsForm.css';

const INITIAL_VALUES = {
  name: '',
  email: '',
  password: '',
};

const INITIAL_TOUCHED = {
  name: false,
  email: false,
  password: false,
};

/**
 * Settings form with name, email, and password fields.
 * @param {{ onSubmit?: (values: { name: string, email: string, password: string }) => void | Promise<void> }} props
 */
export default function SettingsForm({ onSubmit }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState(INITIAL_TOUCHED);
  const [errors, setErrors] = useState({ name: null, email: null, password: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  /**
   * Validates a single field and updates error state.
   * @param {'name' | 'email' | 'password'} field
   * @param {string} value
   */
  const validateField = (field, value) => {
    const validators = {
      name: validateName,
      email: validateEmail,
      password: validatePassword,
    };

    setErrors((prev) => ({
      ...prev,
      [field]: validators[field](value),
    }));
  };

  /**
   * Handles input changes for controlled fields.
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      validateField(name, value);
    }
  };

  /**
   * Marks a field as touched and validates it on blur.
   * @param {React.FocusEvent<HTMLInputElement>} event
   */
  const handleBlur = (event) => {
    const { name, value } = event.target;

    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  /**
   * Validates all fields and submits when valid.
   * @param {React.FormEvent<HTMLFormElement>} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);

    const nextErrors = validateSettingsForm(values);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, password: true });

    if (!isFormValid(nextErrors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      };

      if (onSubmit) {
        await onSubmit(payload);
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit} noValidate>
      <header className="settings-form__header">
        <h2 className="settings-form__title">Account Settings</h2>
        <p className="settings-form__description">Update your profile information.</p>
      </header>

      <div className="settings-form__field">
        <label className="settings-form__label" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className={`settings-form__input${errors.name && touched.name ? ' settings-form__input--error' : ''}`}
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="name"
          aria-invalid={Boolean(errors.name && touched.name)}
          aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
        />
        {errors.name && touched.name && (
          <p id="name-error" className="settings-form__error" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="settings-form__field">
        <label className="settings-form__label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className={`settings-form__input${errors.email && touched.email ? ' settings-form__input--error' : ''}`}
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="email"
          aria-invalid={Boolean(errors.email && touched.email)}
          aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
        />
        {errors.email && touched.email && (
          <p id="email-error" className="settings-form__error" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className="settings-form__field">
        <label className="settings-form__label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className={`settings-form__input${errors.password && touched.password ? ' settings-form__input--error' : ''}`}
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password && touched.password)}
          aria-describedby={errors.password && touched.password ? 'password-error' : undefined}
        />
        {errors.password && touched.password && (
          <p id="password-error" className="settings-form__error" role="alert">
            {errors.password}
          </p>
        )}
      </div>

      {submitError && (
        <p className="settings-form__submit-error" role="alert">
          {submitError}
        </p>
      )}

      <button className="settings-form__submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );
}
