'use client';

import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { FiArrowLeft, FiUser, FiLock, FiBell, FiShield, FiCreditCard } from 'react-icons/fi';
import Link from 'next/link';
import { useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function SettingsPage() {
  const auth = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'password', label: 'Password', icon: FiLock },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'billing', label: 'Billing', icon: FiCreditCard },
  ];

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <h1 className="text-4xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account preferences and security</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1"
          >
            <div className="bg-card rounded-lg shadow-sm p-4 sticky top-20">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const TabIcon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      variants={itemVariants}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        activeTab === tab.id
                          ? 'bg-primary text-white'
                          : 'text-foreground hover:bg-secondary'
                      }`}
                    >
                      <TabIcon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:col-span-3"
          >
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-card rounded-lg shadow-sm p-8 space-y-8">
                <h2 className="text-2xl font-bold">Profile Information</h2>

                <div className="flex items-center gap-6">
                  <img
                    src={auth.user?.avatar}
                    alt={auth.user?.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <button className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition">
                    Change Avatar
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue={auth.user?.name}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={auth.user?.email}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      defaultValue={auth.user?.phone}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Account Type</label>
                    <input
                      type="text"
                      defaultValue={auth.user?.role.charAt(0).toUpperCase() + auth.user?.role.slice(1)}
                      disabled
                      className="w-full px-4 py-2 border border-border rounded-lg bg-secondary"
                    />
                  </div>
                </div>

                <button className="px-8 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition font-medium">
                  Save Changes
                </button>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="bg-card rounded-lg shadow-sm p-8 space-y-6">
                <h2 className="text-2xl font-bold">Change Password</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>

                <button className="px-8 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition font-medium">
                  Update Password
                </button>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-card rounded-lg shadow-sm p-8 space-y-6">
                <h2 className="text-2xl font-bold">Notification Preferences</h2>

                <div className="space-y-4">
                  {[
                    { label: 'Order Updates', desc: 'Get notified about order status changes' },
                    { label: 'New Products', desc: 'Receive updates about new arrivals' },
                    { label: 'Promotions', desc: 'Exclusive offers and discounts' },
                    { label: 'Account Security', desc: 'Important security alerts' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                    </div>
                  ))}
                </div>

                <button className="px-8 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition font-medium">
                  Save Preferences
                </button>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-card rounded-lg shadow-sm p-8 space-y-8">
                <h2 className="text-2xl font-bold">Security Settings</h2>

                <div className="space-y-4">
                  <div className="p-4 bg-secondary rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground mt-1">Add extra security to your account</p>
                      </div>
                      <button className="px-4 py-2 border border-border rounded-lg hover:bg-border transition">
                        Enable
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-secondary rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">Active Sessions</p>
                        <p className="text-sm text-muted-foreground mt-1">Manage your active login sessions</p>
                      </div>
                      <button className="px-4 py-2 border border-border rounded-lg hover:bg-border transition">
                        View
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-secondary rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">Login Activity</p>
                        <p className="text-sm text-muted-foreground mt-1">See recent login attempts</p>
                      </div>
                      <button className="px-4 py-2 border border-border rounded-lg hover:bg-border transition">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="bg-card rounded-lg shadow-sm p-8 space-y-8">
                <h2 className="text-2xl font-bold">Billing Information</h2>

                <div className="space-y-4">
                  <div className="p-4 bg-secondary rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">Payment Methods</p>
                        <p className="text-sm text-muted-foreground mt-1">Manage your saved payment methods</p>
                      </div>
                      <button className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition">
                        Add Card
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-secondary rounded-lg">
                    <div>
                      <p className="font-medium mb-2">Billing Address</p>
                      <input
                        type="text"
                        placeholder="Enter your address"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button className="px-8 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition font-medium">
                  Save Billing Info
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
