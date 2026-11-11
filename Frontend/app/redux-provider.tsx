'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { fetchCurrentUser } from '@/redux/slices/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';

export function ReduxProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (authChecked) {
      return;
    }

    dispatch(fetchCurrentUser())
      .catch(() => undefined)
      .finally(() => setAuthChecked(true));
  }, [authChecked, dispatch]);

  if (!authChecked) {
    return null;
  }

  return <>{children}</>;
}