'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUsers, FiBox, FiBarChart2, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import { LogoutButton } from '@/components/LogoutButton';

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
  const orders = useSelector((state: RootState) => state.orders);
  const products = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [auth.isAuthenticated, auth.user?.role, router]);

  const totalRevenue = orders.items.reduce((sum, o) => sum + o.total, 0);

  if (!isAuthorized) {
    return null;
  }

  const adminLinks = [
    { label: 'User Management', icon: FiUsers, href: '/admin/users' },
    { label: 'Supplier Management', icon: FiBox, href: '/admin/suppliers' },
    { label: 'Product Approval', icon: FiBox, href: '/admin/products' },
    { label: 'Orders', icon: FiDollarSign, href: '/admin/orders' },
    { label: 'Analytics', icon: FiBarChart2, href: '/admin/analytics' },
    { label: 'Reports', icon: FiBarChart2, href: '/admin/reports' },
  ];

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Logout */}
        <div className="flex items-start justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, administrator</p>
          </motion.div>
          <LogoutButton variant="full" />
        </div>

        {/* Key Metrics */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <motion.div variants={itemVariants} className="bg-card rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Platform Revenue</p>
                <p className="text-4xl font-bold mt-2">${totalRevenue.toFixed(0)}K</p>
                <p className="text-green-600 text-sm mt-2">+24% this month</p>
              </div>
              <FiDollarSign className="w-12 h-12 text-primary opacity-20" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-card rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Orders</p>
                <p className="text-4xl font-bold mt-2">{orders.items.length}</p>
                <p className="text-primary text-sm mt-2">This month</p>
              </div>
              <FiBox className="w-12 h-12 text-accent opacity-20" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-card rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Products</p>
                <p className="text-4xl font-bold mt-2">{products.items.length}</p>
                <p className="text-muted-foreground text-sm mt-2">Active</p>
              </div>
              <FiBox className="w-12 h-12 text-primary opacity-20" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-card rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Avg Order Value</p>
                <p className="text-4xl font-bold mt-2">$197</p>
                <p className="text-green-600 text-sm mt-2">+6% from last month</p>
              </div>
              <FiBarChart2 className="w-12 h-12 text-accent opacity-20" />
            </div>
          </motion.div>
        </motion.div>

        {/* Admin Tools */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Management Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              return (
                <motion.div key={link.href} variants={itemVariants}>
                  <Link
                    href={link.href}
                    className="bg-card rounded-lg shadow-sm p-8 hover:shadow-md transition group block"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition mb-4">
                      <Icon className="w-6 h-6 text-primary group-hover:text-white transition" />
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition mb-2">{link.label}</h3>
                    <FiArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold mb-6">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="bg-card rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Database</h3>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-sm text-muted-foreground">All systems operational</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-card rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">API</h3>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-sm text-muted-foreground">Response time: 45ms</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-card rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Storage</h3>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-sm text-muted-foreground">68% capacity used</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
