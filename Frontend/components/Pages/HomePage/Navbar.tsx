'use client';

import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import Image from 'next/image';
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
  FiBell,
  FiLayout,
  FiSettings,
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { FashionHubLogo } from '@/components/Reusable_Components/FashionHubLogo';
import { getErrorMessage } from '@/lib/utils';
import {
  getAdminNotifications,
  getMyNotifications,
  markNotificationRead,
  type NotificationRecord,
} from '@/services/commerce.services';

import { logout } from "@/redux/slices/features/auth/authSlice";
export function Navbar() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchproduct, setSearchproduct] = useState(
    searchParams.get('search') || ''
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [notificationError, setNotificationError] = useState('');
  const isHomePage = pathname === '/';
  const isHomeAtTop = isHomePage && !scrolled;
  const cart = useAppSelector((state: RootState) => state.cart);
  const auth = useAppSelector((state: RootState) => state.auth);
  const wishlist = useAppSelector((state: RootState) => state.wishlist);
  useEffect(() => {
    if (!auth.isAuthenticated || !auth.user || (auth.user.role === 'customer' && auth.user.notificationsEnabled === false)) {
      setNotifications([]);
      setNotificationError('');
      return;
    }

    let active = true;
    const loadNotifications = () => {
      const request = auth.user?.role === 'admin'
        ? getAdminNotifications()
        : getMyNotifications();
      request
        .then((data) => {
          if (!active) return;
          setNotifications(data);
          setNotificationError('');
        })
        .catch((error: unknown) => {
          if (active) setNotificationError(getErrorMessage(error, 'Unable to load notifications.'));
        });
    };
    loadNotifications();
    const intervalId = window.setInterval(loadNotifications, 30_000);
    const handleFocus = () => loadNotifications();
    window.addEventListener('focus', handleFocus);
    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
    };
  }, [auth.isAuthenticated, auth.user?.id, auth.user?.role, auth.user?.notificationsEnabled]);

  const handleNotificationClick = async (notification: NotificationRecord) => {
    try {
      if (!notification.isRead) {
        const updated = await markNotificationRead(notification._id);
        setNotifications((current) => current.map((item) =>
          item._id === updated._id ? updated : item,
        ));
      }
      if (notification.orderId) {
        setNotifOpen(false);
        router.push('/customer/orders');
      }
    } catch (error) {
      setNotificationError(getErrorMessage(error, 'Unable to mark notification as read.'));
    }
  };
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
   const handleLogout = () => {
    dispatch(logout() as any);
    setProfileDropdownOpen(false);
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
            <NavLink
              href="/contact"
              active={pathname?.startsWith('/contact')}
              light={isHomeAtTop}
            >
              Contact
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
            {/* Notifications */}
            {isMounted && auth.isAuthenticated && auth.user?.notificationsEnabled !== false && (
              <div className="relative">
                <button
                  onClick={() => {
                    const opening = !notifOpen;
                    setNotifOpen(opening);
                    if (opening && auth.user) {
                      setNotificationError('');
                      const request = auth.user.role === 'admin'
                        ? getAdminNotifications()
                        : getMyNotifications();
                      request.then((records) => {
                        setNotifications(records);
                        setNotificationError('');
                      }).catch((error: unknown) => {
                        setNotificationError(getErrorMessage(error, 'Unable to load notifications.'));
                      });
                    }
                  }}
                  className={`
        relative
        flex items-center justify-center
        w-10 h-10
        rounded-lg
        ${isHomeAtTop ? 'text-white' : 'text-foreground'}
        hover:bg-accent
        hover:text-primary
        transition-colors cursor-pointer
      `}
                  title="Notifications"
                >
                  <FiBell className="w-4.75 h-4.75" />
                  {notifications.some((notification) => !notification.isRead) && (
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-12 w-72 rounded-xl border border-border bg-card shadow-lg overflow-hidden z-50">
                    <div className="p-4 border-b border-border">
                      <p className="font-semibold text-sm text-foreground">Notifications</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-border">
                      {notificationError && (
                        <p role="alert" className="p-3 text-xs text-destructive">{notificationError}</p>
                      )}
                      {notifications.length === 0 && !notificationError ? (
                        <div className="p-8 text-center">
                          <FiBell className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">No notifications yet</p>
                        </div>
                      ) : notifications.map((notification) => (
                        <button
                          key={notification._id}
                          onClick={() => void handleNotificationClick(notification)}
                          className={`block w-full p-3 text-left hover:bg-muted ${notification.isRead ? 'opacity-70' : ''}`}
                        >
                          <p className="text-sm text-foreground">{notification.message}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Wishlist */}
            <Link
              href="/customer/wishlist"
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
                transition-colors cursor-pointer
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
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`
                    flex items-center gap-2 p-1.5 rounded-lg
                    ${isHomeAtTop ? "text-white" : "text-foreground"}
                    hover:opacity-60 transition-colors
                  `}
                  title="Account menu"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-primary/20 bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                    {auth.user?.avatar ? (
                      <Image
                        src={auth.user.avatar}
                        alt={auth.user.fullName || "User Avatar"}
                        fill
                        className="object-cover"
                        loading="eager"
                      />
                    ) : (
                      auth.user?.fullName?.[0]?.toUpperCase() || (
                        <FiUser className="w-4 h-4" />
                      )
                    )}
                  </div>
                  <motion.div
                    animate={{ rotate: profileDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="
                        absolute right-0 mt-2 w-56
                        rounded-xl bg-white shadow-xl
                        border border-border py-2 z-50 overflow-hidden
                      "
                    >
                      <div className="px-4 py-2.5 border-b border-border">
                        <p className="text-sm font-bold text-foreground truncate">
                          {auth.user?.fullName || auth.user?.email}
                        </p>
                      </div>

                      {auth.user?.role === "customer" && (
                        <div className="py-1">
                          <Link
                            href={"/customer/dashboard"}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                          >
                            <FiLayout className="w-4 h-4 text-muted-foreground" />
                            Dashboard
                          </Link>

                          <Link
                            href="/customer/settings"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                          >
                            <FiSettings className="w-4 h-4 text-muted-foreground" />
                            Profile and Settings
                          </Link>
                        </div>
                      )}

                      <div className="border-t border-border">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white bg-primary transition-colors text-left"
                        >
                          <FiLogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )  : (
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
                <MobileNavLink
                  href="/contact"
                  active={pathname?.startsWith('/contact')}
                  light={isHomeAtTop}
                >
                  Contact
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