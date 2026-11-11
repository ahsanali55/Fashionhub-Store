'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { FiArrowLeft, FiLock } from 'react-icons/fi';
import { getErrorMessage } from '@/lib/utils';
import {
  getPasswordRecoveryQuestion,
  recoverPassword,
} from '@/services/auth.services';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState<string | null>(null);
  const [recoveryAnswer, setRecoveryAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [lookupComplete, setLookupComplete] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLookup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      const recoveryQuestion = await getPasswordRecoveryQuestion(email);
      setQuestion(recoveryQuestion);
      setLookupComplete(true);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to load your recovery question.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    if (newPassword.length < 8 || newPassword.length > 72 ||
      !/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setError('Use 8–72 characters with at least one letter and one number.');
      return;
    }

    setIsLoading(true);
    try {
      await recoverPassword({ email, recoveryAnswer, newPassword });
      setSuccess('Password reset successfully. You can now sign in with your new password.');
      setRecoveryAnswer('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to verify your answer and reset the password.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <FiLock className="h-5 w-5" />
        </span>
        <h1 className="text-center text-2xl font-bold">Reset your password</h1>
        <p className="mt-3 text-center text-sm leading-6 text-muted-foreground">
          Verify your recovery answer to choose a new password. No email reset link is required.
        </p>

        {!lookupComplete ? (
          <form onSubmit={handleLookup} className="mt-6 space-y-4">
            <div>
              <label htmlFor="recovery-email" className="mb-2 block text-sm font-medium">
                Account email
              </label>
              <input
                id="recovery-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                maxLength={254}
                required
                className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {isLoading ? 'Loading...' : 'Continue'}
            </button>
          </form>
        ) : question ? (
          <form onSubmit={handleReset} className="mt-6 space-y-4">
            <p className="rounded-lg border border-border bg-muted p-3 text-sm font-medium">
              {question}
            </p>
            <div>
              <label htmlFor="recovery-answer" className="mb-2 block text-sm font-medium">
                Your answer
              </label>
              <input
                id="recovery-answer"
                type="text"
                autoComplete="off"
                value={recoveryAnswer}
                onChange={(event) => setRecoveryAnswer(event.target.value)}
                maxLength={100}
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
            {success && <p role="status" className="text-sm text-green-700">{success}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {isLoading ? 'Resetting...' : 'Set new password'}
            </button>
          </form>
        ) : (
          <div className="mt-6 rounded-lg border border-border bg-muted p-4 text-sm leading-6 text-muted-foreground">
            No recovery question is configured for this account. If you are signed in on another device, set one in your profile. Otherwise, contact the store administrator for help.
          </div>
        )}

        {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
        <Link
          href="/login"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </section>
    </main>
  );
}
