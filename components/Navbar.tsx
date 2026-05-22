'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { toggleCart } from '@/lib/slices/cartSlice';
import { FiSearch, FiShoppingCart, FiMenu, FiX, FiHeart, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';

export function Navbar() {
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cart = useSelector((state: RootState) => state.cart);
  const auth = useSelector((state: RootState) => state.auth);
  const wishlist = useSelector((state: RootState) => state.wishlist);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">FashionHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-sm font-medium hover:text-primary transition">
              Shop
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary transition">
              Categories
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition">
              About
            </Link>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '200px' }}
              exit={{ opacity: 0, width: 0 }}
              className="hidden md:block"
            >
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </motion.div>
          )}

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden md:block p-2 hover:bg-secondary rounded-lg transition"
            >
              <FiSearch className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2 hover:bg-secondary rounded-lg transition">
              <FiHeart className="w-5 h-5" />
              {wishlist.items.length > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {wishlist.items.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2 hover:bg-secondary rounded-lg transition"
            >
              <FiShoppingCart className="w-5 h-5" />
              {cart.items.length > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
            </button>

            {/* Account */}
            <Link href={auth.isAuthenticated ? '/dashboard' : '/login'} className="p-2 hover:bg-secondary rounded-lg transition">
              <FiUser className="w-5 h-5" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition"
            >
              {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border py-4 space-y-2"
          >
            <Link href="/shop" className="block px-4 py-2 hover:bg-secondary rounded transition">
              Shop
            </Link>
            <Link href="/categories" className="block px-4 py-2 hover:bg-secondary rounded transition">
              Categories
            </Link>
            <Link href="/about" className="block px-4 py-2 hover:bg-secondary rounded transition">
              About
            </Link>
            <div className="px-4 py-2">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
