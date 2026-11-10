'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { removeFromWishlist } from '@/redux/slices/wishlistSlice';
import { addToCart } from '@/redux/slices/cartSlice';
import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/Reusable_Components/EmptyState';
import { BackButton } from '@/components/Reusable_Components/BackButton';
import { WishlistProductCard } from '@/components/Reusable_Components/WishlistProductCard';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import type { RootState } from '@/redux/store';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CustomerWishlistPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state: RootState) => state.auth);
  const wishlist = useAppSelector((state: RootState) => state.wishlist);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    if (!auth.isAuthenticated || auth.user?.role !== 'customer') {
      router.replace('/login');
    }
  }, [auth.isAuthenticated, auth.user?.role, router]);

  const handleAddToCart = async (item: (typeof wishlist.items)[number]) => {
    setActionError('');
    try {
      await dispatch(addToCart({ ...item, quantity: 1 })).unwrap();
      await dispatch(removeFromWishlist(item.id)).unwrap();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'Unable to update your cart.',
      );
    }
  };

  if (!auth.isAuthenticated || auth.user?.role !== 'customer') return null;

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <BackButton fallbackHref="/customer/dashboard" alwaysNavigateToFallback />
          <h1 className="text-4xl font-bold mb-2 mt-6">My Wishlist</h1>
          <p className="text-muted-foreground">Your saved items</p>
        </motion.div>

        {wishlist.items.length === 0 ? (
          <EmptyState
            type="wishlist"
            title="Wishlist is empty"
            description="Save your favorite items to your wishlist"
            actionLabel="Browse Products"
            actionHref="/shop"
          />
        ) : (
          <>
            <div className="mb-6 text-muted-foreground">
              {wishlist.items.length} item{wishlist.items.length !== 1 ? 's' : ''} in wishlist
            </div>
            {actionError && (
              <p role="alert" className="mb-4 text-sm text-destructive">
                {actionError}
              </p>
            )}

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {wishlist.items.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <WishlistProductCard
                    product={item}
                    onAddToCart={() => void handleAddToCart(item)}
                    onRemove={() => {
                      setActionError('');
                      void dispatch(removeFromWishlist(item.id))
                        .unwrap()
                        .catch((error: unknown) => {
                          setActionError(
                            error instanceof Error
                              ? error.message
                              : 'Unable to remove this item.',
                          );
                        });
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </main>
  );
}
