'use client';

import { motion } from 'framer-motion';
import { FiArrowLeft, FiTrendingUp, FiUsers, FiDollarSign, FiShoppingCart } from 'react-icons/fi';
import Link from 'next/link';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

// Sample data
const revenueData = [
  { month: 'Jan', revenue: 4000, orders: 24 },
  { month: 'Feb', revenue: 3000, orders: 21 },
  { month: 'Mar', revenue: 2000, orders: 29 },
  { month: 'Apr', revenue: 2780, orders: 39 },
  { month: 'May', revenue: 1890, orders: 23 },
  { month: 'Jun', revenue: 2390, orders: 34 },
];

const categoryData = [
  { name: 'Jackets', value: 35 },
  { name: 'Dresses', value: 25 },
  { name: 'Shoes', value: 20 },
  { name: 'Others', value: 20 },
];

const COLORS = ['#d946ef', '#ec4899', '#f43f5e', '#0ea5e9'];

export default function AnalyticsPage() {
  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-primary hover:underline mb-6"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground mt-2">Track your sales performance and customer insights</p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Revenue</p>
                <p className="text-4xl font-bold mt-2">$18,140</p>
                <p className="text-green-600 text-sm mt-2">+12% from last month</p>
              </div>
              <FiDollarSign className="w-12 h-12 text-primary opacity-20" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Orders</p>
                <p className="text-4xl font-bold mt-2">456</p>
                <p className="text-green-600 text-sm mt-2">+8% from last month</p>
              </div>
              <FiShoppingCart className="w-12 h-12 text-accent opacity-20" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Customers</p>
                <p className="text-4xl font-bold mt-2">1,234</p>
                <p className="text-green-600 text-sm mt-2">+15% from last month</p>
              </div>
              <FiUsers className="w-12 h-12 text-primary opacity-20" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-card p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Avg Order Value</p>
                <p className="text-4xl font-bold mt-2">$39.78</p>
                <p className="text-green-600 text-sm mt-2">+5% from last month</p>
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Revenue Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-card p-6 rounded-lg shadow-sm"
          >
            <h3 className="text-xl font-bold mb-4">Revenue & Orders</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#d946ef" strokeWidth={2} />
                <Line type="monotone" dataKey="orders" stroke="#ec4899" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Sales */}
          <motion.div
            variants={itemVariants}
            className="bg-card p-6 rounded-lg shadow-sm"
          >
            <h3 className="text-xl font-bold mb-4">Sales by Category</h3>
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

          {/* Monthly Revenue */}
          <motion.div
            variants={itemVariants}
            className="bg-card p-6 rounded-lg shadow-sm lg:col-span-2"
          >
            <h3 className="text-xl font-bold mb-4">Monthly Revenue Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#d946ef" />
                <Bar dataKey="orders" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
