'use client';

import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { FiDollarSign, FiUsers, FiTrendingUp, FiShoppingBag } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BackButton } from '@/components/BackButton';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const revenueData = [
  { month: 'Jan', revenue: 42000, orders: 240 },
  { month: 'Feb', revenue: 38000, orders: 221 },
  { month: 'Mar', revenue: 52000, orders: 229 },
  { month: 'Apr', revenue: 48000, orders: 200 },
  { month: 'May', revenue: 61000, orders: 310 },
  { month: 'Jun', revenue: 55000, orders: 280 },
];

const categoryData = [
  { name: 'Jackets', value: 35 },
  { name: 'Dresses', value: 25 },
  { name: 'Shoes', value: 20 },
  { name: 'Others', value: 20 },
];

const COLORS = ['#d946ef', '#ec4899', '#f43f5e', '#0ea5e9'];

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const orders = useSelector((state: RootState) => state.orders);

  if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
    router.push('/login');
    return null;
  }

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <BackButton fallbackHref="/admin/dashboard" />
          <h1 className="text-4xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">Platform performance and insights</p>
        </motion.div>

        {/* KPIs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Revenue</p>
                <p className="text-4xl font-bold mt-2">$296K</p>
                <p className="text-green-600 text-sm mt-2">+18% from last month</p>
              </div>
              <FiDollarSign className="w-12 h-12 text-primary opacity-20" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Orders</p>
                <p className="text-4xl font-bold mt-2">1.5K</p>
                <p className="text-green-600 text-sm mt-2">+12% from last month</p>
              </div>
              <FiShoppingBag className="w-12 h-12 text-accent opacity-20" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Active Users</p>
                <p className="text-4xl font-bold mt-2">12.8K</p>
                <p className="text-green-600 text-sm mt-2">+24% from last month</p>
              </div>
              <FiUsers className="w-12 h-12 text-primary opacity-20" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Avg Order Value</p>
                <p className="text-4xl font-bold mt-2">$197</p>
                <p className="text-green-600 text-sm mt-2">+6% from last month</p>
              </div>
              <FiTrendingUp className="w-12 h-12 text-accent opacity-20" />
            </div>
          </motion.div>
        </motion.div>

        {/* Charts */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
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
                <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold mb-4">Orders by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
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
          </motion.div>

          <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm lg:col-span-2">
            <h3 className="text-lg font-bold mb-4">Orders Comparison</h3>
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
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
