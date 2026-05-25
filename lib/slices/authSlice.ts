import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'supplier' | 'admin';
  avatar: string;
  joinedDate?: string;
  phone?: string;
  businessName?: string;
  category?: string;
  address?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Demo users for development
export const DEMO_USERS = {
  customer: {
    id: 'cust-001',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'customer' as const,
    avatar: 'https://i.pravatar.cc/150?img=1',
    joinedDate: '2024-01-15',
    phone: '+1 (555) 123-4567',
  },
  supplier: {
    id: 'supp-001',
    name: 'Fashion Plus Co.',
    email: 'contact@fashionplus.com',
    role: 'supplier' as const,
    avatar: 'https://i.pravatar.cc/150?img=2',
    joinedDate: '2023-06-20',
    phone: '+1 (555) 234-5678',
  },
  admin: {
    id: 'admin-001',
    name: 'Alex Rivera',
    email: 'admin@fashionhub.com',
    role: 'admin' as const,
    avatar: 'https://i.pravatar.cc/150?img=3',
    joinedDate: '2023-01-01',
    phone: '+1 (555) 345-6789',
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    login: (state, action: PayloadAction<{ email: string; password: string; role?: 'customer' | 'supplier' | 'admin' }>) => {
      // Demo login - in production, this would call an API
      const { email, role = 'customer' } = action.payload;
      const demoUser = DEMO_USERS[role];
      
      if (email === demoUser.email) {
        state.user = demoUser;
        state.isAuthenticated = true;
        state.error = null;
      } else {
        state.error = 'Invalid email or password';
      }
    },
    register: (state, action: PayloadAction<{ name: string; email: string; password: string; role: 'customer' | 'supplier' }>) => {
      // Demo registration - in production, this would call an API
      const { name, email, role } = action.payload;
      state.user = {
        id: `${role}-${Date.now()}`,
        name,
        email,
        role,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        joinedDate: new Date().toISOString().split('T')[0],
      };
      state.isAuthenticated = true;
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        state.error = null;
      }
    },
  },
});

export const { setUser, logout, setLoading, setError, login, register, updateProfile } = authSlice.actions;
export default authSlice.reducer;
