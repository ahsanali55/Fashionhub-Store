'use client';

import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/lib/slices/authSlice';
import { RootState } from '@/lib/store';
import { FiLogOut } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface LogoutButtonProps {
  variant?: 'button' | 'icon' | 'full';
  className?: string;
}

export function LogoutButton({ variant = 'button', className = '' }: LogoutButtonProps) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('fh-auth');
    localStorage.removeItem('persist_auth');
    
    // Dispatch logout action
    dispatch(logout());
    
    // Redirect to home or login
    router.push('/login');
  };

  if (variant === 'icon') {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        className={`p-2 text-muted-foreground hover:text-foreground transition ${className}`}
        title="Logout"
      >
        <FiLogOut className="w-5 h-5" />
      </motion.button>
    );
  }

  if (variant === 'full') {
    return (
      <motion.button
        whileHover={{ backgroundColor: 'rgb(239, 68, 68)' }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        className={`flex items-center gap-2 px-4 py-2 bg-destructive text-white rounded-lg hover:opacity-90 transition ${className}`}
      >
        <FiLogOut className="w-4 h-4" />
        <span>Logout</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
      whileTap={{ scale: 0.95 }}
      onClick={handleLogout}
      className={`flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition ${className}`}
    >
      <FiLogOut className="w-4 h-4" />
      <span className="font-medium">Logout</span>
    </motion.button>
  );
}
