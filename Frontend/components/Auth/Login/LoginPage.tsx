'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/redux/slices/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock } from 'react-icons/fi';
import { RootState } from '@/redux/store';
import { useAppDispatch } from '@/hooks/redux';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'supplier' | 'admin'>('customer');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  setLoading(true);

  const result = await dispatch(
    login({
      email,
      password,
    })
  );

  setLoading(false);

  if (login.fulfilled.match(result)) {
    const user = result.payload;

    if (user.role === "customer") {
      router.push("/customer/dashboard");
    } else if (user.role === "supplier") {
      router.push("/supplier/dashboard");
    } else if (user.role === "admin") {
      router.push("/admin/dashboard");
    }
  }
};

  // const handleDemoLogin = (demoRole: 'customer' | 'supplier' | 'admin') => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     const demoUser = DEMO_USERS[demoRole];
  //     dispatch(login({ email: demoUser.email, password: 'demo', role: demoRole }));
  //     setLoading(false);
  //     // Route to correct dashboard based on role
  //     if (demoRole === 'customer') {
  //       router.push('/customer/dashboard');
  //     } else if (demoRole === 'supplier') {
  //       router.push('/supplier/dashboard');
  //     } else if (demoRole === 'admin') {
  //       router.push('/admin/dashboard');
  //     }
  //   }, 800);
  // };

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
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your FashionHub account</p>
          </div>

          {/* Error Message */}
          {auth.error && (
            <div className="bg-destructive/10 border border-destructive text-destructive text-sm p-3 rounded-lg">
              {auth.error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-lg border border-border focus-within:ring-2 focus-within:ring-primary">
                <FiMail className="text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent focus:outline-none text-sm"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-lg border border-border focus-within:ring-2 focus-within:ring-primary">
                <FiLock className="text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent focus:outline-none text-sm"
                  required
                />
              </div>
            </div>

            {/* Role Selector
            <div>
              <label className="block text-sm font-medium mb-2">Login As</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'customer' | 'supplier' | 'admin')}
                className="w-full px-4 py-3 bg-secondary rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm"
              >
                <option value="customer">Customer</option>
                <option value="supplier">Supplier</option>
                <option value="admin">Admin</option>
              </select>
            </div> */}

            {/* Remember Me & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg hover:opacity-90 transition font-semibold disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
