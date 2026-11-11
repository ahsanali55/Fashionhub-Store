'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { RootState } from '@/redux/store';
import { loadCart } from '@/redux/slices/cartSlice';
import { loadWishlist } from '@/redux/slices/wishlistSlice';

export function AuthInitializer() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.role === 'customer') {
      void dispatch(loadCart());
      void dispatch(loadWishlist());
    }
  }, [auth.isAuthenticated, auth.user?.role, dispatch]);

  return null;
}
