'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { setUser, logout } from '@/lib/slices/authSlice';

export function AuthInitializer() {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Load auth state from localStorage on app initialization
    let savedAuth = localStorage.getItem('fh-auth');
    if (!savedAuth) {
      // Try alternate key for testing
      savedAuth = localStorage.getItem('persist_auth');
    }
    
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        if (parsedAuth.user && parsedAuth.isAuthenticated) {
          dispatch(setUser(parsedAuth.user));
        }
      } catch (err) {
        console.error('[v0] Failed to restore auth state:', err);
      }
    }
  }, [dispatch]);

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      localStorage.setItem('fh-auth', JSON.stringify({ user: auth.user, isAuthenticated: auth.isAuthenticated }));
    } else {
      localStorage.removeItem('fh-auth');
    }
  }, [auth.isAuthenticated, auth.user]);

  return null;
}
