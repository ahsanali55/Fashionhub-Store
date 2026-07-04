'use client';

import { Navbar } from '@/components/Pages/HomePage/Navbar';
import { CartDrawer } from '@/components/Reusable_Components/CartDrawer';
import { Footer } from '@/components/Pages/HomePage/Footer';
import { AuthInitializer } from '@/components/Reusable_Components/AuthInitializer';
import { Suspense } from 'react';

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthInitializer />
      <Suspense fallback={null}>
        <Navbar />
        <CartDrawer />
      </Suspense>
      {children}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
