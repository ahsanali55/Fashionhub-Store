'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { FiBox, FiDollarSign, FiBarChart2 } from 'react-icons/fi';
import { LoadingSpinner } from '@/components/Admin/Loaders/LoadingSpinner';
import {
  getAdminAnalytics,
  getAllProductsForManagement,
  type AdminAnalytics,
} from '@/services/management.services';
import { formatPrice } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [requestError, setRequestError] = useState('');

  useEffect(() => {
    if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
      router.push('/login');
    } else {
      setIsAuthorized(true);
      let active = true;
      Promise.all([getAdminAnalytics(), getAllProductsForManagement()])
        .then(([data, productRecords]) => {
          if (!active) return;
          setAnalytics(data);
          setTotalProducts(productRecords.length);
        })
        .catch((error: unknown) => {
          if (active) setRequestError(error instanceof Error ? error.message : 'Unable to load dashboard data.');
        })
        .finally(() => { if (active) setIsLoading(false); });
      return () => { active = false; };
    }
  }, [auth.isAuthenticated, auth.user?.role, router]);

  if (!isAuthorized) {
    return null;
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen size="lg" text="Loading admin dashboard..." />;
  }

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back{auth.user?.fullName ? `, ${auth.user.fullName}` : ''}.
            </p>
          </motion.div>
        </div>

        {requestError && <p role="alert" className="mb-6 text-sm text-destructive">{requestError}</p>}

        {/* Key Metrics */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 mb-12"
        >
          <motion.div variants={itemVariants} className="flex min-h-44 flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-10 items-start justify-between gap-3">
              <p className="text-sm font-medium leading-5 text-muted-foreground">Gross Sales</p>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FiDollarSign className="h-5 w-5" />
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-2xl font-bold leading-tight tracking-tight tabular-nums sm:text-3xl" title={analytics ? formatPrice(analytics.totalRevenue) : undefined}>
                {analytics ? formatPrice(analytics.totalRevenue) : '—'}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Value of recorded orders</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex min-h-44 flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-10 items-start justify-between gap-3">
              <p className="text-sm font-medium leading-5 text-muted-foreground">Total Orders</p>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <FiBox className="h-5 w-5" />
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-2xl font-bold leading-tight tracking-tight tabular-nums sm:text-3xl">{analytics?.totalOrders ?? '—'}</p>
              <p className="mt-2 text-sm text-muted-foreground">All platform orders</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex min-h-44 flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-10 items-start justify-between gap-3">
              <p className="text-sm font-medium leading-5 text-muted-foreground">Total Products</p>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FiBox className="h-5 w-5" />
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-2xl font-bold leading-tight tracking-tight tabular-nums sm:text-3xl">{totalProducts ?? '—'}</p>
              <p className="mt-2 text-sm text-muted-foreground">Listed products</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex min-h-44 flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-10 items-start justify-between gap-3">
              <p className="text-sm font-medium leading-5 text-muted-foreground">Average Order Value</p>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <FiBarChart2 className="h-5 w-5" />
              </span>
            </div>
            <div className="min-w-0">
              <p
                className="truncate text-2xl font-bold leading-tight tracking-tight tabular-nums sm:text-3xl"
                title={analytics?.totalOrders ? formatPrice(analytics.totalRevenue / analytics.totalOrders) : undefined}
              >
                {analytics?.totalOrders
                  ? formatPrice(analytics.totalRevenue / analytics.totalOrders)
                  : '—'}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Average order value</p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </main>
  );
}
