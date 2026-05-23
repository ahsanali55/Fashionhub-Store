'use client';

import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { FiUsers, FiPackage, FiBarChart2, FiAlertCircle, FiTrash2, FiEye } from 'react-icons/fi';
import Link from 'next/link';
import { useState } from 'react';

export default function AdminPage() {
  const auth = useSelector((state: RootState) => state.auth);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
    return (
      <main className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Unauthorized Access</p>
          <Link href="/login" className="text-primary hover:underline font-semibold">
            Go back to login
          </Link>
        </div>
      </main>
    );
  }

  const users = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'customer', status: 'active', joined: '2024-01-15' },
    { id: 2, name: 'John Smith', email: 'john@example.com', role: 'supplier', status: 'active', joined: '2024-02-20' },
    { id: 3, name: 'Mike Wilson', email: 'mike@example.com', role: 'customer', status: 'inactive', joined: '2023-12-10' },
    { id: 4, name: 'Emma Davis', email: 'emma@example.com', role: 'supplier', status: 'active', joined: '2024-03-05' },
    { id: 5, name: 'James Brown', email: '@example.com', role: 'admin', status: 'active', joined: '2024-01-30' },
  ];

  const products = [
    { id: 1, name: 'Premium Cotton Shirt', supplier: 'Fashion Plus', status: 'approved', sales: 234 },
    { id: 2, name: 'Classic Denim Jeans', supplier: 'Denim Co', status: 'pending', sales: 156 },
    { id: 3, name: 'Summer Dress', supplier: 'Fashion Plus', status: 'approved', sales: 89 },
    { id: 4, name: 'Winter Coat', supplier: 'Winter Wear', status: 'rejected', sales: 0 },
  ];

  const flaggedItems = [
    { id: 1, type: 'Product', reason: 'Counterfeit claim', severity: 'high', date: '2024-05-20' },
    { id: 2, type: 'Seller', reason: 'Policy violation', severity: 'medium', date: '2024-05-19' },
    { id: 3, type: 'Product', reason: 'Poor quality report', severity: 'medium', date: '2024-05-18' },
  ];

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between gap-6 bg-card p-8 rounded-lg shadow-sm border border-border">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage users, products, and platform</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Welcome</p>
              <p className="text-lg font-semibold">{auth.user?.name}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card p-6 rounded-lg shadow-sm border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Users</p>
                <p className="text-4xl font-bold mt-2">12,847</p>
              </div>
              <FiUsers className="w-12 h-12 text-primary opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card p-6 rounded-lg shadow-sm border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Active Sellers</p>
                <p className="text-4xl font-bold mt-2">2,341</p>
              </div>
              <FiPackage className="w-12 h-12 text-accent opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card p-6 rounded-lg shadow-sm border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Revenue</p>
                <p className="text-4xl font-bold mt-2">$487K</p>
              </div>
              <FiBarChart2 className="w-12 h-12 text-primary opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card p-6 rounded-lg shadow-sm border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Flagged Items</p>
                <p className="text-4xl font-bold mt-2">23</p>
              </div>
              <FiAlertCircle className="w-12 h-12 text-destructive opacity-20" />
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Users Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-card rounded-lg shadow-sm border border-border overflow-hidden"
          >
            <div className="border-b border-border p-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FiUsers className="w-5 h-5" />
                Recent Users
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary">
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-secondary transition">
                      <td className="px-6 py-4 text-sm font-medium">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                      <td className="px-6 py-4 text-sm capitalize">{user.role}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedUser(user.id.toString())}
                          className="text-primary hover:underline text-sm font-medium"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Flagged Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-lg shadow-sm border border-border p-6"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FiAlertCircle className="w-5 h-5 text-destructive" />
              Flagged Items
            </h3>
            <div className="space-y-3">
              {flaggedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-secondary rounded-lg hover:bg-border transition cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-semibold">{item.type}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      item.severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.severity}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.reason}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-card rounded-lg shadow-sm border border-border overflow-hidden"
        >
          <div className="border-b border-border p-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FiPackage className="w-5 h-5" />
              Products Awaiting Review
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary">
                  <th className="px-6 py-3 text-left text-sm font-semibold">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Supplier</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Sales</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-secondary transition">
                    <td className="px-6 py-4 text-sm font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{product.supplier}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        product.status === 'approved' ? 'bg-green-100 text-green-800' :
                        product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{product.sales}</td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button className="text-primary hover:underline text-xs font-medium">Approve</button>
                      <button className="text-destructive hover:underline text-xs font-medium">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
