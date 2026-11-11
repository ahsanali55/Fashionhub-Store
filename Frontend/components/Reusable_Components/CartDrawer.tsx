'use client';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { RootState } from '@/redux/store';
import { formatPrice } from '@/lib/utils';
import {
  removeFromCart,
  updateQuantity,
  toggleCart,
} from '@/redux/slices/cartSlice';

import {
  FiX,
  FiTrash2,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiArrowRight,
} from 'react-icons/fi';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { isOpen, items, total } = useAppSelector(
    (state: RootState) => state.cart
  );

  const handleCheckout = () => {
    dispatch(toggleCart());
    router.push('/checkout');
  };

  const handleIncrease = (item: any) => {
    if (item.quantity < item.stock) {
      dispatch(
        updateQuantity({
          id: item.id,
          quantity: item.quantity + 1,
        })
      );
    }
  };

  const handleDecrease = (item: any) => {
    if (item.quantity > 1) {
      dispatch(
        updateQuantity({
          id: item.id,
          quantity: item.quantity - 1,
        })
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(toggleCart())}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 "
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              damping: 28,
              stiffness: 260,
            }}
            className="
              fixed
              right-0
              top-0
              h-full
              w-full
              sm:max-w-md
              bg-background
              text-foreground
              shadow-2xl
              z-50
              flex
              flex-col
              border-l
              border-border
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div>
                <div className="flex items-center gap-2">
                  <FiShoppingBag className="w-5 h-5" />

                  <h2 className="text-lg font-bold">
                    Your Cart
                  </h2>
                </div>

                {items.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {items.length} unique item
                    {items.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <button
                onClick={() => dispatch(toggleCart())}
                aria-label="Close cart"
                className="
                  w-9
                  h-9
                  rounded-full
                  flex
                  items-center
                  justify-center
                  hover:bg-muted
                  transition
                "
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div
                    className="
                      w-16
                      h-16
                      rounded-full
                      bg-muted
                      flex
                      items-center
                      justify-center
                      mb-5
                    "
                  >
                    <FiShoppingBag className="w-7 h-7 text-muted-foreground" />
                  </div>

                  <h3 className="text-lg font-bold mb-2">
                    Your cart is empty
                  </h3>

                  <p className="text-sm text-muted-foreground max-w-xs mb-6">
                    Looks like you haven't added anything yet.
                  </p>

                  <Link
                    href="/shop"
                    onClick={() => dispatch(toggleCart())}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      px-5
                      py-3
                      rounded-lg
                      bg-primary
                      text-primary-foreground
                      text-sm
                      font-semibold
                      hover:opacity-90
                      transition
                    "
                  >
                    Start Shopping
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="
                        flex
                        gap-4
                        pb-5
                        border-b
                        border-border
                      "
                    >
                      {/* Product Image */}
                      <Link
                        href={`/product/${item.id}`}
                        onClick={() => dispatch(toggleCart())}
                        className="
                          w-20
                          h-24
                          shrink-0
                          overflow-hidden
                          rounded-lg
                          bg-muted
                        "
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="
                            w-full
                            h-full
                            object-cover
                            transition-transform
                            duration-300
                            hover:scale-105
                          "
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            {item.brand && (
                              <p className="
                                text-[10px]
                                uppercase
                                tracking-wider
                                font-semibold
                                text-muted-foreground
                                mb-1
                              ">
                                {item.brand}
                              </p>
                            )}

                            <Link
                              href={`/product/${item.id}`}
                              onClick={() => dispatch(toggleCart())}
                              className="
                                text-sm
                                font-semibold
                                line-clamp-2
                                hover:text-primary
                                transition
                              "
                            >
                              {item.name}
                            </Link>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() =>
                              dispatch(removeFromCart(item.id))
                            }
                            aria-label={`Remove ${item.name}`}
                            className="
                              shrink-0
                              p-1.5
                              rounded-md
                              text-muted-foreground
                              hover:text-destructive
                              hover:bg-muted
                              transition
                            "
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm font-bold">
                            {formatPrice(item.price)}
                          </span>

                          {/* Quantity */}
                          <div
                            className="
                              flex
                              items-center
                              border
                              border-border
                              rounded-lg
                              overflow-hidden
                            "
                          >
                            <button
                              onClick={() => handleDecrease(item)}
                              disabled={item.quantity <= 1}
                              className="
                                w-8
                                h-8
                                flex
                                items-center
                                justify-center
                                hover:bg-muted
                                disabled:opacity-30
                                transition
                              "
                            >
                              <FiMinus className="w-3 h-3" />
                            </button>

                            <span
                              className="
                                w-8
                                text-center
                                text-sm
                                font-semibold
                              "
                            >
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => handleIncrease(item)}
                              disabled={item.quantity >= item.stock}
                              className="
                                w-8
                                h-8
                                flex
                                items-center
                                justify-center
                                hover:bg-muted
                                disabled:opacity-30
                                transition
                              "
                            >
                              <FiPlus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Item subtotal */}
                        <p className="
                          text-xs
                          text-muted-foreground
                          mt-2
                          text-right
                        ">
                          Subtotal: 
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                className="
                  border-t
                  border-border
                  px-6
                  py-5
                  bg-background
                "
              >
                {/* Summary */}
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal
                    </span>

                    <span className="font-medium">
                      {formatPrice(total)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Shipping
                    </span>

                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Free
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-border">
                    <span className="font-bold">
                      Total
                    </span>

                    <span className="text-xl font-bold text-primary">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      className="
                        w-full
                        h-12
                        rounded-lg
                        bg-primary
                        text-primary-foreground
                        font-semibold
                        hover:opacity-90
                        transition
                        disabled:opacity-50
                        flex
                        items-center
                        justify-center
                      "
                    >
                      Checkout
                    </button>

                    <button
                      onClick={() => dispatch(toggleCart())}
                      className="
                        w-full
                        h-11
                        rounded-lg
                        border
                        border-border
                        font-medium
                        text-sm
                        hover:bg-muted
                        transition
                      "
                    >
                      Continue Shopping
                    </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}