import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getWishlist as fetchWishlist, toggleWishlistItem } from '@/services/commerce.services';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  brand?: string;
  category?: string;
}

interface WishlistState {
  items: WishlistItem[];
  error: string | null;
}

interface WishlistThunkState {
  auth: { isAuthenticated: boolean };
  wishlist: WishlistState;
  products: { items: Array<WishlistItem & { id: string; stock?: number; category?: string; brand?: string }> };
}

const initialState: WishlistState = {
  items: [],
  error: null,
};

export const loadWishlist = createAsyncThunk<WishlistItem[], void, { state: WishlistThunkState }>(
  'wishlist/load',
  async (_, { getState }) => {
    const state = getState();
    const wishlist = await fetchWishlist();
    return wishlist.products.flatMap((entry) => {
      const id = typeof entry === 'string' ? entry : entry._id;
      const product = state.products.items.find((item) => item.id === id);
      if (typeof entry === 'string' && !product) return [];
      return [{
        id,
        name: typeof entry === 'string' ? product?.name ?? '' : entry.name,
        price: typeof entry === 'string' ? product?.price ?? 0 : entry.price,
        image: typeof entry === 'string' ? product?.image ?? '' : entry.image,
        stock: product?.stock ?? 0,
        brand: product?.brand,
        category: product?.category,
      }];
    });
  },
);

export const addToWishlist = createAsyncThunk<
  WishlistItem,
  WishlistItem,
  { state: WishlistThunkState }
>(
  'wishlist/add',
  async (product, { getState }) => {
    if (getState().auth.isAuthenticated) {
      await toggleWishlistItem(product.id);
    }
    return product;
  },
);

export const removeFromWishlist = createAsyncThunk<
  string,
  string,
  { state: WishlistThunkState }
>(
  'wishlist/remove',
  async (productId, { getState }) => {
    const exists = getState().wishlist.items.some((item) => item.id === productId);
    if (exists && getState().auth.isAuthenticated) {
      await toggleWishlistItem(productId);
    }
    return productId;
  },
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        if (!state.items.some((item) => item.id === action.payload.id)) {
          state.items.push(action.payload);
        }
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.error = null;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith('wishlist/') &&
          action.type.endsWith('/rejected'),
        (state, action: { error?: { message?: string } }) => {
          state.error = action.error?.message ?? 'Wishlist request failed.';
        },
      );
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
