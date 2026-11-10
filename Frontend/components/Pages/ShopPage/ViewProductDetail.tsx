'use client';

import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FiArrowLeft,
  FiHeart,
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiStar,
  FiArrowUpRight,
} from 'react-icons/fi';

import { RootState } from '@/redux/store';
import { addToCart } from '@/redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/redux/slices/wishlistSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { formatPrice } from '@/lib/utils';
import { ProductCard } from './ProductCard';
import { useEffect, useRef, useState } from 'react';
import { loadProducts } from '@/redux/slices/productsSlice';
import type { Product } from '@/redux/slices/productsSlice';
import {
  createProductReview,
  getMyOrders,
  getProductReviews,
  type Review,
} from '@/services/commerce.services';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

export default function ViewProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  const dispatch = useAppDispatch();

  const products = useAppSelector(
    (state: RootState) => state.products
  );

  const product = products.items.find(
    (item) => item.id === id
  );
  const [isAdded, setIsAdded] = useState(false);
  const addedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wishlistItems = useAppSelector(
    (state) => state.wishlist.items
  );
  const auth = useAppSelector((state) => state.auth);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [isCheckingReviewEligibility, setIsCheckingReviewEligibility] = useState(false);

  useEffect(() => {
    let active = true;
    getProductReviews(id)
      .then((data) => { if (active) setReviews(data); })
      .catch((error: unknown) => {
        if (active) setReviewError(error instanceof Error ? error.message : 'Unable to load reviews.');
      });
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    if (auth.user?.role !== 'customer') {
      setCanReview(false);
      setIsCheckingReviewEligibility(false);
      return;
    }

    let active = true;
    setCanReview(false);
    setIsCheckingReviewEligibility(true);
    getMyOrders()
      .then((orders) => {
        if (!active) return;
        setCanReview(orders.some((order) => order.items.some((item) => {
          return item.productId === id && item.status === 'delivered';
        })));
      })
      .catch((error: unknown) => {
        if (active) {
          setReviewError(error instanceof Error ? error.message : 'Unable to verify your purchase.');
        }
      })
      .finally(() => {
        if (active) setIsCheckingReviewEligibility(false);
      });
    return () => { active = false; };
  }, [auth.user?.id, auth.user?.role, id]);

  const hasReviewed = reviews.some((review) =>
    typeof review.userId === 'string'
      ? review.userId === auth.user?.id
      : review.userId._id === auth.user?.id,
  );

  const handleReviewSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (auth.user?.role !== 'customer') return;
    setIsSubmittingReview(true);
    setReviewError('');
    setReviewSuccess('');
    try {
      const review = await createProductReview(id, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setReviews((current) => [review, ...current]);
      setReviewComment('');
      setReviewSuccess('Your review has been submitted.');
      void dispatch(loadProducts());
    } catch (error) {
      setReviewError(error instanceof Error ? error.message : 'Unable to submit your review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const isWishlisted = wishlistItems.some(
    (i) => i.id === product?.id
  );
  if (!product) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-3">
            Product not found
          </h1>

          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist.
          </p>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-orange-600 transition"
          >
            <FiArrowLeft size={16} />
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  const handleAddToWishlist = (product: Product) => {
    dispatch(addToWishlist(product));
  };

  /*
   * Show products from the same category.
   * Current product is excluded.
   */
  const relatedProducts = products.items
    .filter(
      (item) =>
        item.id !== product.id &&
        item.category === product.category
    )
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-background pt-28 pb-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back to shop */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/shop"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-muted-foreground
              hover:text-primary
              transition
            "
          >
            <FiArrowLeft size={16} />
            Back to Shop
          </Link>
        </motion.div>

        {/* ================= PRODUCT ================= */}

        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16"
        >

          {/* Product Image */}
          <motion.div
            variants={itemVariants}
            className="
              relative
              aspect-[4/5]
              overflow-hidden
              rounded-xl
              bg-muted
            "
          >
            <img
              src={product.image}
              alt={product.name}
              className="
                w-full
                h-full
                object-cover
              "
            />

            {/* Stock / New */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">

              <span
                className="
                  px-3
                  py-1.5
                  rounded-full
                  bg-white
                  text-foreground
                  text-[11px]
                  font-bold
                  uppercase
                "
              >
                {product.inStock ? 'Available' : 'Sold Out'}
              </span>

            </div>

            {/* Wishlist */}
            <button
              onClick={() => {
                if (isWishlisted) {
                  dispatch(removeFromWishlist(product.id));
                }
                else {
                  handleAddToWishlist(product);
                }
              }}
              aria-label="Add to wishlist"
              className="
                absolute
                top-4
                right-4
                w-11
                h-11
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
          </motion.div>

          {/* Product Information */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-center"
          >

            {/* Category */}
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.16em]
                text-muted-foreground
                mb-3
              "
            >
              {product.category}
            </p>

            {/* Product Name */}
            <h1
              className="
                text-4xl
                md:text-5xl
                font-bold
                tracking-tight
                leading-tight
                mb-5
              "
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">

              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <FiStar
                    key={index}
                    size={15}
                    className={
                      index < Math.round(product.rating)
                        ? 'fill-current text-orange-400'
                        : 'text-muted-foreground'
                    }
                  />
                ))}
              </div>

              <span className="text-sm text-muted-foreground">
                {product.rating.toFixed(1)} ({product.reviews} reviews)
              </span>

            </div>

            {/* Price */}
            <p className="text-3xl font-bold mb-7">
              {formatPrice(product.price)}
            </p>

            {/* Description */}
            <div className="border-t border-border pt-6 mb-7">

              <p className="text-sm font-semibold mb-3">
                About this product
              </p>

              <p className="text-sm leading-7 text-muted-foreground max-w-xl">
                {product.description}
              </p>

            </div>

            {/* Product Info */}
            <div className="grid grid-cols-2 gap-4 border-y border-border py-6 mb-7">

              <div className="flex items-center gap-3">
                <FiTruck
                  size={18}
                  className="text-primary shrink-0"
                />

                <div>
                  <p className="text-sm font-semibold">
                    Fast Delivery
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Reliable shipping
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FiShield
                  size={18}
                  className="text-primary shrink-0"
                />

                <div>
                  <p className="text-sm font-semibold">
                    Secure Payment
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Cash on delivery
                  </p>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-7">

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                 
                  handleAddToCart(product) 
                  setIsAdded(true);
                  if (addedTimeoutRef.current) {
                clearTimeout(addedTimeoutRef.current);
              }
                 addedTimeoutRef.current = setTimeout(() => {
                setIsAdded(false);
              }, 2000);
                }
                }              
                disabled={!product.inStock}
                className={`
                  flex-1
                  h-12
                  rounded-lg
                  text-white
                  font-semibold
                  text-sm
                  flex
                  items-center
                  cursor-pointer
                  justify-center
                  gap-2         
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  ${isAdded
                    ? 'bg-orange-600'
                    : 'bg-orange-500 hover:bg-orange-600'
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
              </motion.button>
            </div>

            {/* Supplier */}
            <div className="flex items-center justify-between">

              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">
                  Supplier
                </p>

                <p className="text-sm font-semibold">
                  {product.supplier}
                </p>
              </div>

              <span
                className="
                  text-xs
                  font-medium
                  px-2.5
                  py-1
                  rounded-full
                  bg-muted
                "
              >
                Verified Supplier
              </span>

            </div>

          </motion.div>

        </motion.section>

        <section className="mt-20 border-t border-border pt-10">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          {reviewError && <p role="alert" className="mb-4 text-sm text-destructive">{reviewError}</p>}
          {auth.user?.role === 'customer' && isCheckingReviewEligibility && (
            <p className="mb-6 text-sm text-muted-foreground">Checking your order history...</p>
          )}
          {auth.user?.role === 'customer' && !isCheckingReviewEligibility && canReview && !hasReviewed && (
            <form onSubmit={handleReviewSubmit} className="mb-8 max-w-2xl space-y-4 rounded-xl border border-border bg-card p-6">
              <label className="block text-sm font-medium">
                Rating
                <select
                  value={reviewRating}
                  onChange={(event) => setReviewRating(Number(event.target.value))}
                  className="mt-2 block rounded-lg border border-border bg-background px-3 py-2"
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>{rating} stars</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium">
                Your review
                <textarea
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  required
                  rows={3}
                  maxLength={1000}
                  className="mt-2 block w-full rounded-lg border border-border bg-background px-3 py-2"
                />
              </label>
              {reviewSuccess && <p role="status" className="text-sm text-green-700">{reviewSuccess}</p>}
              <button
                type="submit"
                disabled={isSubmittingReview || !reviewComment.trim()}
                className="rounded-lg bg-primary px-5 py-2 text-primary-foreground disabled:opacity-50"
              >
                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
          {auth.user?.role === 'customer' && !isCheckingReviewEligibility && !canReview && (
            <p className="mb-6 text-sm text-muted-foreground">
              Reviews are available after an order containing this product has been delivered.
            </p>
          )}
          {auth.user?.role === 'customer' && !isCheckingReviewEligibility && canReview && hasReviewed && (
            <p className="mb-6 text-sm text-muted-foreground">You have already reviewed this product.</p>
          )}
          {auth.user?.role !== 'customer' && (
            <p className="mb-6 text-sm text-muted-foreground">Sign in as a customer to leave a review.</p>
          )}
          {reviewError && !auth.user && <p role="alert" className="mb-4 text-sm text-destructive">{reviewError}</p>}
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <article key={review._id} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold">
                      {typeof review.userId === 'string' ? 'Customer' : review.userId.fullName}
                    </p>
                    <span className="text-sm text-amber-600">{review.rating}/5</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>
                  <time className="mt-3 block text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </time>
                </article>
              ))}
            </div>
          )}
        </section>


        {/* ================= RELATED PRODUCTS ================= */}

        {relatedProducts.length > 0 && (
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.1,
            }}
            className="mt-28"
          >

            {/* Heading */}
            <motion.div
              variants={itemVariants}
              className="
                flex
                items-end
                justify-between
                mb-8
              "
            >
              <div>
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-muted-foreground
                    mb-2
                  "
                >
                  You may also like
                </p>

                <h2 className="text-3xl md:text-4xl font-bold">
                  More from {product.category}
                </h2>
              </div>

              <Link
                href="/shop"
                className="
                  hidden
                  sm:inline-flex
                  items-center
                  gap-1
                  text-sm
                  font-semibold
                  text-primary
                  hover:text-orange-600
                  transition
                "
              >
                View all
                <FiArrowUpRight size={14} />
              </Link>
            </motion.div>


            {/* SAME PRODUCT CARD STYLE */}
            <motion.div
              variants={containerVariants}
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-4
                gap-x-5
                gap-y-10
              "
            >

              {relatedProducts.map((item) => {



                return (
                  <ProductCard key={item.id} product={item}
                    onAddToCart={() => dispatch(addToCart({ ...item, quantity: 1, })
                    )}
                    onAddToWishlist={() => handleAddToWishlist(item)}
                  />
                );
              })}

            </motion.div>

          </motion.section>
        )}

      </div>
    </main>
  );
}