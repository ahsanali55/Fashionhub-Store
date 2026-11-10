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
  recoveryQuestion: string;
  recoveryAnswer: string;
  role: "customer" | "supplier";
}

interface LoginData {
  email: string;
  password: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface UserResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const registerCustomer = async (
  data: RegisterData
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    "/auth/register",
    data
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

export const updateProfile = async (data: Partial<Pick<AuthUser, "fullName" | "email">>) => {
  const response = await api.patch<UserResponse<AuthUser & { _id?: string }>>("/auth/profile", data);
  const user = response.data.data;
  return { ...user, id: user.id ?? user._id ?? "" };
};

export const updateAvatar = async (file: File): Promise<string> => {
  const form = new FormData();
  form.append("avatar", file);
  const response = await api.patch<UserResponse<{ avatar: string }>>("/auth/avatar", form, {
    headers: { "Content-Type": undefined },
  });
  return response.data.data.avatar;
};

export const updateNotificationPreference = async (
  notificationsEnabled: boolean,
): Promise<boolean> => {
  const response = await api.patch<UserResponse<{ notificationsEnabled: boolean }>>(
    "/auth/notification-preference",
    { notificationsEnabled },
  );
  return response.data.data.notificationsEnabled;
};

export const changePassword = async (data: ChangePasswordData): Promise<void> => {
  await api.patch("/auth/password", data);
};

export const getPasswordRecoveryQuestion = async (email: string): Promise<string | null> => {
  const response = await api.post<UserResponse<{ question: string | null }>>(
    "/auth/password/recovery-question",
    { email },
  );
  return response.data.data.question;
};

export const recoverPassword = async (data: {
  email: string;
  recoveryAnswer: string;
  newPassword: string;
}): Promise<void> => {
  await api.post("/auth/password/recover", data);
};

export const setPasswordRecoveryQuestion = async (data: {
  currentPassword: string;
  recoveryQuestion: string;
  recoveryAnswer: string;
}): Promise<void> => {
  await api.patch("/auth/password/recovery-question", data);
};
