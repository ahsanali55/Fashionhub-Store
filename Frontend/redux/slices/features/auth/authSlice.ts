import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  registerCustomer,
  loginCustomer,
  getCurrentUser,
  logoutCustomer,
} from "@/services/auth.services";

import type { AuthState, AuthUser } from "./authTypes";

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  role: "customer" | "supplier";
}

interface LoginPayload {
  email: string;
  password: string;
}

// Register
export const register = createAsyncThunk<
  AuthUser,
  RegisterPayload,
  { rejectValue: string }
>("auth/register", async (data, { rejectWithValue }) => {
  try {
    const response = await registerCustomer(data);

    return response.data.user;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Registration failed.",
    );
  }
});

// Login
export const login = createAsyncThunk<
  AuthUser,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (data, { rejectWithValue }) => {
  try {
    const response = await loginCustomer(data);

    return response.data.user;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed.");
  }
});

// Get current user
export const fetchCurrentUser = createAsyncThunk<
  AuthUser,
  void,
  { rejectValue: string }
>("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await getCurrentUser();
    console.log("getCurrentUser response: ", response.data);
    return response.data.user;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Unable to fetch user.",
    );
  }
});

// Logout
export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutCustomer();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Logout failed.");
    }
  },
);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },

    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },

  extraReducers: (builder) => {
    // -------------------------
    // REGISTER
    // -------------------------

    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Registration failed.";
      });

    // -------------------------
    // LOGIN
    // -------------------------

    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed.";
      });

    // -------------------------
    // CURRENT USER
    // -------------------------

    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })

      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    // -------------------------
    // LOGOUT
    // -------------------------

    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })

      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Logout failed.";
      });
  },
});

export const { clearAuthError, setUser } = authSlice.actions;

export default authSlice.reducer;

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: 'customer' | 'supplier' | 'admin';
//   avatar: string;
//   joinedDate?: string;
//   phone?: string;
//   businessName?: string;
//   category?: string;
//   address?: string;
// }
// Demo users for development
// export const DEMO_USERS = {
//   customer: {
//     id: 'cust-001',
//     name: 'Sarah Johnson',
//     email: 'sarah@example.com',
//     role: 'customer' as const,
//     avatar: 'https://i.pravatar.cc/150?img=1',
//     joinedDate: '2024-01-15',
//     phone: '+1 (555) 123-4567',
//   },
//   supplier: {
//     id: 'supp-001',
//     name: 'Fashion Plus Co.',
//     email: 'contact@fashionplus.com',
//     role: 'supplier' as const,
//     avatar: 'https://i.pravatar.cc/150?img=2',
//     joinedDate: '2023-06-20',
//     phone: '+1 (555) 234-5678',
//   },
//   admin: {
//     id: 'admin-001',
//     name: 'Alex Rivera',
//     email: 'admin@fashionhub.com',
//     role: 'admin' as const,
//     avatar: 'https://i.pravatar.cc/150?img=3',
//     joinedDate: '2023-01-01',
//     phone: '+1 (555) 345-6789',
//   },
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setUser: (state, action: PayloadAction<User>) => {
//       state.user = action.payload;
//       state.isAuthenticated = true;
//       state.error = null;
//     },
//     logout: (state) => {
//       state.user = null;
//       state.isAuthenticated = false;
//       state.error = null;
//     },
//     setLoading: (state, action: PayloadAction<boolean>) => {
//       state.loading = action.payload;
//     },
//     setError: (state, action: PayloadAction<string | null>) => {
//       state.error = action.payload;
//     },
//     login: (state, action: PayloadAction<{ email: string; password: string; role?: 'customer' | 'supplier' | 'admin' }>) => {
//       // Demo login - in production, this would call an API
//       const { email, role = 'customer' } = action.payload;
//       const demoUser = DEMO_USERS[role];

//       if (email === demoUser.email) {
//         state.user = demoUser;
//         state.isAuthenticated = true;
//         state.error = null;
//       } else {
//         state.error = 'Invalid email or password';
//       }
//     },
//     register: (state, action: PayloadAction<{ name: string; email: string; password: string; role: 'customer' | 'supplier' }>) => {
//       // Demo registration - in production, this would call an API
//       const { name, email, role } = action.payload;
//       state.user = {
//         id: `${role}-${Date.now()}`,
//         name,
//         email,
//         role,
//         avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
//         joinedDate: new Date().toISOString().split('T')[0],
//       };
//       state.isAuthenticated = true;
//       state.error = null;
//     },
//     updateProfile: (state, action: PayloadAction<Partial<User>>) => {
//       if (state.user) {
//         state.user = { ...state.user, ...action.payload };
//         state.error = null;
//       }
//     },
//   },
// });

// export const { setUser, logout, setLoading, setError, login, register, updateProfile } = authSlice.actions;
// export default authSlice.reducer;
