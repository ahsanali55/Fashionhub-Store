import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  supplier: string;
  description: string;
  inStock: boolean;
}

interface ProductsState {
  items: Product[];
  filtered: Product[];
  selectedCategory: string;
}

const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Denim Jacket',
    category: 'jackets',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=300&h=300&fit=crop',
    rating: 4.8,
    reviews: 234,
    supplier: 'StyleCo',
    description: 'Classic denim jacket with premium quality',
    inStock: true,
  },
  {
    id: '2',
    name: 'Silk Evening Dress',
    category: 'dresses',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1595777712802-34e6d1b3b900?w=300&h=300&fit=crop',
    rating: 4.9,
    reviews: 456,
    supplier: 'Elegance',
    description: 'Luxurious silk evening dress',
    inStock: true,
  },
  {
    id: '3',
    name: 'Athletic Training Shoes',
    category: 'shoes',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    rating: 4.7,
    reviews: 567,
    supplier: 'SportGear',
    description: 'High-performance athletic training shoes',
    inStock: true,
  },
  {
    id: '4',
    name: 'Wool Cardigan',
    category: 'sweaters',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1609902726285-97c33fd1b006?w=300&h=300&fit=crop',
    rating: 4.6,
    reviews: 189,
    supplier: 'WarmKnits',
    description: 'Cozy wool cardigan for all seasons',
    inStock: true,
  },
  {
    id: '5',
    name: 'Designer Sunglasses',
    category: 'accessories',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop',
    rating: 4.9,
    reviews: 345,
    supplier: 'LuxVision',
    description: 'Premium designer sunglasses',
    inStock: true,
  },
  {
    id: '6',
    name: 'Linen Shirt',
    category: 'shirts',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1596784404467-bf437d714e4d?w=300&h=300&fit=crop',
    rating: 4.5,
    reviews: 123,
    supplier: 'CasualWear',
    description: 'Breathable linen shirt',
    inStock: true,
  },
  {
    id: '7',
    name: 'Leather Handbag',
    category: 'bags',
    price: 179.99,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop',
    rating: 4.8,
    reviews: 278,
    supplier: 'LuxuryCraft',
    description: 'Genuine leather designer handbag',
    inStock: true,
  },
  {
    id: '8',
    name: 'Canvas Sneakers',
    category: 'shoes',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1548605528-1e5d01e5c68e?w=300&h=300&fit=crop',
    rating: 4.4,
    reviews: 412,
    supplier: 'UrbanStep',
    description: 'Classic canvas sneakers',
    inStock: false,
  },
];

const initialState: ProductsState = {
  items: dummyProducts,
  filtered: dummyProducts,
  selectedCategory: 'all',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    filterByCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      if (action.payload === 'all') {
        state.filtered = state.items;
      } else {
        state.filtered = state.items.filter(item => item.category === action.payload);
      }
    },
    searchProducts: (state, action: PayloadAction<string>) => {
      const query = action.payload.toLowerCase();
      state.filtered = state.items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    },
  },
});

export const { filterByCategory, searchProducts } = productsSlice.actions;
export default productsSlice.reducer;
