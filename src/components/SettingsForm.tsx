import { useMemo, useRef, useState } from 'react';
import {
  validateFullName,
  validateEmail,
  validatePassword,
  validateSettingsForm,
  isFormValid,
  type SettingsFormField,
  type SettingsFormValues,
} from '../utils/settingsValidation';
import './SettingsForm.css';

const INITIAL_VALUES: SettingsFormValues = {
  fullName: '',
  email: '',
  password: '',
};

const INITIAL_TOUCHED: Record<SettingsFormField, boolean> = {
  fullName: false,
  email: false,
  password: false,
};

const FIELD_ORDER: SettingsFormField[] = ['fullName', 'email', 'password'];

const FIELD_VALIDATORS = {
  fullName: validateFullName,
  email: validateEmail,
  password: validatePassword,
} as const;

type SettingsFormProps = {
  onSubmit?: (values: SettingsFormValues) => void | Promise<void>;
};

/**
 * Settings form with full name, email, and password fields.
 * @param props - Component props
 * @param props.onSubmit - Optional callback when the form is submitted successfully
 */
export default function SettingsForm({ onSubmit }: SettingsFormProps) {
  const [values, setValues] = useState<SettingsFormValues>(INITIAL_VALUES);
  const [touched, setTouched] = useState(INITIAL_TOUCHED);
  const [errors, setErrors] = useState<Record<SettingsFormField, string | null>>({
    fullName: null,
    email: null,
    password: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fieldRefs = {
    fullName: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
  };

  const currentErrors = useMemo(() => validateSettingsForm(values), [values]);
  const formIsValid = useMemo(() => isFormValid(currentErrors), [currentErrors]);

  /**
   * Validates a single field and updates error state.
   * @param field - Field name to validate
   * @param value - Current field value
   */
  const validateField = (field: SettingsFormField, value: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: FIELD_VALIDATORS[field](value),
    }));
  };

  /**
   * Focuses the first field that has a validation error.
   * @param nextErrors - Validation errors to inspect
   */
  const focusFirstInvalidField = (nextErrors: Record<SettingsFormField, string | null>) => {
    const firstInvalidField = FIELD_ORDER.find((field) => nextErrors[field]);

    if (firstInvalidField) {
      fieldRefs[firstInvalidField].current?.focus();
    }
  };

  /**
   * Handles input changes for controlled fields.
   * @param event - Change event from an input
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const field = name as SettingsFormField;

    setValues((prev) => ({ ...prev, [field]: value }));
    setSuccessMessage(null);

    if (touched[field]) {
      validateField(field, value);
    }
  };

  /**
   * Marks a field as touched and validates it on blur.
   * @param event - Blur event from an input
   */
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const field = name as SettingsFormField;

    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  /**
   * Validates all fields and submits when valid.
   * @param event - Form submit event
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage(null);

    const nextErrors = validateSettingsForm(values);
    setErrors(nextErrors);
    setTouched({ fullName: true, email: true, password: true });

    if (!isFormValid(nextErrors)) {
      focusFirstInvalidField(nextErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: SettingsFormValues = {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
      };

      if (onSubmit) {
        await onSubmit(payload);
      }

      setSuccessMessage('Settings saved successfully.');
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
        <label className="settings-form__label" htmlFor="fullName">
          Full Name
        </label>
        <input
          ref={fieldRefs.fullName}
          id="fullName"
          name="fullName"
          type="text"
          className={`settings-form__input${errors.fullName && touched.fullName ? ' settings-form__input--error' : ''}`}
          value={values.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="name"
          aria-invalid={Boolean(errors.fullName && touched.fullName)}
          aria-describedby={errors.fullName && touched.fullName ? 'fullName-error' : undefined}
        />
        {errors.fullName && touched.fullName && (
          <p id="fullName-error" className="settings-form__error" role="alert">
            {errors.fullName}
          </p>
        )}
      </div>

      <div className="settings-form__field">
        <label className="settings-form__label" htmlFor="email">
          Email
        </label>
        <input
          ref={fieldRefs.email}
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
          ref={fieldRefs.password}
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

      {successMessage && (
        <p className="settings-form__success" role="status">
          {successMessage}
        </p>
      )}

      <button
        className="settings-form__submit"
        type="submit"
        disabled={!formIsValid || isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );
}
