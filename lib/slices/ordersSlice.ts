import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: { id: string; name: string; quantity: number }[];
}

interface OrdersState {
  items: Order[];
}

const initialState: OrdersState = {
  items: [
    {
      id: 'ORD-001',
      date: '2024-05-15',
      total: 259.98,
      status: 'delivered',
      items: [{ id: '1', name: 'Premium Denim Jacket', quantity: 2 }],
    },
    {
      id: 'ORD-002',
      date: '2024-05-20',
      total: 199.99,
      status: 'shipped',
      items: [{ id: '2', name: 'Silk Evening Dress', quantity: 1 }],
    },
  ],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.items.push(action.payload);
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: Order['status'] }>) => {
      const order = state.items.find(o => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },
  },
});

export const { addOrder, updateOrderStatus } = ordersSlice.actions;
export default ordersSlice.reducer;
