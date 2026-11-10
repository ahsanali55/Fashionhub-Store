import api from '@/lib/axios';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CartLine {
  productId: string | {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

export interface Cart {
  _id: string;
  items: CartLine[];
}

export interface Wishlist {
  _id: string;
  products: Array<string | {
    _id: string;
    name: string;
    price: number;
    image: string;
  }>;
}

export interface OrderItemInput {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export interface Order {
  _id: string;
  items: Array<OrderItemInput & { status?: OrderStatus }>;
  total: number;
  status: OrderStatus;
  createdAt: string;
  userId?: string | { _id: string; fullName: string; email: string };
  shippingAddress?: ShippingAddress;
}

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId: string | { _id?: string; fullName: string; avatar?: string };
}

export interface NotificationRecord {
  _id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  orderId?: string;
  productId?: string;
  status?: OrderStatus;
}

export const getCart = async (): Promise<Cart> =>
  (await api.get<ApiResponse<Cart>>('/cart')).data.data;

export const addCartItem = async (
  productId: string,
  quantity: number,
): Promise<Cart> =>
  (await api.post<ApiResponse<Cart>>('/cart', { productId, quantity })).data.data;

export const removeCartItem = async (productId: string): Promise<Cart> =>
  (await api.delete<ApiResponse<Cart>>(`/cart/${productId}`)).data.data;

export const getWishlist = async (): Promise<Wishlist> =>
  (await api.get<ApiResponse<Wishlist>>('/wishlist')).data.data;

export const toggleWishlistItem = async (productId: string): Promise<Wishlist> =>
  (await api.post<ApiResponse<Wishlist>>('/wishlist/toggle', { productId })).data.data;

export const createOrder = async (input: {
  items: Array<Pick<OrderItemInput, 'productId' | 'quantity'>>;
  shippingAddress: ShippingAddress;
  paymentMethod?: string;
}): Promise<Order> =>
  (await api.post<ApiResponse<Order>>('/orders', input)).data.data;

export const getOrderStatus = (order: Pick<Order, 'items' | 'status'>): OrderStatus => {
  const statuses = order.items.map((item) => item.status).filter(
    (status): status is OrderStatus => Boolean(status),
  );
  if (statuses.length === 0) return order.status;
  const progression: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered'];
  return statuses.reduce((earliest, status) =>
    progression.indexOf(status) < progression.indexOf(earliest) ? status : earliest,
  );
};

export const getMyOrders = async (): Promise<Order[]> =>
  (await api.get<ApiResponse<Order[]>>('/orders/my')).data.data;

export const getSupplierOrders = async (): Promise<Order[]> =>
  (await api.get<ApiResponse<Order[]>>('/orders/supplier/orders')).data.data;

export const getAdminOrders = async (): Promise<Order[]> =>
  (await api.get<ApiResponse<Order[]>>('/orders/admin/orders')).data.data;

export const updateOrderItemStatus = async (
  orderId: string,
  productId: string,
  status: 'pending' | 'processing' | 'shipped' | 'delivered',
): Promise<Order> =>
  (await api.patch<ApiResponse<Order>>(`/orders/${orderId}/status`, {
    productId,
    status,
  })).data.data;

export const getOrder = async (orderId: string): Promise<Order> =>
  (await api.get<ApiResponse<Order>>(`/orders/${orderId}`)).data.data;

export const getProductReviews = async (productId: string): Promise<Review[]> =>
  (await api.get<ApiResponse<Review[]>>(`/products/${productId}/reviews`)).data.data;

export const createProductReview = async (
  productId: string,
  input: { rating: number; comment: string },
): Promise<Review> =>
  (await api.post<ApiResponse<Review>>(`/products/${productId}/reviews`, input)).data.data;

export const getMyNotifications = async (): Promise<NotificationRecord[]> =>
  (await api.get<ApiResponse<NotificationRecord[]>>('/notifications/my')).data.data;

export const getAdminNotifications = async (): Promise<NotificationRecord[]> =>
  (await api.get<ApiResponse<NotificationRecord[]>>('/notifications/admin/all')).data.data;

export const markNotificationRead = async (
  id: string,
): Promise<NotificationRecord> =>
  (await api.patch<ApiResponse<NotificationRecord>>(`/notifications/${id}/read`)).data.data;
