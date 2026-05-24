'use client';

import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiBox, FiHeart, FiDollarSign, FiUsers, FiPackage } from 'react-icons/fi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AdminReportsPage() {
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);

  if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
    router.push('/login');
    return null;
  }

  const reports = [
    { id: 1, name: 'Sales Report', description: 'Monthly sales analysis and trends', icon: FiDollarSign },
    { id: 2, name: 'User Report', description: 'Active users and engagement metrics', icon: FiUsers },
    { id: 3, name: 'Product Report', description: 'Product performance and inventory', icon: FiPackage },
    { id: 4, name: 'Order Report', description: 'Order status and fulfillment data', icon: FiBox },
  ];

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:text-accent mb-6 transition"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-4xl font-bold mb-2">Reports</h1>
          <p className="text-muted-foreground">Generate and view platform reports</p>
        </motion.div>

        {/* Reports Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <motion.div
                key={report.id}
                variants={itemVariants}
                className="bg-card p-8 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition">
                    <Icon className="w-6 h-6 text-primary group-hover:text-white transition" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{report.name}</h3>
                    <p className="text-muted-foreground text-sm">{report.description}</p>
                    <button className="mt-4 text-primary hover:text-accent font-medium text-sm transition">
                      Generate Report →
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Recent Reports */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-12"
        >
          <h2 className="text-2xl font-bold mb-6">Recent Reports</h2>
          <div className="bg-card rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Report Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((idx) => (
                  <motion.tr
                    key={idx}
                    variants={itemVariants}
                    className="border-b border-border hover:bg-secondary transition"
                  >
                    <td className="px-6 py-4 font-medium">Sales Report - {new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                        Monthly
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-primary hover:text-accent font-medium transition">Download</button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
