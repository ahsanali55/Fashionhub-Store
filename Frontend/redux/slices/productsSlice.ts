import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { getProducts, getSupplierProducts } from '@/services/product.services';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  keywords: string[];
  brand: string;
  rating: number;
  reviews: number;
  supplier: string;
  supplierId?: string;
  description: string;
  inStock: boolean;
  stock: number;
  createdAt: string;
  isNew?: boolean;
  isVisible?: boolean;
}

interface ProductsState {
  items: Product[];
  filtered: Product[];
  loading: boolean;
  error: string | null;
  selectedCategory: string;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
}

const initialState: ProductsState = {
  items: [],
  filtered: [],
  loading: false,
  error: null,
  selectedCategory: 'all',
  searchQuery: '',
  minPrice: 0,
  maxPrice: 0,
  inStockOnly: false,
};

export const loadProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string; state: { auth: { user: { role: string } | null } } }
>('products/load', async (_, { rejectWithValue, getState }) => {
  try {
    return getState().auth.user?.role === 'supplier'
      ? await getSupplierProducts()
      : await getProducts();
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Unable to load products.',
      );
    }

    return rejectWithValue(
      error instanceof Error ? error.message : 'Unable to load products.',
    );
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    filterByCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    searchProducts: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setPriceRange: (
      state,
      action: PayloadAction<{ min: number; max: number }>,
    ) => {
      state.minPrice = action.payload.min;
      state.maxPrice = action.payload.max;
    },
    setInStockOnly: (state, action: PayloadAction<boolean>) => {
      state.inStockOnly = action.payload;
    },
    resetFilters: (state) => {
      state.selectedCategory = 'all';
      state.searchQuery = '';
      const prices = state.items.map((product) => product.price);
      state.minPrice = prices.length ? Math.floor(Math.min(...prices)) : 0;
      state.maxPrice = prices.length ? Math.ceil(Math.max(...prices)) : 0;
      state.inStockOnly = false;
      state.filtered = state.items;
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((product) => product.id !== action.payload);
      state.filtered = state.filtered.filter((product) => product.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.items = [];
        state.filtered = [];
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.filtered = action.payload;
        const prices = action.payload.map((product) => product.price);
        state.minPrice = prices.length ? Math.floor(Math.min(...prices)) : 0;
        state.maxPrice = prices.length ? Math.ceil(Math.max(...prices)) : 0;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to load products.';
      });
  },
});

export const {
  filterByCategory,
  searchProducts,
  setPriceRange,
  setInStockOnly,
  resetFilters,
  removeProduct,
} = productsSlice.actions;

export default productsSlice.reducer;
