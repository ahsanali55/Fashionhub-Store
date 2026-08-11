'use client';

import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { addToCart } from '@/redux/slices/cartSlice';
import { addToWishlist } from '@/redux/slices/wishlistSlice';
import { FiArrowLeft, FiHeart, FiShoppingCart, FiTruck, FiShield, FiStar } from 'react-icons/fi';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProductDetailPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products);

  // Mock product - in real app, fetch by ID
  const product = products.items[0] || {
    id: 1,
    name: 'Premium Leather Jacket',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=800&h=800&fit=crop',
    category: 'Jackets',
    rating: 4.8,
    reviews: 124,
    inStock: true,
    description: 'Stunning premium leather jacket crafted with the finest materials. Perfect for any season.',
  };

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleAddToWishlist = () => {
    dispatch(addToWishlist(product));
  };

  return (
    <main className="bg-background min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/shop"
            className="flex items-center gap-2 text-primary hover:text-accent mb-8 transition"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Shop
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          {/* Product Image */}
          <motion.div variants={itemVariants} className="aspect-square bg-secondary rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-110 transition duration-500"
            />
          </motion.div>

          {/* Product Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Category & Rating */}
            <div className="space-y-2">
              <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">
                {product.category}
              </span>
              <h1 className="text-4xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.rating || 0)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-base leading-relaxed">
                {product.description || 'High-quality product crafted with premium materials and attention to detail.'}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-border">
              <div className="flex items-center gap-3">
                <FiTruck className="w-5 h-5 text-primary" />
                <span className="text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center gap-3">
                <FiShield className="w-5 h-5 text-primary" />
                <span className="text-sm">Secure Checkout</span>
              </div>
            </div>

            {/* Stock Status */}
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {product.inStock ? (
                  <span className="text-green-600 font-semibold">In Stock - Free Shipping on Orders Over $100</span>
                ) : (
                  <span className="text-destructive font-semibold">Out of Stock</span>
                )}
              </p>

              {/* Quantity & Actions */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 px-6 py-4 bg-primary text-white rounded-lg hover:opacity-90 transition font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  Add to Cart
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToWishlist}
                  className="px-6 py-4 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition font-bold flex items-center justify-center"
                >
                  <FiHeart className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Seller Info */}
            <motion.div
              variants={itemVariants}
              className="bg-secondary rounded-lg p-4 space-y-2"
            >
              <p className="text-xs font-semibold text-muted-foreground uppercase">Sold by</p>
              <p className="font-bold">Premium Fashion Co.</p>
              <p className="text-sm text-muted-foreground">Verified Seller • 4.8★ Rating</p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Related Products */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20 space-y-8"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold">
            You Might Also Like
          </motion.h2>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.items.slice(0, 4).map((p) => (
              <motion.div
                key={p.id}
                variants={itemVariants}
                className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div className="aspect-square bg-secondary overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover hover:scale-110 transition" />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm line-clamp-2">{p.name}</h3>
                  <p className="text-lg font-bold text-primary">${p.price.toFixed(2)}</p>
                  <button className="w-full px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition">
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
