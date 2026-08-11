export type UserRole = "customer" | "supplier" | "admin";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}