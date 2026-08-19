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
import { addToWishlist } from '@/redux/slices/wishlistSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';

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

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleAddToWishlist = () => {
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
              onClick={handleAddToWishlist}
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
              "
            >
              <FiHeart size={19} />
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
              ${product.price.toFixed(2)}
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
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="
                  flex-1
                  h-12
                  rounded-lg
                  bg-primary
                  text-white
                  font-semibold
                  text-sm
                  flex
                  items-center
                  justify-center
                  gap-2
                  hover:bg-orange-600
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                <FiShoppingBag size={17} />
                {product.inStock ? 'Add to Cart' : 'Sold Out'}
              </motion.button>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToWishlist}
                className="
                  w-12
                  h-12
                  rounded-lg
                  border
                  border-border
                  flex
                  items-center
                  justify-center
                  hover:text-primary
                  hover:border-primary
                  transition
                "
              >
                <FiHeart size={18} />
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

                const outOfStock = !item.inStock;

                return (
                  <motion.article
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="group"
                  >

                    {/* Image */}
                    <div
                      className="
                        relative
                        aspect-[4/5]
                        overflow-hidden
                        rounded-xl
                        bg-muted
                      "
                    >

                      <Link href={`/product/${item.id}`}>
                        <img
                          src={item.image}
                          alt={item.name}
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


                      {/* Badge */}
                      {outOfStock && (
                        <span
                          className="
                            absolute
                            top-3
                            left-3
                            px-2.5
                            py-1
                            rounded-full
                            bg-foreground
                            text-white
                            text-[11px]
                            font-bold
                          "
                        >
                          SOLD OUT
                        </span>
                      )}


                      {/* Wishlist */}
                      <button
                        onClick={() =>
                          dispatch(addToWishlist(item))
                        }
                        aria-label="Add to wishlist"
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
                        "
                      >
                        <FiHeart size={18} />
                      </button>


                      {/* Quick Add */}
                      {!outOfStock && (
                        <button
                          onClick={() =>
                            dispatch(addToCart(item))
                          }
                          className="
                            absolute
                            bottom-3
                            left-3
                            right-3
                            h-11
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
                          <FiShoppingBag size={16} />
                          Add to Cart
                        </button>
                      )}

                    </div>


                    {/* Information */}
                    <div className="pt-4">

                      <p
                        className="
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                          text-muted-foreground
                          mb-1
                        "
                      >
                        {item.supplier}
                      </p>

                      <div className="flex items-start justify-between gap-3">

                        <Link
                          href={`/product/${item.id}`}
                          className="min-w-0"
                        >
                          <h3
                            className="
                              font-semibold
                              text-sm
                              md:text-base
                              truncate
                              hover:text-primary
                              transition
                            "
                          >
                            {item.name}
                          </h3>
                        </Link>

                        <span
                          className="
                            text-sm
                            font-bold
                            shrink-0
                          "
                        >
                          ${item.price.toFixed(2)}
                        </span>

                      </div>


                      {/* Category + Rating */}
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          mt-2
                        "
                      >

                        <span className="text-xs text-muted-foreground">
                          {item.category}
                        </span>

                        <span className="text-xs font-medium">
                          ★ {item.rating.toFixed(1)}
                          <span className="text-muted-foreground">
                            {' '}
                            ({item.reviews})
                          </span>
                        </span>

                      </div>


                      {/* View details */}
                      <Link
                        href={`/product/${item.id}`}
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
              })}

            </motion.div>

          </motion.section>
        )}

      </div>
    </main>
  );
}