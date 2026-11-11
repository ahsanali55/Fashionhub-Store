'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Pages/HomePage/Navbar';
import { CartDrawer } from '@/components/Reusable_Components/CartDrawer';
import { Footer } from '@/components/Pages/HomePage/Footer';
import { AuthInitializer } from '@/components/Reusable_Components/AuthInitializer';
import { Suspense } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { loadProducts } from '@/redux/slices/productsSlice';
import { WorkspaceShell } from '@/components/Workspace/WorkspaceShell';
import type { RootState } from '@/redux/store';

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAppSelector((state: RootState) => state.auth);
  const workspaceRole =
    auth.user?.role === 'admin' || auth.user?.role === 'supplier'
      ? auth.user.role
      : null;
  const requestedWorkspace = pathname.startsWith('/admin/')
    ? 'admin'
    : pathname.startsWith('/supplier/')
      ? 'supplier'
      : null;
  const isWorkspaceRoute = requestedWorkspace !== null;

  useEffect(() => {
    if (!workspaceRole || workspaceRole === 'supplier') {
      void dispatch(loadProducts());
    }
  }, [dispatch, workspaceRole]);

  useEffect(() => {
    if (workspaceRole) {
      if (requestedWorkspace !== workspaceRole) {
        router.replace(`/${workspaceRole}/dashboard`);
      }
      return;
    }

    if (isWorkspaceRoute) {
      router.replace(
        auth.isAuthenticated && auth.user?.role === 'customer'
          ? '/customer/dashboard'
          : '/login',
      );
    }
  }, [
    auth.isAuthenticated,
    auth.user?.role,
    isWorkspaceRoute,
    requestedWorkspace,
    router,
    workspaceRole,
  ]);

  const isAuthorizedWorkspace =
    workspaceRole !== null && workspaceRole === requestedWorkspace;

  return (
    <>
      <AuthInitializer />
      {isWorkspaceRoute ? (
        isAuthorizedWorkspace ? (
          <WorkspaceShell role={workspaceRole}>{children}</WorkspaceShell>
        ) : null
      ) : workspaceRole ? null : (
        <>
          <Suspense fallback={null}>
            <Navbar />
            <CartDrawer />
          </Suspense>
          {children}
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </>
      )}
    </>
  );
}
