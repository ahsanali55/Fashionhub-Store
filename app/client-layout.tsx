'use client';

import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { Suspense } from 'react';

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}
