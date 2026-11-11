import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addCartItem, getCart as fetchCart, removeCartItem } from '@/services/commerce.services';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
  brand?: string;
  category?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  isOpen: boolean;
  error: string | null;
}

interface CartThunkState {
  auth: { isAuthenticated: boolean };
  cart: CartState;
  products: {
    items: Array<{
      id: string;
      name: string;
      price: number;
      image: string;
      stock: number;
      brand?: string;
      category?: string;
    }>;
  };
}

const initialState: CartState = {
  items: [],
  total: 0,
  isOpen: false,
  error: null,
};

const calculateTotal = (items: CartItem[]) =>
  items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

export const loadCart = createAsyncThunk<CartItem[], void, { state: CartThunkState }>(
  'cart/load',
  async (_, { getState }) => {
    const state = getState();
    const cart = await fetchCart();
    return cart.items.flatMap((line) => {
      const productId = typeof line.productId === 'string' ? line.productId : line.productId._id;
      const product = state.products.items.find((item) => item.id === productId);
      if (typeof line.productId === 'string' && !product) {
        return [];
      }
      const populated = typeof line.productId === 'string' ? null : line.productId;
      return [{
        id: productId,
        name: populated?.name ?? product?.name ?? '',
        price: populated?.price ?? product?.price ?? 0,
        image: populated?.image ?? product?.image ?? '',
        stock: product?.stock ?? line.quantity,
        brand: product?.brand,
        category: product?.category,
        quantity: line.quantity,
      }];
    });
  },
);

export const addToCart = createAsyncThunk<CartItem, CartItem, { state: CartThunkState }>(
  'cart/add',
  async (product, { getState }) => {
    const state = getState();
    const existing = state.cart.items.find((item) => item.id === product.id);
    const item = {
      ...product,
      quantity: Math.min((existing?.quantity ?? 0) + product.quantity, product.stock),
    };
    if (state.auth.isAuthenticated) {
      await addCartItem(item.id, item.quantity);
    }
    return item;
  },
);

export const removeFromCart = createAsyncThunk<string, string, { state: CartThunkState }>(
  'cart/remove',
  async (productId, { getState }) => {
    if (getState().auth.isAuthenticated) {
      await removeCartItem(productId);
    }
    return productId;
  },
);

export const updateQuantity = createAsyncThunk<
  { id: string; quantity: number },
  { id: string; quantity: number },
  { state: CartThunkState }
>(
  'cart/updateQuantity',
  async ({ id, quantity }, { getState }) => {
    const state = getState();
    const item = state.cart.items.find((cartItem) => cartItem.id === id);
    const nextQuantity = Math.min(Math.max(1, quantity), item?.stock ?? quantity);
    if (state.auth.isAuthenticated) {
      await addCartItem(id, nextQuantity);
    }
    return { id, quantity: nextQuantity };
  },
);

const cartSlice = createSlice({
  name: 'cart',

  initialState,

  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.error = null;
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = calculateTotal(state.items);
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const existing = state.items.find((item) => item.id === action.payload.id);
        if (existing) {
          existing.quantity = action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
        state.total = calculateTotal(state.items);
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.total = calculateTotal(state.items);
        state.error = null;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        const item = state.items.find((cartItem) => cartItem.id === action.payload.id);
        if (item) item.quantity = action.payload.quantity;
        state.total = calculateTotal(state.items);
        state.error = null;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith('cart/') &&
          action.type.endsWith('/rejected'),
        (state, action: { error?: { message?: string } }) => {
          state.error = action.error?.message ?? 'Cart request failed.';
        },
      );
  },
});

export const { clearCart, toggleCart } = cartSlice.actions;

export default cartSlice.reducer;