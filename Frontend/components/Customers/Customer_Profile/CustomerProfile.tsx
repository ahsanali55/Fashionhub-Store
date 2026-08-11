'use client';

import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { FiMail, FiPhone, FiMapPin, FiLogOut } from 'react-icons/fi';
import { useState } from 'react';
import { BackButton } from '@/components/Reusable_Components/BackButton';
import { logout } from '@/redux/slices/features/auth/authSlice';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CustomerProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  if (!auth.isAuthenticated || auth.user?.role !== 'customer') {
    router.push('/login');
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

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
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Profile Card */}
          <motion.div variants={itemVariants} className="bg-card rounded-lg shadow-sm overflow-hidden">
            <div className="p-8 border-b border-border">
              <div className="flex flex-col md:flex-row gap-6 md:items-center">
                <img
                  src={auth.user?.avatar}
                  alt={auth.user?.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{auth.user?.name}</h2>
                  <p className="text-muted-foreground mb-1">{auth.user?.email}</p>
                  <p className="text-sm text-primary font-medium capitalize">Customer Account</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition font-medium"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="p-8">
              <h3 className="text-lg font-semibold mb-6">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FiMail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{auth.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FiPhone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Info */}
            <div className="p-8 border-t border-border">
              <h3 className="text-lg font-semibold mb-6">Shipping Address</h3>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">123 Fashion Street</p>
                  <p className="text-muted-foreground text-sm">New York, NY 10001</p>
                  <p className="text-muted-foreground text-sm">United States</p>
                  <button className="mt-3 text-sm text-primary hover:text-accent font-medium transition">
                    Edit Address
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Account Settings */}
          <motion.div variants={itemVariants} className="bg-card rounded-lg shadow-sm p-8">
            <h3 className="text-lg font-semibold mb-6">Account Settings</h3>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-3 hover:bg-secondary rounded-lg transition">
                Change Password
              </button>
              <button className="w-full text-left px-4 py-3 hover:bg-secondary rounded-lg transition">
                Email Preferences
              </button>
              <button className="w-full text-left px-4 py-3 hover:bg-secondary rounded-lg transition">
                Privacy Settings
              </button>
            </div>
          </motion.div>

          {/* Logout Button */}
          <motion.button
            variants={itemVariants}
            onClick={handleLogout}
            className="w-full px-6 py-4 bg-destructive text-white rounded-lg hover:opacity-90 transition font-medium flex items-center justify-center gap-2"
          >
            <FiLogOut className="w-5 h-5" />
            Logout
          </motion.button>
        </motion.div>
      </div>
    </main>
  );
}
