'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FiArrowUpRight,
  FiHeart,
  FiShoppingBag,
} from 'react-icons/fi';
import { removeFromWishlist } from '@/redux/slices/wishlistSlice';
import { useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { formatPrice } from '@/lib/utils';
interface Product {
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

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
}

export function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
}: ProductCardProps) {
  const isNew =
    product.createdAt &&
    Date.now() -
    new Date(product.createdAt).getTime() <
    14 * 24 * 60 * 60 * 1000;
  const [isAdded, setIsAdded] = useState(false);
  const addedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dispatch = useAppDispatch();
  const outOfStock = product.stock <= 0;
  const wishlistItems = useAppSelector(
    (state) => state.wishlist.items
  );

  const isWishlisted = wishlistItems.some(
    (item) => item.id === product.id
  );
  const cartItems = useAppSelector(
    (state) => state.cart.items
  );

  const isInCart = cartItems.some(
    (item) => item.id === product.id
  );
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">

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

        {/* Wishlist */}
        <button
          onClick={() => {
            if (isWishlisted) {
              dispatch(removeFromWishlist(String(product.id)));
            } else {
              onAddToWishlist?.();
            }
          }}
          aria-label={
            isWishlisted
              ? 'Remove from wishlist'
              : 'Add to wishlist'
          }
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
    hover:text-primary
    transition
    cursor-pointer
  "
        >
          <FiHeart
            size={18}
            className={isWishlisted ? 'fill-primary text-primary' : ''}
          />
        </button>

        {!outOfStock && (
          <button
            onClick={() => {
              onAddToCart?.();

              setIsAdded(true);

              if (addedTimeoutRef.current) {
                clearTimeout(addedTimeoutRef.current);
              }

              addedTimeoutRef.current = setTimeout(() => {
                setIsAdded(false);
              }, 2000);
            }}
            className={`
      absolute
      bottom-3
      left-3
      right-3
      h-11
      rounded-lg
      font-semibold
      text-sm
      flex
      items-center
      justify-center
      gap-2
      transition-all
      duration-300
      shadow-lg
      opacity-0
      translate-y-2
      group-hover:opacity-100
      group-hover:translate-y-0
      ${isAdded
                ? 'bg-orange-500 text-primary-foreground'
                : 'bg-white text-foreground hover:bg-primary hover:text-primary-foreground'
              }
    `}
          >
            {isAdded ? (
              <>
                <span className="flex items-center justify-center w-4 h-4 rounded-full border border-current text-[10px]">
                  ✓
                </span>
                Added to Cart
              </>
            ) : (
              <>
                <FiShoppingBag size={16} />
                Add to Cart
              </>
            )}
          </button>
        )}
      </div>

      {/* Information */}
      <div className="pt-4">

        {/* Brand */}
        {product.brand && (
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            {product.brand}
          </p>
        )}

        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/product/${product.id}`}
            className="min-w-0"
          >
            <h3 className="font-semibold text-sm md:text-base truncate hover:text-primary transition">
              {product.name}
            </h3>
          </Link>

          <span className="text-sm font-bold shrink-0">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Category + Rating */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">
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

        {/* Details */}
        <Link
          href={`/product/${product.id}`}
          className="
            inline-flex
            items-center
            gap-1
            mt-3
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
    </motion.article>
  );
}