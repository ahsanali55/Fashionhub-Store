'use client';

import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { removeFromWishlist, clearWishlist } from '@/redux/slices/wishlistSlice';
import { addToCart } from '@/redux/slices/cartSlice';
import { FiTrash2, FiShoppingCart, FiHeart } from 'react-icons/fi';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function WishlistPage() {
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist);

  const handleAddToCart = (item: any) => {
    dispatch(addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    }));
  };

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold flex items-center gap-2">
            <FiHeart className="w-8 h-8 text-accent" />
            My Wishlist
          </h1>
          <p className="text-muted-foreground mt-2">{wishlist.items.length} items saved</p>
        </motion.div>

        {wishlist.items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <FiHeart className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Start adding items to your wishlist to keep track of products you love!</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition"
            >
              <FiShoppingCart className="w-5 h-5" />
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {wishlist.items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition"
                >
                  <div className="relative overflow-hidden bg-secondary h-48">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-4 space-y-4">
                    <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                    <p className="text-lg font-bold text-primary">${item.price.toFixed(2)}</p>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 bg-primary text-white py-2 rounded-lg hover:opacity-90 transition font-medium text-sm flex items-center justify-center gap-2"
                      >
                        <FiShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => dispatch(removeFromWishlist(item.id))}
                        className="px-4 py-2 bg-secondary hover:bg-destructive hover:text-white rounded-lg transition"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 justify-center"
            >
              <Link
                href="/shop"
                className="px-6 py-3 border border-border rounded-lg hover:bg-secondary transition font-medium"
              >
                Continue Shopping
              </Link>
              <button
                onClick={() => dispatch(clearWishlist())}
                className="px-6 py-3 bg-destructive text-white rounded-lg hover:opacity-90 transition font-medium"
              >
                Clear Wishlist
              </button>
            </motion.div>
          </>
        )}
      </div>
    </main>
  );
}
