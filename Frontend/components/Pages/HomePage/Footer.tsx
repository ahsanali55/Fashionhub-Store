'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FashionHubLogo } from '@/components/Reusable_Components/FashionHubLogo';

export function Footer() {
  const auth = useSelector((state: RootState) => state.auth);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isLoggedIn = isMounted && auth.isAuthenticated;
  const role = auth.user?.role;

  let accountLabel = 'Account';
  let accountLinks: { label: string; href: string }[] = [
    { label: 'Sign In', href: '/login' },
    { label: 'Create Account', href: '/register' },
    { label: 'Browse Products', href: '/shop' },
  ];

  if (isLoggedIn && role === 'customer') {
    accountLabel = 'My Account';
    accountLinks = [
      { label: 'Dashboard', href: '/customer/dashboard' },
      { label: 'My Orders', href: '/customer/orders' },
      { label: 'Wishlist', href: '/customer/wishlist' },
    ];
  } else if (isLoggedIn && role === 'supplier') {
    accountLabel = 'Supplier Tools';
    accountLinks = [
      { label: 'Dashboard', href: '/supplier/dashboard' },
      { label: 'My Products', href: '/supplier/products' },
      { label: 'Orders', href: '/supplier/orders' },
    ];
  } else if (isLoggedIn && role === 'admin') {
    accountLabel = 'Admin Tools';
    accountLinks = [
      { label: 'Dashboard', href: '/admin/dashboard' },
      { label: 'Manage Users', href: '/admin/users' },
      { label: 'Reports', href: '/admin/reports' },
    ];
  }

  return (
    <footer className="bg-[#18181B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <span className="text-xl font-extrabold tracking-tight">
                Fashion
                <span className="text-primary">Hub</span>
              </span>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-zinc-400">
              Discover fashion from trusted suppliers, explore products,
              and shop everything you love in one place.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Shop</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/shop" className="text-zinc-400 hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-zinc-400 hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-zinc-400 hover:text-primary transition-colors">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Account - dynamic by role */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">{accountLabel}</h3>
            <ul className="space-y-3 text-sm">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-zinc-400 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-500">
              © {new Date().getFullYear()} FashionHub. All rights reserved.
            </p>
            <p className="text-xs text-zinc-500">Fashion Marketplace</p>
          </div>
        </div>

      </div>
    </footer>
  );
}