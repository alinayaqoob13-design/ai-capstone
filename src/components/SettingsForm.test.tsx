import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingsForm from './SettingsForm';

describe('SettingsForm', () => {
  it('renders all fields with accessible labels', () => {
    render(<SettingsForm />);

    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save Settings' })).toBeDisabled();
  });

  it('shows validation errors on blur', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await user.click(screen.getByLabelText('Full Name'));
    await user.tab();

    expect(await screen.findByText('Full name is required')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Full Name')).toHaveAttribute('aria-describedby', 'fullName-error');
  });

  it('validates full name minimum length on blur', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    const fullNameInput = screen.getByLabelText('Full Name');
    await user.type(fullNameInput, 'A');
    await user.tab();

    expect(await screen.findByText('Full name must be at least 2 characters')).toBeInTheDocument();
  });

  it('validates email format on blur', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    const emailInput = screen.getByLabelText('Email');
    await user.type(emailInput, 'not-an-email');
    await user.tab();

    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');
  });

  it('validates password requirements on blur', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    const passwordInput = screen.getByLabelText('Password');
    await user.type(passwordInput, 'short');
    await user.tab();

    expect(
      await screen.findByText(
        'Password must be at least 8 characters with 1 uppercase letter and 1 number',
      ),
    ).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('aria-describedby', 'password-error');
  });

  it('enables submit only when all fields are valid', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    const submitButton = screen.getByRole('button', { name: 'Save Settings' });
    expect(submitButton).toBeDisabled();

    await user.type(screen.getByLabelText('Full Name'), 'Jane Doe');
    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password1');

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it('shows success message on submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SettingsForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Full Name'), 'Jane Doe');
    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password1');
    await user.click(screen.getByRole('button', { name: 'Save Settings' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Settings saved successfully.');
    expect(onSubmit).toHaveBeenCalledWith({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'Password1',
    });
  });

  it('focuses the first invalid field on submit attempt', async () => {
    const user = userEvent.setup();
    const { container } = render(<SettingsForm />);

    await user.type(screen.getByLabelText('Full Name'), 'Jane Doe');
    await user.type(screen.getByLabelText('Email'), 'invalid-email');
    await user.type(screen.getByLabelText('Password'), 'Password1');

    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    fireEvent.submit(form!);

    const emailInput = screen.getByLabelText('Email');
    await waitFor(() => {
      expect(emailInput).toHaveFocus();
    });
    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
  });
});
