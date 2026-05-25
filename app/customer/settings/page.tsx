'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiSun, FiMoon, FiBell, FiLock } from 'react-icons/fi';
import { BackButton } from '@/components/BackButton';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SettingsPage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <BackButton fallbackHref="/customer/dashboard" />
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences and account</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Appearance */}
          <motion.div variants={itemVariants} className="bg-card rounded-lg shadow-sm p-8">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <FiSun className="w-5 h-5 text-primary" />
              Appearance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Use dark theme for the application</p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-7 rounded-full transition flex items-center px-1 ${
                    darkMode ? 'bg-primary' : 'bg-secondary'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transition ${
                      darkMode ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div variants={itemVariants} className="bg-card rounded-lg shadow-sm p-8">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <FiBell className="w-5 h-5 text-primary" />
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive push notifications for orders</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-7 rounded-full transition flex items-center px-1 ${
                    notifications ? 'bg-primary' : 'bg-secondary'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transition ${
                      notifications ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Updates</p>
                  <p className="text-sm text-muted-foreground">Receive promotional emails and updates</p>
                </div>
                <button
                  onClick={() => setEmailUpdates(!emailUpdates)}
                  className={`w-12 h-7 rounded-full transition flex items-center px-1 ${
                    emailUpdates ? 'bg-primary' : 'bg-secondary'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transition ${
                      emailUpdates ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Security */}
          <motion.div variants={itemVariants} className="bg-card rounded-lg shadow-sm p-8">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <FiLock className="w-5 h-5 text-primary" />
              Security
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 hover:bg-secondary rounded-lg transition font-medium">
                Change Password
              </button>
              <button className="w-full text-left px-4 py-3 hover:bg-secondary rounded-lg transition font-medium">
                Two-Factor Authentication
              </button>
              <button className="w-full text-left px-4 py-3 hover:bg-secondary rounded-lg transition font-medium">
                Active Sessions
              </button>
            </div>
          </motion.div>

          {/* Privacy */}
          <motion.div variants={itemVariants} className="bg-card rounded-lg shadow-sm p-8">
            <h3 className="text-lg font-semibold mb-6">Privacy</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 hover:bg-secondary rounded-lg transition font-medium">
                Privacy Policy
              </button>
              <button className="w-full text-left px-4 py-3 hover:bg-secondary rounded-lg transition font-medium">
                Terms of Service
              </button>
              <button className="w-full text-left px-4 py-3 hover:bg-secondary rounded-lg transition font-medium">
                Cookie Settings
              </button>
            </div>
          </motion.div>

          {/* Data */}
          <motion.div variants={itemVariants} className="bg-card rounded-lg shadow-sm p-8">
            <h3 className="text-lg font-semibold mb-6">Data & Account</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 hover:bg-secondary rounded-lg transition font-medium">
                Download Your Data
              </button>
              <button className="w-full text-left px-4 py-3 hover:bg-secondary rounded-lg transition font-medium text-destructive">
                Delete Account
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
