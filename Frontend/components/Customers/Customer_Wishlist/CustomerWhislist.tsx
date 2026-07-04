'use client';

import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { removeFromWishlist } from '@/lib/slices/wishlistSlice';
import { addToCart } from '@/lib/slices/cartSlice';
import { useRouter } from 'next/navigation';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { EmptyState } from '@/components/Reusable_Components/EmptyState';
import { BackButton } from '@/components/Reusable_Components/BackButton';

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
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const wishlist = useSelector((state: RootState) => state.wishlist);

  if (!auth.isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleAddToCart = (item: any) => {
    dispatch(addToCart(item));
    dispatch(removeFromWishlist(item.id));
  };

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <BackButton fallbackHref="/shop" />
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

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {wishlist.items.map((item) => (
                <motion.div key={item.id} variants={itemVariants} className="bg-card rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                  {/* Image */}
                  <div className="relative aspect-square bg-secondary overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-bold text-lg line-clamp-2 mb-2">{item.name}</h3>
                      <p className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition font-medium flex items-center justify-center gap-2"
                      >
                        <FiShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => dispatch(removeFromWishlist(item.id))}
                        className="px-4 py-2 border border-border rounded-lg hover:border-destructive hover:text-destructive transition flex items-center justify-center"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </main>
  );
}
