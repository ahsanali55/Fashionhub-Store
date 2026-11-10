'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiBell, FiUser } from 'react-icons/fi';
import { BackButton } from '@/components/Reusable_Components/BackButton';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setUser } from '@/redux/slices/features/auth/authSlice';
import { updateNotificationPreference } from '@/services/auth.services';
import { getErrorMessage } from '@/lib/utils';

export default function CustomerSettingsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const notificationsEnabled = user?.notificationsEnabled ?? true;

  const handleNotificationToggle = async () => {
    if (!user || isSaving) return;
    setIsSaving(true);
    setError('');
    try {
      const enabled = await updateNotificationPreference(!notificationsEnabled);
      dispatch(setUser({ ...user, notificationsEnabled: enabled }));
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to save your notification preference.'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted/30 py-10 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <BackButton fallbackHref="/customer/dashboard" alwaysNavigateToFallback />
          <h1 className="mb-2 mt-6 text-3xl font-bold sm:text-4xl">Account settings</h1>
          <p className="text-muted-foreground">Manage your profile and order notifications.</p>
        </div>

        <div className="space-y-4">
          <section className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FiUser className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-semibold">Profile information</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Update your name, email address, and profile photo.
                </p>
              </div>
            </div>
            <Link
              href="/customer/profile"
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Manage profile
            </Link>
          </section>

          <section className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FiBell className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-semibold">Order notifications</h2>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                  {notificationsEnabled
                    ? 'Receive in-app updates when an order is placed or its status changes.'
                    : 'In-app order updates are currently turned off.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notificationsEnabled}
              aria-label="Order notifications"
              disabled={isSaving}
              onClick={() => void handleNotificationToggle()}
              className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition disabled:cursor-wait disabled:opacity-60 ${
                notificationsEnabled ? 'bg-primary' : 'bg-muted-foreground/40'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                  notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </section>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </div>
      </div>
    </main>
  );
}
