import api from "@/lib/axios";
import type { AuthUser } from "@/redux/slices/features/auth/authTypes";

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
  };
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  role?: "customer";
}

interface LoginData {
  email: string;
  password: string;
}

export const registerCustomer = async (
  data: RegisterData
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    "/auth/register",
    {
      ...data,
      role: "customer",
    }
  );

  return response.data;
};

export const loginCustomer = async (
  data: LoginData
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    data
  );

  return response.data;
};

export const getCurrentUser = async (): Promise<AuthResponse> => {
  const response = await api.get<AuthResponse>(
    "/auth/me"
  );

  return response.data;
};

export const logoutCustomer = async (): Promise<void> => {
  await api.post("/auth/logout");
};