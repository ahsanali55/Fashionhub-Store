'use client';

import { motion } from 'framer-motion';
import { useAppSelector } from '@/hooks/redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { FiSearch, FiCheckCircle } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { BackButton } from '@/components/Reusable_Components/BackButton';
import { getUsers, setUserActive, type AdminUser } from '@/services/management.services';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'customer' | 'supplier' | 'admin';
  isActive: boolean;
  createdAt: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AdminUsersManagementPage() {
  const router = useRouter();
  const auth = useAppSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
      router.push('/login');
    } else {
      setIsAuthorized(true);
      let active = true;
      getUsers()
        .then((data: AdminUser[]) => {
          if (active) setUsers(data.map((user) => ({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
          })));
        })
        .catch((error: unknown) => {
          if (active) setRequestError(error instanceof Error ? error.message : 'Unable to load users.');
        });
      return () => { active = false; };
    }
  }, [auth.isAuthenticated, auth.user?.role, router]);

  if (!isAuthorized) {
    return null;
  }

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusToggle = async (user: User) => {
    setUpdatingId(user.id);
    setRequestError('');
    try {
      const updated = await setUserActive(user.id, !user.isActive);
      setUsers((current) => current.map((item) => item.id === user.id
        ? { ...item, isActive: updated.isActive }
        : item));
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'Unable to update user status.');
    } finally {
      setUpdatingId(null);
    }
  };

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
          <h1 className="text-4xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage all platform users</p>
        </motion.div>

        {requestError && <p role="alert" className="mb-6 text-sm text-destructive">{requestError}</p>}

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-card rounded-lg shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    variants={itemVariants}
                    className="border-b border-border hover:bg-secondary transition"
                  >
                    <td className="px-6 py-4 font-medium">{user.fullName}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {user.isActive ? 'active' : 'suspended'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => void handleStatusToggle(user)}
                        disabled={updatingId === user.id}
                        className="px-3 py-1 hover:bg-border rounded-lg transition text-primary hover:text-accent disabled:opacity-50"
                      >
                        {updatingId === user.id ? 'Saving...' : user.isActive ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
          <p className="text-sm text-muted-foreground">
            Showing {filteredUsers.length} users
          </p>
        </motion.div>

      </div>
    </main>
  );
}
