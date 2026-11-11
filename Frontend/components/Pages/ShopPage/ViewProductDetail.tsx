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
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
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
      })
      .finally(() => { if (active) setIsLoadingReviews(false); });
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
  const averageReviewRating = reviews.length
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    : 0;
  const reviewDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
  }));

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

        <section className="mt-16 border-t border-border pt-10 sm:mt-20">
          <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">From our customers</p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Reviews & ratings</h2>
              <p className="mt-1 text-sm text-muted-foreground">Only customers with a delivered order can leave a review.</p>
            </div>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FiStar className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-foreground">{averageReviewRating.toFixed(1)}</span>
                <span>from {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span>
              </div>
            )}
          </div>

          {reviewError && <p role="alert" className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{reviewError}</p>}
          {auth.user?.role === 'customer' && isCheckingReviewEligibility && (
            <p className="mb-6 text-sm text-muted-foreground">Checking your order history…</p>
          )}
          {auth.user?.role === 'customer' && !isCheckingReviewEligibility && canReview && !hasReviewed && (
            <form onSubmit={handleReviewSubmit} className="mb-8 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h3 className="font-semibold">Share your experience</h3>
                <p className="mt-1 text-sm text-muted-foreground">Your feedback helps other shoppers make a confident choice.</p>
              </div>
              <fieldset className="mb-5">
                <legend className="mb-2 text-sm font-medium">Your rating</legend>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      aria-pressed={reviewRating === rating}
                      aria-label={`${rating} ${rating === 1 ? 'star' : 'stars'}`}
                      onClick={() => setReviewRating(rating)}
                      className="rounded-md p-1 transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <FiStar className={`h-7 w-7 ${rating <= reviewRating ? 'fill-amber-400 text-amber-500' : 'text-muted-foreground/40'}`} />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-medium text-muted-foreground">
                    {reviewRating === 5 ? 'Excellent' : reviewRating === 4 ? 'Very good' : reviewRating === 3 ? 'Good' : reviewRating === 2 ? 'Fair' : 'Needs improvement'}
                  </span>
                </div>
              </fieldset>
              <label className="block text-sm font-medium">
                Your review
                <textarea
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  required
                  rows={4}
                  maxLength={1000}
                  placeholder="What did you like or think could be better?"
                  className="mt-2 block w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </label>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">{reviewComment.length}/1000</span>
                <button
                  type="submit"
                  disabled={isSubmittingReview || !reviewComment.trim()}
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmittingReview ? 'Submitting review…' : 'Submit review'}
                </button>
              </div>
              {reviewSuccess && <p role="status" className="mt-3 text-sm text-green-700">{reviewSuccess}</p>}
            </form>
          )}
          {auth.user?.role === 'customer' && !isCheckingReviewEligibility && !canReview && (
            <p className="mb-6 rounded-xl border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
              Reviews unlock after an order containing this product has been delivered.
            </p>
          )}
          {auth.user?.role === 'customer' && !isCheckingReviewEligibility && canReview && hasReviewed && (
            <p className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">Thanks for sharing your feedback. You have already reviewed this product.</p>
          )}
          {auth.user?.role !== 'customer' && (
            <p className="mb-6 rounded-xl border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">Sign in as a customer to leave a review. Reviews are enabled after delivery.</p>
          )}
          {isLoadingReviews ? (
            <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading customer reviews…</div>
          ) : reviews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center">
              <FiStar className="mx-auto h-8 w-8 text-amber-400" />
              <h3 className="mt-3 font-semibold">Be the first to review</h3>
              <p className="mt-1 text-sm text-muted-foreground">There are no customer reviews for this product yet.</p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="mb-5 flex items-end gap-2">
                  <span className="text-5xl font-bold tracking-tight">{averageReviewRating.toFixed(1)}</span>
                  <span className="pb-1 text-sm text-muted-foreground">out of 5</span>
                </div>
                <div className="mb-5 flex gap-1" aria-label={`${averageReviewRating.toFixed(1)} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <FiStar key={rating} className={`h-4 w-4 ${rating <= Math.round(averageReviewRating) ? 'fill-amber-400 text-amber-500' : 'text-muted-foreground/30'}`} />
                  ))}
                </div>
                <p className="mb-4 text-xs text-muted-foreground">{reviews.length} verified {reviews.length === 1 ? 'review' : 'reviews'}</p>
                <div className="space-y-2.5">
                  {reviewDistribution.map(({ rating, count }) => (
                    <div key={rating} className="flex items-center gap-2 text-xs">
                      <span className="w-3 text-muted-foreground">{rating}</span>
                      <FiStar className="h-3 w-3 fill-amber-400 text-amber-500" />
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-amber-400"
                          style={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="w-5 text-right text-muted-foreground">{count}</span>
                    </div>
                  ))}
                </div>
              </aside>
              <div className="space-y-3">
                {reviews.map((review) => (
                  <article key={review._id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {(typeof review.userId === 'string' ? 'C' : review.userId.fullName.trim().charAt(0).toUpperCase()) || 'C'}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {typeof review.userId === 'string' ? 'Customer' : review.userId.fullName}
                          </p>
                          <time className="mt-0.5 block text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </time>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                        <FiStar className="h-3 w-3 fill-amber-400 text-amber-500" />
                        {review.rating}.0
                      </div>
                    </div>
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-foreground/85">{review.comment}</p>
                    <p className="mt-4 border-t border-border pt-3 text-[11px] font-medium text-green-700">Verified purchase</p>
                  </article>
                ))}
              </div>
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