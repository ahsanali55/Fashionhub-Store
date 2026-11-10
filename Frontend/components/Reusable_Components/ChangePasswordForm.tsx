'use client';

import { FormEvent, useState } from 'react';
import { changePassword } from '@/services/auth.services';
import { getErrorMessage } from '@/lib/utils';

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setIsSaving(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess('Your password has been changed.');
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to change your password.'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <h2 className="text-lg font-semibold">Change password</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Confirm your current password to set a new one.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-4">
        <div>
          <label htmlFor="current-password" className="mb-2 block text-sm font-medium">
            Current password
          </label>
          <input
            id="current-password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            maxLength={72}
            required
            className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="new-password" className="mb-2 block text-sm font-medium">
            New password
          </label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            minLength={8}
            maxLength={72}
            required
            className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            At least 8 characters, including a letter and a number.
          </p>
        </div>
        <div>
          <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium">
            Confirm new password
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength={8}
            maxLength={72}
            required
            className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        {success && <p role="status" className="text-sm text-green-700">{success}</p>}
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
        >
          {isSaving ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </section>
  );
}
