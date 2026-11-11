'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiBox, FiDollarSign, FiShoppingCart } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BackButton } from '@/components/Reusable_Components/BackButton';
import { getSupplierAnalytics, type SupplierAnalytics } from '@/services/management.services';
import { getSupplierOrders, type Order } from '@/services/commerce.services';
import { useAppSelector } from '@/hooks/redux';
import type { RootState } from '@/redux/store';
import { formatPrice } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const COLORS = ['#d946ef', '#ec4899', '#f43f5e', '#0ea5e9'];

export default function SupplierAnalyticsPage() {
  const auth = useAppSelector((state: RootState) => state.auth);
  const products = useAppSelector((state: RootState) => state.products.items);
  const [analytics, setAnalytics] = useState<SupplierAnalytics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [requestError, setRequestError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([getSupplierAnalytics(), getSupplierOrders()])
      .then(([metrics, supplierOrders]) => {
        if (!active) return;
        setAnalytics(metrics);
        setOrders(supplierOrders);
      })
      .catch((error: unknown) => {
        if (active) setRequestError(error instanceof Error ? error.message : 'Unable to load analytics.');
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const revenueData = useMemo(() => {
    const monthly = new Map<string, { month: string; revenue: number; orders: number; timestamp: number }>();
    for (const order of orders) {
      const date = new Date(order.createdAt);
      if (Number.isNaN(date.getTime())) continue;
      const month = date.toLocaleString('en-PK', { month: 'short', year: 'numeric' });
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const current = monthly.get(monthKey) ?? { month, revenue: 0, orders: 0, timestamp: date.getTime() };
      current.revenue += order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      current.orders += 1;
      current.timestamp = Math.max(current.timestamp, date.getTime());
      monthly.set(monthKey, current);
    }
    return [...monthly.values()].sort((a, b) => a.timestamp - b.timestamp).slice(-6);
  }, [orders]);

  const categoryData = useMemo(() => {
    const categorySales = new Map<string, number>();
    for (const order of orders) {
      for (const item of order.items) {
        const category = products.find((product) => product.id === item.productId)?.category ?? 'Other';
        categorySales.set(category, (categorySales.get(category) ?? 0) + item.quantity);
      }
    }
    return [...categorySales].map(([name, value]) => ({ name, value }));
  }, [orders, products]);

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading analytics...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <BackButton fallbackHref="/supplier/dashboard" />
          <h1 className="text-4xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-2">Track your product sales and fulfillment.</p>
        </motion.div>

        {requestError && <p role="alert" className="mb-6 text-sm text-destructive">{requestError}</p>}

        {/* Key Metrics */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {[
            { label: 'Total revenue', value: analytics ? formatPrice(analytics.totalRevenue) : '—', note: 'Revenue from your products', icon: FiDollarSign },
            { label: 'Total orders', value: analytics?.totalOrders ?? '—', note: 'Orders containing your products', icon: FiShoppingCart },
            { label: 'Items sold', value: analytics?.totalItemsSold ?? '—', note: 'Total units sold', icon: FiBox },
            { label: 'Average product rating', value: analytics ? `${analytics.averageRating.toFixed(1)} / 5` : '—', note: 'Across your products', icon: FiTrendingUp },
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
          className="grid grid-cols-1 gap-5 lg:grid-cols-2"
        >
          {/* Revenue Chart */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
          >
            <h3 className="text-lg font-bold">Monthly sales performance</h3>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">Revenue and order volume</p>
            {revenueData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  yAxisId="revenue"
                  tickFormatter={(value) => formatPrice(Number(value))}
                />
                <YAxis yAxisId="orders" orientation="right" allowDecimals={false} />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'revenue' ? formatPrice(Number(value)) : value,
                    name === 'revenue' ? 'Revenue' : 'Orders',
                  ]}
                />
                <Legend />
                <Line yAxisId="revenue" type="monotone" dataKey="revenue" stroke="#d946ef" strokeWidth={2} />
                <Line yAxisId="orders" type="monotone" dataKey="orders" stroke="#ec4899" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            ) : <p className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">Sales trends will appear after your first order.</p>}
          </motion.div>

          {/* Category Sales */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
          >
            <h3 className="text-lg font-bold">Units sold by category</h3>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">Sales across your product categories</p>
            {categoryData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            ) : <p className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">Category sales will appear after your first order.</p>}
          </motion.div>

        </motion.div>
      </div>
    </main>
  );
}
