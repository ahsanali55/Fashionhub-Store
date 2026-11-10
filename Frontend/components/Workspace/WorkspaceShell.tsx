'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FiActivity,
  FiBell,
  FiBox,
  FiLayout,
  FiLogOut,
  FiMenu,
  FiPackage,
  FiSettings,
  FiShoppingBag,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { logout } from '@/redux/slices/features/auth/authSlice';
import { getErrorMessage } from '@/lib/utils';
import {
  getAdminNotifications,
  getMyNotifications,
  markNotificationRead,
  type NotificationRecord,
} from '@/services/commerce.services';

type WorkspaceRole = 'admin' | 'supplier';

const navigation = {
  admin: [
    { label: 'Overview', href: '/admin/dashboard', icon: FiLayout },
    { label: 'Orders', href: '/admin/orders', icon: FiShoppingBag },
    { label: 'Products', href: '/admin/products', icon: FiBox },
    { label: 'Suppliers', href: '/admin/suppliers', icon: FiUsers },
    { label: 'Users', href: '/admin/users', icon: FiUsers },
    { label: 'Analytics', href: '/admin/analytics', icon: FiActivity },
  ],
  supplier: [
    { label: 'Overview', href: '/supplier/dashboard', icon: FiLayout },
    { label: 'My Products', href: '/supplier/products', icon: FiBox },
    { label: 'Add Product', href: '/supplier/products/add', icon: FiShoppingBag },
    { label: 'Orders', href: '/supplier/orders', icon: FiPackage },
    { label: 'Analytics', href: '/supplier/analytics', icon: FiActivity },
    { label: 'Business Profile', href: '/supplier/profile', icon: FiSettings },
  ],
} satisfies Record<
  WorkspaceRole,
  Array<{ label: string; href: string; icon: typeof FiLayout }>
>;

interface WorkspaceShellProps {
  role: WorkspaceRole;
  children: React.ReactNode;
}

export function WorkspaceShell({ role, children }: WorkspaceShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [notificationError, setNotificationError] = useState('');
  const [logoutError, setLogoutError] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const links = navigation[role];
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;
  const activeHref = links
    .filter((link) => pathname === link.href || pathname.startsWith(`${link.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
  const pageTitle =
    links.find((link) => link.href === activeHref)?.label ??
    (role === 'admin' ? 'Admin workspace' : 'Supplier workspace');

  useEffect(() => {
    let active = true;
    setNotificationError('');
    const loadNotifications = () => {
      const request = role === 'admin' ? getAdminNotifications() : getMyNotifications();
      request
        .then((records) => {
          if (!active) return;
          setNotifications(records);
          setNotificationError('');
        })
        .catch((error: unknown) => {
          if (!active) return;
          setNotificationError(getErrorMessage(error, 'Unable to load notifications.'));
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
  }, [role, user?.id]);

  useEffect(() => {
    setMobileNavOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);

  const handleNotificationClick = async (notification: NotificationRecord) => {
    setNotificationError('');
    try {
      if (!notification.isRead) {
        const updated = await markNotificationRead(notification._id);
        setNotifications((current) =>
          current.map((item) => (item._id === updated._id ? updated : item)),
        );
      }
      if (notification.orderId) {
        router.push(role === 'admin' ? '/admin/orders' : '/supplier/orders');
      }
    } catch (error) {
      setNotificationError(getErrorMessage(error, 'Unable to mark the notification as read.'));
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError('');
    try {
      await dispatch(logout()).unwrap();
      router.replace('/login');
    } catch (error) {
      setLogoutError(
        typeof error === 'string'
          ? error
          : error instanceof Error
            ? error.message
            : 'Unable to log out. Please try again.',
      );
      setIsLoggingOut(false);
    }
  };

  const renderNavigation = (mobile = false) => (
    <nav aria-label={`${role} navigation`} className={mobile ? 'grid gap-1' : 'space-y-1'}>
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = href === activeHref;
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border md:hidden"
              aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={mobileNavOpen}
            >
              {mobileNavOpen ? <FiX /> : <FiMenu />}
            </button>
            <Link
              href={`/${role}/dashboard`}
              className="shrink-0 text-lg font-extrabold tracking-tight"
            >
              Fashion<span className="text-primary">Hub</span>
              <span className="ml-2 hidden text-xs font-medium text-muted-foreground sm:inline">
                {role === 'admin' ? 'ADMIN' : 'SUPPLIER'} WORKSPACE
              </span>
            </Link>
            <span className="hidden border-l border-border pl-4 text-sm text-muted-foreground md:block">
              {pageTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  const opening = !notificationsOpen;
                  setNotificationsOpen(opening);
                  if (opening) {
                    setNotificationError('');
                    const request = role === 'admin' ? getAdminNotifications() : getMyNotifications();
                    request.then((records) => {
                      setNotifications(records);
                      setNotificationError('');
                    }).catch((error: unknown) => {
                      setNotificationError(getErrorMessage(error, 'Unable to load notifications.'));
                    });
                  }
                }}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-muted"
                aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
                aria-expanded={notificationsOpen}
              >
                <FiBell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <section
                  aria-label="Notifications"
                  className="absolute right-0 top-12 z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-card shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <h2 className="text-sm font-semibold">Notifications</h2>
                    <span className="text-xs text-muted-foreground">
                      {unreadCount} unread
                    </span>
                  </div>
                  <div className="max-h-96 divide-y divide-border overflow-y-auto">
                    {notificationError ? (
                      <p role="alert" className="p-4 text-sm text-destructive">
                        {notificationError}
                      </p>
                    ) : notifications.length === 0 ? (
                      <p className="p-8 text-center text-sm text-muted-foreground">
                        You&apos;re all caught up.
                      </p>
                    ) : (
                      notifications.map((notification) => (
                        <button
                          key={notification._id}
                          type="button"
                          onClick={() => void handleNotificationClick(notification)}
                          className={`w-full px-4 py-3 text-left transition hover:bg-muted ${
                            notification.isRead ? 'opacity-70' : ''
                          }`}
                        >
                          <span className="flex items-start gap-3">
                            <span
                              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                                notification.isRead ? 'bg-muted-foreground/30' : 'bg-primary'
                              }`}
                            />
                            <span>
                              <span className="block text-sm">{notification.message}</span>
                              <span className="mt-1 block text-xs text-muted-foreground">
                                {new Date(notification.createdAt).toLocaleString()}
                              </span>
                            </span>
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </section>
              )}
            </div>

            <div className="hidden min-w-0 text-right sm:block">
              <p className="max-w-48 truncate text-sm font-semibold">
                {user?.fullName ?? 'Workspace user'}
              </p>
              <p className="text-xs capitalize text-muted-foreground">{role}</p>
            </div>
            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={isLoggingOut}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiLogOut className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isLoggingOut ? 'Signing out…' : 'Sign out'}
              </span>
            </button>
          </div>
        </div>
        {logoutError && (
          <p role="alert" className="border-t border-border bg-destructive/5 px-4 py-2 text-center text-sm text-destructive">
            {logoutError}
          </p>
        )}
      </header>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="relative h-full w-72 max-w-[85vw] overflow-y-auto border-r border-border bg-background p-4 pt-20 shadow-xl">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Workspace
            </p>
            {renderNavigation(true)}
          </aside>
        </div>
      )}

      <div className="mx-auto flex max-w-[1600px] items-start gap-6 px-4 py-6 sm:px-6 lg:gap-8 lg:py-8">
        <aside className="sticky top-24 hidden w-60 shrink-0 rounded-2xl border border-border bg-card p-4 md:block">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>
          {renderNavigation()}
          <div className="mt-5 border-t border-border pt-4">
            <p className="px-3 text-xs leading-5 text-muted-foreground">
              {role === 'admin'
                ? 'Manage the marketplace from your admin workspace.'
                : 'Manage your catalog, orders, and business from here.'}
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <main className="min-h-[calc(100vh-12rem)]">{children}</main>
          <footer className="mt-8 border-t border-border py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link
                  href={`/${role}/dashboard`}
                  className="font-bold tracking-tight"
                >
                  Fashion<span className="text-primary">Hub</span>
                  <span className="ml-2 text-xs font-medium text-muted-foreground">
                    {role === 'admin' ? 'ADMIN' : 'SUPPLIER'} WORKSPACE
                  </span>
                </Link>
                <p className="mt-1 text-xs text-muted-foreground">
                  © {new Date().getFullYear()} FashionHub. Workspace navigation.
                </p>
              </div>
              <nav
                aria-label="Footer workspace navigation"
                className="flex flex-wrap gap-x-4 gap-y-2 text-sm"
              >
                {links.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-muted-foreground transition hover:text-primary"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
