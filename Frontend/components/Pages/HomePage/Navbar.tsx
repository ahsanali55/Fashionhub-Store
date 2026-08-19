'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { RootState } from '@/redux/store';
import { toggleCart } from '@/redux/slices/cartSlice';
import {
  FiSearch,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiHeart,
  FiUser,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { FashionHubLogo } from '@/components/Reusable_Components/FashionHubLogo';

export function Navbar() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchproduct, setSearchproduct] = useState(
    searchParams.get('search') || ''
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isHomePage = pathname === '/';
  const isHomeAtTop = isHomePage && !scrolled;
  const cart = useAppSelector((state: RootState) => state.cart);
  const auth = useAppSelector((state: RootState) => state.auth);
  const wishlist = useAppSelector((state: RootState) => state.wishlist);
  useEffect(() => {
    setSearchproduct(searchParams.get('search') || '');
  }, [searchParams]);
  /* ================================
     Mounted
     ================================ */

  useEffect(() => {
    setIsMounted(true);
  }, []);

  /* ================================
     Scroll
     ================================ */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* ================================
     Close mobile menu on route change
     ================================ */

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  /* ================================
     Hidden Routes
     ================================ */

  const hideNavbarRoutes = [
    '/login',
    '/register',
    '/admin/dashboard',
    '/supplier/dashboard',
  ];

  if (hideNavbarRoutes.some((route) => pathname?.startsWith(route))) {
    return null;
  }
  const handleSearch = () => {
    const query = searchproduct.trim();

    if (!query) {
      router.push('/shop');
    } else {
      router.push(`/shop?search=${encodeURIComponent(query)}`);
    }

    setSearchOpen(false);
  };
  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
         backdrop-blur-md
        transition-all duration-300
        ${isHomeAtTop ? 'bg-transparent' : 'bg-white/95'}
        ${scrolled
          ? 'border-b border-border shadow-sm bg-white/95'
          : 'border-b border-transparent '
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] gap-6 ">

          {/* =================================
              Logo
              ================================= */}

          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="transition-transform duration-200 group-hover:scale-105">
              {isHomeAtTop ? <FashionHubLogo light /> : <FashionHubLogo />}
            </div>

            <span className={`hidden sm:block text-xl font-extrabold tracking-tight ${isHomeAtTop ? 'text-white' : 'text-foreground'}`}>
              Fashion
              <span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* =================================
              Desktop Navigation
              ================================= */}

          <div className="hidden md:flex items-center gap-8 ml-8">
            <NavLink href="/" active={pathname === '/'} light={isHomeAtTop}>
              Home
            </NavLink>

            <NavLink
              href="/shop"
              active={pathname?.startsWith('/shop')}
              light={isHomeAtTop}
            >
              Shop
            </NavLink>

            <NavLink
              href="/categories"
              active={pathname?.startsWith('/categories')}
              light={isHomeAtTop}
            >
              Categories
            </NavLink>
            <NavLink
              href="/about"
              active={pathname?.startsWith('/about')}
              light={isHomeAtTop}
            >
              About
            </NavLink>
          </div>

          {/* =================================
              Search
              ================================= */}

          <div className="hidden md:flex flex-1 justify-center px-8">
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: '100%' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className=" max-w-md "
                >
                  <div className="relative">
                    <FiSearch
                      className="
                        absolute left-3 top-1/2
                        -translate-y-1/2
                        w-4 h-4
                        text-muted-foreground
                      "
                    />

                    <input
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                      type="text"
                      placeholder="Search products..."
                      value={searchproduct}
                      onChange={(e) =>
                        setSearchproduct(e.target.value)
                      }
                      className="
                        w-full
                        h-10
                        pl-10 pr-4
                        rounded-lg
                        bg-muted
                        text-sm
                        text-foreground
                        placeholder:text-muted-foreground
                        border 
                        focus:border-primary
                        focus:bg-white
                        focus:outline-none
                        focus:ring-2
                        focus:ring-primary/10
                        transition-all
                      "
                    />

                    <button
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchproduct('');
                      }}
                      className="
                        absolute right-2 top-1/2
                        -translate-y-1/2
                        p-1
                        rounded-md
                        text-muted-foreground
                        hover:text-foreground
                        hover:bg-white
                        transition
                      "
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className=" max-w-md"
                >
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="
                      w-fit
                      h-10
                      flex items-center
                      gap-3
                      px-4
                      rounded-lg
                      bg-muted
                      text-sm
                      text-muted-foreground
                      hover:bg-accent
                      hover:text-foreground
                      transition-colors
                      border
                    "
                  >
                    <FiSearch className="w-4 h-4" />
                    <span>Search products...</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* =================================
              Right Actions
              ================================= */}

          <div className="flex items-center gap-1 sm:gap-2">

            {/* Desktop Search Icon */}
            <button
              onClick={() => handleSearch()}
              className={`
                hidden lg:flex
                items-center justify-center
                w-10 h-10
                rounded-lg
               ${isHomeAtTop ? 'text-white' : 'text-foreground'}
                hover:bg-accent
                hover:text-primary
                transition-colors
              `}
              title="Search"
            >
              <FiSearch className="w-[19px] h-[19px]" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className={`
                relative
                flex items-center justify-center
                w-10 h-10
                rounded-lg
                ${isHomeAtTop ? 'text-white' : 'text-foreground'}
                hover:bg-accent
                hover:text-primary
                transition-colors
              `}
              title="Wishlist"
            >
              <FiHeart className="w-[19px] h-[19px]" />

              {wishlist.items.length > 0 && (
                <span
                  className="
                    absolute -top-0.5 -right-0.5
                    min-w-[17px] h-[17px]
                    px-1
                    flex items-center justify-center
                    rounded-full
                    bg-primary
                    text-white
                    text-[10px]
                    font-bold
                    ring-2 ring-white
                  "
                >
                  {wishlist.items.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => dispatch(toggleCart())}
              className={`
                relative
                flex items-center justify-center
                w-10 h-10
                rounded-lg
                ${isHomeAtTop ? 'text-white' : 'text-foreground'} 
                hover:bg-accent
                hover:text-primary
                transition-colors
              `}
              title="Shopping cart"
            >
              <FiShoppingCart className="w-[19px] h-[19px]" />

              {cart.items.length > 0 && (
                <span
                  className="
                    absolute -top-0.5 -right-0.5
                    min-w-[17px] h-[17px]
                    px-1
                    flex items-center justify-center
                    rounded-full
                    bg-primary
                    text-white
                    text-[10px]
                    font-bold
                    ring-2 ring-white
                  "
                >
                  {cart.items.length}
                </span>
              )}
            </button>

            {/* Account */}
            {isMounted && auth.isAuthenticated ? (
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
                className={`
                  flex items-center justify-center
                  w-10 h-10
                  rounded-lg
                  ${isHomeAtTop ? 'text-white' : 'text-foreground'}
                  hover:bg-accent
                  hover:text-primary
                  transition-colors
                `}
                title="Account"
              >
                <FiUser className="w-[19px] h-[19px]" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="
                  hidden sm:flex
                  items-center justify-center
                  h-10
                  px-5
                  ml-2
                  rounded-lg
                  bg-primary
                  text-primary-foreground
                  text-sm
                  font-bold
                  hover:bg-[#EA580C]
                  transition-colors
                  shadow-sm
                "
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`
                md:hidden
                flex items-center justify-center
                w-10 h-10
                rounded-lg
                ${isHomeAtTop ? 'text-white' : 'text-foreground'}
                hover:bg-accent
                hover:text-primary
                transition-colors
              `}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <FiX className="w-5 h-5" />
              ) : (
                <FiMenu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* =================================
            Mobile Menu
            ================================= */}

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="
                md:hidden
                overflow-hidden
                border-t border-border
              "
            >
              <div className="py-4 space-y-1">

                <MobileNavLink
                  href="/"
                  active={pathname === '/'}
                  light={isHomeAtTop}
                >
                  Home
                </MobileNavLink>

                <MobileNavLink
                  href="/shop"
                  active={pathname?.startsWith('/shop')}
                  light={isHomeAtTop}
                >
                  Shop
                </MobileNavLink>

                <MobileNavLink
                  href="/categories"
                  active={pathname?.startsWith('/categories')}
                  light={isHomeAtTop}
                >
                  Categories
                </MobileNavLink>
                <MobileNavLink
                  href="/about"
                  active={pathname?.startsWith('/about')}
                  light={isHomeAtTop}
                >
                  About
                </MobileNavLink>

                {/* Mobile Search */}
                <div className="px-2 pt-3">
                  <div className="relative">
                    <FiSearch
                      className="
                        absolute left-3 top-1/2
                        -translate-y-1/2
                        w-4 h-4
                        text-muted-foreground
                      "
                    />

                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchproduct}
                      onChange={(e) =>
                        setSearchproduct(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                      className="
                        w-full
                        h-10
                        pl-10 pr-4
                        rounded-lg
                        bg-muted
                        border border-transparent
                        text-sm
                        focus:outline-none
                        focus:border-primary
                        focus:bg-white
                        focus:ring-2
                        focus:ring-primary/10
                      "
                    />
                  </div>
                </div>

                {/* Mobile Sign In */}
                {!isMounted || !auth.isAuthenticated ? (
                  <div className="px-2 pt-3">
                    <Link
                      href="/login"
                      className="
                        flex items-center justify-center
                        w-full
                        h-10
                        rounded-lg
                        bg-primary
                        text-white
                        text-sm
                        font-bold
                        hover:bg-[#EA580C]
                        transition
                      "
                    >
                      Sign In
                    </Link>
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

/* ==========================================
   Desktop Navigation Link
   ========================================== */

function NavLink({
  href,
  children,
  active,
  light,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  light?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        relative
        py-2
        text-sm
        font-semibold
        transition-colors
        ${active
          ? 'text-primary '
          : `${light ? 'text-white' : 'text-foreground'} hover:text-primary`
        }
      `}
    >
      {children}

      <span
        className={`
          absolute
          bottom-0
          left-0
          h-[2px]
          bg-primary
          rounded-full
          transition-all duration-300
          ${active ? 'w-full' : 'w-0 group-hover:w-full'}
        `}
      />
    </Link>
  );
}

/* ==========================================
   Mobile Navigation Link
   ========================================== */

function MobileNavLink({
  href,
  children,
  active,
  light,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  light?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        block
        px-3
        py-2.5
        rounded-lg
        text-sm
        font-semibold
        transition-colors
        ${active
          ? 'bg-accent text-primary'
          : `${light ? 'text-white' : 'text-foreground'} hover:bg-muted hover:text-primary`
        }
      `}
    >
      {children}
    </Link>
  );
}