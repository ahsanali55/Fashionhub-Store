'use client';

import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { FiMail, FiUser, FiCamera, FiCalendar } from 'react-icons/fi';
import { useRef, useState } from 'react';
import { BackButton } from '@/components/Reusable_Components/BackButton';
import { ChangePasswordForm } from '@/components/Reusable_Components/ChangePasswordForm';
import { RecoveryQuestionForm } from '@/components/Reusable_Components/RecoveryQuestionForm';
import { setUser } from '@/redux/slices/features/auth/authSlice';
import { updateAvatar, updateProfile } from '@/services/auth.services';
import { getErrorMessage } from '@/lib/utils';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function getInitials(fullName?: string) {
  if (!fullName) return '?';
  const parts = fullName.trim().split(' ');
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export default function CustomerProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state: RootState) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(auth.user?.fullName || '');
  const [email, setEmail] = useState(auth.user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [profileError, setProfileError] = useState('');
  const profileImage = auth.user?.avatar;

  if (!auth.isAuthenticated || auth.user?.role !== 'customer') {
    router.push('/login');
    return null;
  }

  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
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

 const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
   event.preventDefault();
   setIsSaving(true);
   setProfileError('');
   try {
     const user = await updateProfile({ fullName, email });
     dispatch(setUser({ ...auth.user, ...user }));
     setIsEditing(false);
   } catch (error) {
     setProfileError(getErrorMessage(error, 'Unable to save your profile.'));
   } finally {
     setIsSaving(false);
   }
  };

  const handleCancel = () => {
    setFullName(auth.user?.fullName || '');
    setEmail(auth.user?.email || '');
    setProfileError('');
    setIsEditing(false);
  };

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="my-12 "
        >
          <BackButton fallbackHref="/customer/dashboard" alwaysNavigateToFallback />
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {/* Profile Card */}
          <motion.div
            variants={itemVariants}
            className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
          >
            <div className="p-8">
              <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
                {/* Avatar */}
                <div className="relative w-24 h-24 shrink-0">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={auth.user?.fullName}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
                      {getInitials(auth.user?.fullName)}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors duration-300 ring-2 ring-background disabled:opacity-50"
                    aria-label={isUploadingAvatar ? 'Uploading profile photo' : 'Change profile photo'}
                    title={isUploadingAvatar ? 'Uploading...' : 'Change photo'}
                  >
                    <FiCamera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImagePick}
                    className="hidden"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground">{auth.user?.fullName}</h2>
                  <p className="text-muted-foreground">{auth.user?.email}</p>
                  <p className="text-sm text-primary font-medium capitalize mt-1">Customer Account</p>
                </div>

                <button
                  onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-300 font-medium shrink-0"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {profileError && <p role="alert" className="mx-8 text-sm text-destructive">{profileError}</p>}

            {/* Edit Form or Read-only Info */}
            <div className="p-8 border-t border-border">
              <h3 className="text-lg font-semibold mb-6 text-foreground">Account Information</h3>

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Full Name</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-lg border border-border focus-within:ring-2 focus-within:ring-primary">
                      <FiUser className="text-muted-foreground w-4 h-4" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        minLength={3}
                        maxLength={80}
                        required
                        className="flex-1 bg-transparent focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-lg border border-border focus-within:ring-2 focus-within:ring-primary">
                      <FiMail className="text-muted-foreground w-4 h-4" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        maxLength={254}
                        required
                        className="flex-1 bg-transparent focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-300 font-medium"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <FiUser className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium text-foreground">{auth.user?.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <FiCalendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Member since</p>
                      <p className="font-medium text-foreground">
                        {auth.user?.createdAt && !Number.isNaN(Date.parse(auth.user.createdAt))
                          ? new Date(auth.user.createdAt).toLocaleDateString()
                          : 'Not available'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <FiMail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">{auth.user?.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <ChangePasswordForm />
          <RecoveryQuestionForm />
        </motion.div>
      </div>
    </main>
  );
}