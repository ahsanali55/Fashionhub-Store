'use client';

import { motion } from 'framer-motion';
import { FiArrowRight, FiHeart, FiShoppingCart } from 'react-icons/fi';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating?: number;
  reviews?: number;
  category?: string;
  inStock?: boolean;
}

interface ProductDetailProps {
  product: Product;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
}

export function ProductDetail({ product, onAddToCart, onAddToWishlist }: ProductDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card rounded-lg overflow-hidden shadow-sm"
    >
      {/* Image */}
      <div className="relative aspect-square bg-secondary overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition duration-300"
        />
        <motion.div
          initial={{ opacity: 0, top: -20 }}
          animate={{ opacity: 1, top: 12 }}
          className="absolute right-4 top-3 bg-white text-black px-3 py-1 rounded-full text-sm font-bold"
        >
          NEW
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Category & Rating */}
        <div className="flex justify-between items-start">
          {product.category && (
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
              {product.category}
            </span>
          )}
          {product.rating && (
            <span className="text-sm font-semibold text-amber-600">
              ★ {product.rating.toFixed(1)} ({product.reviews || 0})
            </span>
          )}
        </div>

        {/* Name & Price */}
        <div>
          <h3 className="text-lg font-bold mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
            {product.inStock === false && (
              <span className="text-xs font-semibold text-destructive">Out of Stock</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddToCart}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition font-medium flex items-center justify-center gap-2"
          >
            <FiShoppingCart className="w-4 h-4" />
            Add to Cart
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddToWishlist}
            className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition flex items-center justify-center"
          >
            <FiHeart className="w-4 h-4" />
          </motion.button>
        </div>

        {/* View Details Link */}
        <Link
          href={`/product/${product.id}`}
          className="block text-center text-sm text-primary hover:text-accent font-medium transition"
        >
          View Details
          <FiArrowRight className="inline ml-1 w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
}
