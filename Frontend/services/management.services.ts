import api from '@/lib/axios';
import type { ApiResponse } from '@/services/commerce.services';

export interface BackendProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating?: number;
  numReviews?: number;
  createdAt?: string;
  isVisible?: boolean;
  supplier:
    | string
    | {
        _id: string;
        name?: string;
        fullName?: string;
        email?: string;
      };
}

export interface CategoryRecord {
  _id: string;
  name: string;
  description?: string;
}

export interface AdminUser {
  _id: string;
  fullName: string;
  email: string;
  role: 'customer' | 'supplier' | 'admin';
  status?: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  createdAt: string;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalSuppliers: number;
  totalOrders: number;
  totalRevenue: number;
  ordersOverTime: Array<{
    _id: string;
    count: number;
    revenue: number;
  }>;
}

export interface TopProduct {
  _id: string;
  name: string;
  totalSold: number;
  totalRevenue: number;
}

export interface SupplierAnalytics {
  totalProducts: number;
  totalStock: number;
  totalOrders: number;
  totalItemsSold: number;
  totalRevenue: number;
  averageRating: number;
}

export const getCategories = async (): Promise<CategoryRecord[]> =>
  (await api.get<ApiResponse<CategoryRecord[]>>('/categories')).data.data;

export const createProduct = async (input: {
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image: File;
}): Promise<BackendProduct> => {
  const formData = new FormData();
  formData.append('name', input.name);
  formData.append('category', input.category);
  formData.append('description', input.description);
  formData.append('price', String(input.price));
  formData.append('stock', String(input.stock));
  formData.append('image', input.image);

  return (await api.post<ApiResponse<BackendProduct>>('/products', formData, {
    headers: { 'Content-Type': undefined },
  })).data.data;
};

export const updateProduct = async (
  productId: string,
  input: {
    name: string;
    category: string;
    description: string;
    price: number;
    stock: number;
    imageFile?: File;
  },
): Promise<BackendProduct> => {
  const formData = new FormData();
  formData.append('name', input.name);
  formData.append('category', input.category);
  formData.append('description', input.description);
  formData.append('price', String(input.price));
  formData.append('stock', String(input.stock));
  if (input.imageFile) formData.append('image', input.imageFile);

  return (await api.put<ApiResponse<BackendProduct>>(`/products/${productId}`, formData, {
    headers: { 'Content-Type': undefined },
  })).data.data;
};

export const deleteProduct = async (productId: string): Promise<void> => {
  await api.delete(`/products/${productId}`);
};

export const setProductVisibility = async (
  productId: string,
  isVisible: boolean,
): Promise<BackendProduct> =>
  (await api.patch<ApiResponse<BackendProduct>>(`/products/${productId}/visibility`, {
    isVisible,
  })).data.data;

export const getAllProductsForManagement = async (): Promise<BackendProduct[]> =>
  (await api.get<ApiResponse<BackendProduct[]>>('/products/admin/all')).data.data;

export const getUsers = async (): Promise<AdminUser[]> =>
  (await api.get<ApiResponse<AdminUser[]>>('/admin/users')).data.data;

export const setUserActive = async (
  userId: string,
  isActive: boolean,
): Promise<AdminUser> =>
  (await api.patch<ApiResponse<AdminUser>>(`/admin/users/${userId}/status`, {
    isActive,
  })).data.data;

export const approveSupplier = async (supplierId: string): Promise<AdminUser> =>
  (await api.patch<ApiResponse<AdminUser>>(`/admin/suppliers/${supplierId}/approve`)).data.data;

export const rejectSupplier = async (supplierId: string): Promise<AdminUser> =>
  (await api.patch<ApiResponse<AdminUser>>(`/admin/suppliers/${supplierId}/reject`)).data.data;

export const getAdminAnalytics = async (): Promise<AdminAnalytics> =>
  (await api.get<ApiResponse<AdminAnalytics>>('/analytics/admin')).data.data;

export const getTopProducts = async (): Promise<TopProduct[]> =>
  (await api.get<ApiResponse<TopProduct[]>>('/analytics/admin/top-products')).data.data;

export const getSupplierAnalytics = async (): Promise<SupplierAnalytics> =>
  (await api.get<ApiResponse<SupplierAnalytics>>('/analytics/supplier')).data.data;
