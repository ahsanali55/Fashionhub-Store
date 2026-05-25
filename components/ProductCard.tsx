'use client';

import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/lib/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/lib/slices/wishlistSlice';
import { RootState } from '@/lib/store';
import { Product } from '@/lib/slices/productsSlice';
import Link from 'next/link';
import { FiStar } from 'react-icons/fi';
import { useState } from 'react';
import { IMAGE_FALLBACKS, getProductImageUrl } from '@/lib/images';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist);
  const isInWishlist = wishlist.items.some(item => item.id === product.id);
  const [imageSrc, setImageSrc] = useState(product.image || getProductImageUrl(product.id));
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: imageSrc,
    }));
  };

  const handleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: imageSrc,
      }));
    }
  };

  const handleImageError = () => {
    if (!imageError) {
      setImageSrc(IMAGE_FALLBACKS.product);
      setImageError(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-secondary h-64">
        <motion.img
          src={imageSrc}
          alt={product.name}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          whileHover={{ scale: 1.1 }}
        />

        {/* Stock Badge */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
            className={`p-2 rounded-full backdrop-blur-sm transition ${
              isInWishlist
                ? 'bg-accent text-white'
                : 'bg-white text-foreground hover:bg-accent hover:text-white'
            }`}
          >
            <FiHeart className="w-5 h-5" fill={isInWishlist ? 'currentColor' : 'none'} />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-full">
        {/* Category */}
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {product.category}
        </p>

        {/* Name */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary transition cursor-pointer mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? 'fill-accent text-accent'
                    : 'text-border'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3 mt-auto">
          <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
          <span className="text-xs text-muted-foreground">by {product.supplier}</span>
        </div>

        {/* Add to Cart */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full bg-primary text-white py-2 rounded-lg hover:opacity-90 transition font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiShoppingCart className="w-4 h-4" />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}
