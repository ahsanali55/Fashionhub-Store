'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { toggleCart } from '@/lib/slices/cartSlice';
import { FiSearch, FiShoppingCart, FiMenu, FiX, FiHeart, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { LogoutButton } from './LogoutButton';

export function Navbar() {
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cart = useSelector((state: RootState) => state.cart);
  const auth = useSelector((state: RootState) => state.auth);
  const wishlist = useSelector((state: RootState) => state.wishlist);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navbarClasses = scrolled 
    ? 'bg-card/95 backdrop-blur-md border-b border-border/50 shadow-md' 
    : 'bg-transparent backdrop-blur-sm border-b border-transparent';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg group-hover:shadow-lg transition">
              F
            </div>
            <span className="font-bold text-xl hidden sm:inline text-primary">FashionHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            <Link href="/shop" className="text-sm font-semibold text-foreground hover:text-accent transition relative group">
              Shop
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/categories" className="text-sm font-semibold text-foreground hover:text-accent transition relative group">
              Categories
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/about" className="text-sm font-semibold text-foreground hover:text-accent transition relative group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '250px' }}
              exit={{ opacity: 0, width: 0 }}
              className="hidden md:block"
            >
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
            </motion.div>
          )}

          {/* Right Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden md:block p-2 hover:bg-secondary rounded-lg transition hover:text-accent"
              title="Search"
            >
              <FiSearch className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2 hover:bg-secondary rounded-lg transition hover:text-accent" title="Wishlist">
              <FiHeart className="w-5 h-5" />
              {wishlist.items.length > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {wishlist.items.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2 hover:bg-secondary rounded-lg transition hover:text-accent"
              title="Shopping cart"
            >
              <FiShoppingCart className="w-5 h-5" />
              {cart.items.length > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {cart.items.length}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Account */}
            {auth.isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  href={
                    auth.user?.role === 'customer'
                      ? '/customer/dashboard'
                      : auth.user?.role === 'supplier'
                        ? '/supplier/dashboard'
                        : auth.user?.role === 'admin'
                          ? '/admin/dashboard'
                          : '/login'
                  }
                  className="p-2 hover:bg-secondary rounded-lg transition hover:text-accent"
                  title="Account"
                >
                  <FiUser className="w-5 h-5" />
                </Link>
                <LogoutButton variant="icon" />
              </div>
            ) : (
              <Link href="/login" className="p-2 hover:bg-secondary rounded-lg transition hover:text-accent" title="Account">
                <FiUser className="w-5 h-5" />
              </Link>
            )}

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
