import api from '@/lib/axios';
import type { Product } from '@/redux/slices/productsSlice';
import type { ApiResponse } from '@/services/commerce.services';

interface ApiProduct {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  stock: number;
  rating?: number;
  numReviews?: number;
  createdAt: string;
  supplier:
    | string
    | {
        _id: string;
        name?: string;
        fullName?: string;
      };
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<ApiResponse<ApiProduct[]>>('/products');

  return response.data.data.map((product) => ({
    id: product._id,
    name: product.name,
    category: product.category,
    price: product.price,
    image: product.image,
    description: product.description,
    stock: product.stock,
    inStock: product.stock > 0,
    rating: product.rating ?? 0,
    reviews: product.numReviews ?? 0,
    createdAt: product.createdAt,
    supplier:
      typeof product.supplier === 'string'
        ? product.supplier
        : product.supplier.name ?? product.supplier.fullName ?? 'FashionHub Supplier',
    supplierId:
      typeof product.supplier === 'string'
        ? product.supplier
        : product.supplier._id,
    keywords: [],
    brand: '',
  }));
};
