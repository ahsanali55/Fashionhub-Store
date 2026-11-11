'use client';

import { motion } from 'framer-motion';
import { useAppSelector } from '@/hooks/redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { FiDollarSign, FiUsers, FiTrendingUp, FiShoppingBag } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BackButton } from '@/components/Reusable_Components/BackButton';
import { useEffect, useState } from 'react';
import { getAdminAnalytics, getTopProducts, type AdminAnalytics, type TopProduct } from '@/services/management.services';
import { formatPrice } from '@/lib/utils';
import { LoadingSpinner } from '@/components/Admin/Loaders/LoadingSpinner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const COLORS = ['#d946ef', '#ec4899', '#f43f5e', '#0ea5e9'];

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const auth = useAppSelector((state: RootState) => state.auth);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [requestError, setRequestError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
      router.push('/login');
      return;
    }
    let active = true;
    Promise.all([getAdminAnalytics(), getTopProducts()])
      .then(([metrics, products]) => {
        if (!active) return;
        setAnalytics(metrics);
        setTopProducts(products);
      })
      .catch((error: unknown) => {
        if (active) setRequestError(error instanceof Error ? error.message : 'Unable to load admin analytics.');
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [auth.isAuthenticated, auth.user?.role, router]);

  if (!auth.isAuthenticated || auth.user?.role !== 'admin') return null;
  if (isLoading) return <LoadingSpinner fullScreen size="lg" text="Loading analytics..." />;

  const revenueData = analytics?.ordersOverTime.map((item) => ({
    month: item._id,
    revenue: item.revenue,
    orders: item.count,
  })) ?? [];
  const productData = topProducts.map(({ name, totalSold }) => ({ name, value: totalSold }));
  const averageOrderValue = analytics?.totalOrders
    ? analytics.totalRevenue / analytics.totalOrders
    : 0;

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <BackButton fallbackHref="/admin/dashboard" />
          <h1 className="text-4xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">Platform performance and insights</p>
        </motion.div>

        {requestError && <p role="alert" className="mb-6 text-sm text-destructive">{requestError}</p>}

        {/* KPIs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {[
            { label: 'Total revenue', value: analytics ? formatPrice(analytics.totalRevenue) : '—', note: 'Platform sales revenue', icon: FiDollarSign },
            { label: 'Total orders', value: analytics?.totalOrders ?? '—', note: 'Recorded orders', icon: FiShoppingBag },
            { label: 'Active users', value: analytics?.totalUsers ?? '—', note: `${analytics?.totalSuppliers ?? 0} approved suppliers`, icon: FiUsers },
            { label: 'Average order value', value: formatPrice(averageOrderValue), note: 'Average order value', icon: FiTrendingUp },
          ].map(({ label, value, note, icon: Icon }) => (
            <motion.article key={label} variants={itemVariants} className="flex min-h-40 flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-10 items-start justify-between gap-3">
                <p className="text-sm font-medium leading-5 text-muted-foreground">{label}</p>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-2xl font-bold leading-tight tracking-tight tabular-nums sm:text-3xl" title={typeof value === 'string' ? value : undefined}>{value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{note}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Charts */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-2"
        >
          <motion.div variants={itemVariants} className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h3 className="mb-1 text-lg font-bold">Revenue trend</h3>
            <p className="mb-4 text-sm text-muted-foreground">Monthly platform sales in PKR</p>
            {revenueData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" tickFormatter={(value) => formatPrice(Number(value))} />
                <Tooltip
                  formatter={(value) => formatPrice(Number(value))}
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            ) : <p className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">Revenue trends will appear when orders are recorded.</p>}
          </motion.div>

          <motion.div variants={itemVariants} className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h3 className="mb-1 text-lg font-bold">Best-selling products</h3>
            <p className="mb-4 text-sm text-muted-foreground">Units sold across top products</p>
            {productData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            ) : <p className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">Product sales will appear after the first order.</p>}
          </motion.div>

          <motion.div variants={itemVariants} className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:col-span-2">
            <h3 className="mb-1 text-lg font-bold">Orders over time</h3>
            <p className="mb-4 text-sm text-muted-foreground">Monthly order volume</p>
            {revenueData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="orders" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            ) : <p className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">Order trends will appear when orders are recorded.</p>}
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
