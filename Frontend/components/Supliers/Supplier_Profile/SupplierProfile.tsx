'use client';

import { motion } from 'framer-motion';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { setUser } from '@/redux/slices/features/auth/authSlice';
import { FiCamera, FiMail } from 'react-icons/fi';
import { useRef, useState } from 'react';
import { BackButton } from '@/components/Reusable_Components/BackButton';
import { ChangePasswordForm } from '@/components/Reusable_Components/ChangePasswordForm';
import { RecoveryQuestionForm } from '@/components/Reusable_Components/RecoveryQuestionForm';
import { SupplierProfileForm } from '@/components/Reusable_Components/SupplierProfileForm';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateAvatar, updateProfile } from '@/services/auth.services';
import { getErrorMessage } from '@/lib/utils';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SupplierProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state: RootState) => state.auth);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [profileError, setProfileError] = useState('');

  if (!auth.isAuthenticated || auth.user?.role !== 'supplier') {
    router.push('/login');
    return null;
  }

  const handleSaveProfile = async (formData: {
    fullName: string;
    email: string;
  }) => {
    const updatedUser = await updateProfile(formData);
    dispatch(setUser(updatedUser));
  };

  const handleAvatarPick = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setProfileError('Choose a JPG, PNG, WebP, or GIF image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setProfileError('Profile images must be 5 MB or smaller.');
      return;
    }
    setProfileError('');
    setIsUploadingAvatar(true);
    try {
      const avatar = await updateAvatar(file);
      if (auth.user) dispatch(setUser({ ...auth.user, avatar }));
    } catch (error) {
      setProfileError(getErrorMessage(error, 'Unable to update your photo.'));
    } finally {
      setIsUploadingAvatar(false);
    }
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
          <BackButton fallbackHref="/supplier/dashboard" />
          <h1 className="text-4xl font-bold mb-2">Supplier Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {profileError && <p role="alert" className="text-sm text-destructive">{profileError}</p>}
          {!isEditing ? (
            <>
              {/* Profile Card */}
              <motion.div variants={itemVariants} className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                <div className="p-8 border-b border-border">
                  <div className="flex flex-col md:flex-row gap-6 md:items-center">
                    <div className="relative w-24 h-24 shrink-0">
                      {auth.user?.avatar ? (
                        <img
                          src={auth.user.avatar}
                          alt={auth.user.fullName}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-2xl font-semibold">
                          {auth.user?.fullName?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                        aria-label={isUploadingAvatar ? 'Uploading profile photo' : 'Change profile photo'}
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center ring-2 ring-background disabled:opacity-50"
                      >
                        <FiCamera className="w-4 h-4" />
                      </button>
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleAvatarPick}
                        className="hidden"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">{auth.user?.fullName}</h2>
                      <p className="text-muted-foreground mb-1">{auth.user?.email}</p>
                      <p className="text-sm text-primary font-medium">Supplier account</p>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition font-medium"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>

                {/* Account Info */}
                <div className="p-8">
                  <h3 className="text-lg font-semibold mb-6">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Full name</p>
                      <p className="font-medium">{auth.user?.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Member since</p>
                      <p className="font-medium">
                        {auth.user?.createdAt && !Number.isNaN(Date.parse(auth.user.createdAt))
                          ? new Date(auth.user.createdAt).toLocaleDateString()
                          : 'Not available'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="p-8 border-t border-border">
                  <h3 className="text-lg font-semibold mb-6">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FiMail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{auth.user?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <ChangePasswordForm />
              <RecoveryQuestionForm />
            </>
          ) : (
            <SupplierProfileForm
              initialData={{
                fullName: auth.user?.fullName || '',
                email: auth.user?.email || '',
              }}
              onSave={handleSaveProfile}
              onCancel={() => setIsEditing(false)}
            />
          )}
        </motion.div>
      </div>
    </main>
  );
}
