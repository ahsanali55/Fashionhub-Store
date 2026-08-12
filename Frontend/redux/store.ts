import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/features/auth/authSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import productsReducer from './slices/productsSlice';
import ordersReducer from './slices/ordersSlice';
import notificationsReducer from './slices/notificationsSlice';
import uiReducer from './slices/uiSlice';
import type { AuthState } from './slices/features/auth/authTypes';

const createPreloadedState = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    const savedAuth = window.localStorage.getItem('fh-auth');
    if (!savedAuth) {
      return undefined;
    }

    const parsed = JSON.parse(savedAuth);
    if (parsed?.user && parsed?.isAuthenticated) {
      const authState: AuthState = {
        user: parsed.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

      return {
        auth: authState,
      };
    }
  } catch (error) {
    console.error('Failed to restore persisted auth state:', error);
  }

  return undefined;
};

const preloadedState = createPreloadedState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    products: productsReducer,
    orders: ordersReducer,
    notifications: notificationsReducer,
    ui: uiReducer,
  },
  preloadedState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
