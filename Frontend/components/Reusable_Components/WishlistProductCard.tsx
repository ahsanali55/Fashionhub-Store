'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FiArrowUpRight,
  FiHeart,
  FiShoppingBag,
  FiTrash2,
} from 'react-icons/fi';
import { formatPrice } from '@/lib/utils';
interface WishlistProduct {
  id: number | string;
  name: string;
  brand?: string;
  category?: string;
  price: number;
  image: string;
  rating?: number;
  reviews?: number;
  stock: number;
  createdAt?: string;
}

interface WishlistProductCardProps {
  product: WishlistProduct;
  onAddToCart?: () => void;
  onRemove?: () => void;
}

export function WishlistProductCard({
  product,
  onAddToCart,
  onRemove,
}: WishlistProductCardProps) {
  const isNew =
    product.createdAt &&
    Date.now() - new Date(product.createdAt).getTime() <
      14 * 24 * 60 * 60 * 1000;

  const outOfStock = product.stock <= 0;

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      {/* Product Image */}
      <div className="relative aspect-[4/2] overflow-hidden rounded-xl bg-muted">
        <Link href={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="
              w-full
              h-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="px-2.5 py-1 rounded-full bg-white text-foreground text-[11px] font-bold">
              NEW
            </span>
          )}

          {outOfStock && (
            <span className="px-2.5 py-1 rounded-full bg-foreground text-white text-[11px] font-bold">
              SOLD OUT
            </span>
          )}
        </div>

        {/* Remove from Wishlist */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onRemove}
          aria-label="Remove from wishlist"
          className="
            absolute
            top-3
            right-3
            w-10
            h-10
            rounded-full
            bg-white/95
            flex
            items-center
            justify-center
            text-foreground
            hover:text-destructive
            transition
          "
        >
          <FiTrash2 size={17} />
        </motion.button>

        {/* Add to Cart */}
        {!outOfStock && (
          <button
            onClick={() => onAddToCart && onAddToCart()}
            className="
              absolute
              bottom-3
              left-3
              right-3
              h-10
              rounded-lg
              bg-white
              text-foreground
              font-semibold
              text-sm
              flex
              items-center
              justify-center
              gap-2
              opacity-0
              translate-y-2
              group-hover:opacity-100
              group-hover:translate-y-0
              transition-all
              duration-300
              shadow-lg
            "
          >
            <FiShoppingBag size={15} />
            Add to Cart
          </button>
        )}
      </div>

      {/* Product Information */}
      <div className="pt-3">
        {/* Brand */}
        {product.brand && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            {product.brand}
          </p>
        )}

        {/* Name + Price */}
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/product/${product.id}`}
            className="min-w-0"
          >
            <h3 className="font-semibold text-sm truncate hover:text-primary transition">
              {product.name}
            </h3>
          </Link>

          <span className="text-sm font-bold shrink-0">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Category + Rating */}
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-muted-foreground capitalize">
            {product.category}
          </span>

          {product.rating !== undefined && (
            <span className="text-xs font-medium">
              ★ {product.rating.toFixed(1)}
              <span className="text-muted-foreground">
                {' '}
                ({product.reviews || 0})
              </span>
            </span>
          )}
        </div>

        {/* Wishlist Status + Details */}
        <div className="flex items-center justify-between mt-2">
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <FiHeart size={11} className="fill-primary text-primary" />
            Saved
          </span>

          <Link
            href={`/product/${product.id}`}
            className="
              inline-flex
              items-center
              gap-1
              text-xs
              font-semibold
              text-primary
              opacity-0
              group-hover:opacity-100
              transition
            "
          >
            View details
            <FiArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}