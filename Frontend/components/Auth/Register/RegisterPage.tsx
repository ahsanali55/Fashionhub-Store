'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { clearAuthError, register } from '@/redux/slices/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import { useAppDispatch } from '@/hooks/redux';
import { useAppSelector } from '@/hooks/redux';
import { recoveryQuestions } from '@/lib/recoveryQuestions';

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const authError = useAppSelector((state) => state.auth.error);
  const router = useRouter();
  const [fullName, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoveryQuestion, setRecoveryQuestion] = useState<string>(recoveryQuestions[0]);
  const [recoveryAnswer, setRecoveryAnswer] = useState('');
  const [role, setRole] = useState<'customer' | 'supplier'>('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8 || password.length > 72 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Use 8–72 characters with at least one letter and one number.');
      return;
    }

    setLoading(true);
    dispatch(clearAuthError());
    if (recoveryAnswer.trim().length < 3) {
      setError('Recovery answer must be at least 3 characters.');
      return;
    }

    const result = await dispatch(register({
      fullName,
      email,
      password,
      recoveryQuestion,
      recoveryAnswer: recoveryAnswer.trim(),
      role,
    }));
    setLoading(false);
    if (register.fulfilled.match(result)) {
      router.push(result.payload.role === 'supplier' ? '/supplier/dashboard' : '/customer/dashboard');
    } else {
      setError(result.payload ?? 'Unable to create your account.');
    }
  };

  return (
    <main className="bg-background min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-lg shadow-lg p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-muted-foreground">Join FashionHub and start shopping</p>
          </div>

          {/* Error Message */}
          {(error || authError) && (
            <div className="bg-destructive/10 border border-destructive text-destructive text-sm p-3 rounded-lg">
              {error || authError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-lg border border-border focus-within:ring-2 focus-within:ring-primary">
                <FiUser className="text-muted-foreground" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                    dispatch(clearAuthError());
                  }}
                  placeholder="John Doe"
                  className="flex-1 bg-transparent focus:outline-none text-sm"
                  minLength={3}
                  maxLength={80}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-lg border border-border focus-within:ring-2 focus-within:ring-primary">
                <FiMail className="text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                    dispatch(clearAuthError());
                  }}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent focus:outline-none text-sm"
                  autoComplete="email"
                  maxLength={254}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-lg border border-border focus-within:ring-2 focus-within:ring-primary">
                <FiLock className="text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                    dispatch(clearAuthError());
                  }}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent focus:outline-none text-sm"
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                  pattern="(?=.*[A-Za-z])(?=.*[0-9]).{8,72}"
                  required
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Use 8–72 characters with at least one letter and one number.</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-lg border border-border focus-within:ring-2 focus-within:ring-primary">
                <FiLock className="text-muted-foreground" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                    dispatch(clearAuthError());
                  }}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent focus:outline-none text-sm"
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {/* Role Selector */}
            <div>
              <label htmlFor="recovery-question" className="mb-2 block text-sm font-medium">
                Password recovery question
              </label>
              <select
                id="recovery-question"
                value={recoveryQuestion}
                onChange={(event) => setRecoveryQuestion(event.target.value)}
                className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                {recoveryQuestions.map((question) => (
                  <option key={question} value={question}>{question}</option>
                ))}
              </select>
              <label htmlFor="recovery-answer" className="mb-2 mt-4 block text-sm font-medium">
                Your answer
              </label>
              <input
                id="recovery-answer"
                type="text"
                value={recoveryAnswer}
                onChange={(event) => setRecoveryAnswer(event.target.value)}
                minLength={3}
                maxLength={100}
                autoComplete="off"
                className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <p className="mt-2 text-xs text-muted-foreground">
                You&apos;ll need this answer to reset your password. Answers are not case-sensitive.
              </p>
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">Account Type</label>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value as 'customer' | 'supplier');
                  setError('');
                  dispatch(clearAuthError());
                }}
                className="w-full px-4 py-3 bg-muted rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm"
              >
                <option value="customer">Customer (Buyer)</option>
                <option value="supplier">Supplier (Seller)</option>
              </select>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="rounded mt-1" required />
              <span>I confirm the account details I provided are accurate.</span>
            </label>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg hover:opacity-90 transition font-semibold disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
