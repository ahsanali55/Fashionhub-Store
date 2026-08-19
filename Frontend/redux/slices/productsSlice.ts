import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;

  // Search / filtering information
  keywords: string[];
  brand: string;

  // Product information
  rating: number;
  reviews: number;
  supplier: string;
  description: string;

  // Inventory
  inStock: boolean;
  stock: number;

  // UI / sorting
  createdAt: string;
  isNew?: boolean;
}

interface ProductsState {
  items: Product[];
  filtered: Product[];
  selectedCategory: string;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
}

const dummyProducts: Product[] = [
  // =========================
  // JACKETS
  // =========================
  {
    id: '1',
    name: 'Premium Denim Jacket',
    category: 'jackets',
    price: 129.99,
    image:
      'https://images.unsplash.com/photo-1555583743-991174c11425?q=80&w=687&auto=format&fit=crop',
    keywords: ['denim', 'casual', 'jacket', 'blue', 'winter'],
    brand: 'StyleCo',
    rating: 4.8,
    reviews: 234,
    supplier: 'StyleCo',
    description: 'Premium slim-fit denim jacket.',
    inStock: true,
    stock: 24,
    createdAt: '2026-08-15',
    isNew: true,
  },

  {
    id: '2',
    name: 'Leather Biker Jacket',
    category: 'jackets',
    price: 189.99,
    image:
      'https://plus.unsplash.com/premium_photo-1744395627361-7d8323c95cfc?q=80&w=1170&auto=format&fit=crop',
    keywords: ['leather', 'biker', 'jacket', 'black', 'motorcycle'],
    brand: 'UrbanWear',
    rating: 4.9,
    reviews: 182,
    supplier: 'UrbanWear',
    description: 'Classic leather biker jacket.',
    inStock: true,
    stock: 12,
    createdAt: '2026-08-10',
    isNew: true,
  },

  {
    id: '3',
    name: 'Bomber Jacket',
    category: 'jackets',
    price: 119.99,
    image:
      'https://images.unsplash.com/photo-1614848184342-fec060159c89?q=80&w=764&auto=format&fit=crop',
    keywords: ['bomber', 'jacket', 'casual', 'streetwear'],
    brand: 'FashionHub',
    rating: 4.7,
    reviews: 143,
    supplier: 'FashionHub',
    description: 'Modern bomber jacket.',
    inStock: true,
    stock: 31,
    createdAt: '2026-07-25',
  },

  {
    id: '4',
    name: 'Winter Puffer Jacket',
    category: 'jackets',
    price: 159.99,
    image:
      'https://images.unsplash.com/photo-1727515192207-3dc860bfd773?q=80&w=736&auto=format&fit=crop',
    keywords: ['puffer', 'winter', 'jacket', 'warm', 'outdoor'],
    brand: 'NorthWear',
    rating: 4.8,
    reviews: 298,
    supplier: 'NorthWear',
    description: 'Warm insulated puffer jacket.',
    inStock: true,
    stock: 18,
    createdAt: '2026-07-18',
  },

  // =========================
  // DRESSES
  // =========================
  {
    id: '5',
    name: 'Silk Evening Dress',
    category: 'dresses',
    price: 199.99,
    image:
      'https://plus.unsplash.com/premium_photo-1673481601147-ee95199d3896?q=80&w=687&auto=format&fit=crop',
    keywords: ['silk', 'evening', 'dress', 'formal', 'luxury'],
    brand: 'Elegance',
    rating: 4.9,
    reviews: 456,
    supplier: 'Elegance',
    description: 'Luxury silk evening dress.',
    inStock: true,
    stock: 9,
    createdAt: '2026-08-12',
    isNew: true,
  },

  {
    id: '6',
    name: 'Floral Summer Dress',
    category: 'dresses',
    price: 89.99,
    image:
      'https://images.unsplash.com/photo-1593105522065-9a6ecd21aeb2?q=80&w=687&auto=format&fit=crop',
    keywords: ['floral', 'summer', 'dress', 'casual', 'women'],
    brand: 'BloomWear',
    rating: 4.7,
    reviews: 165,
    supplier: 'BloomWear',
    description: 'Elegant floral summer dress.',
    inStock: true,
    stock: 26,
    createdAt: '2026-07-30',
  },

  {
    id: '8',
    name: 'Maxi Fashion Dress',
    category: 'dresses',
    price: 119.99,
    image:
      'https://plus.unsplash.com/premium_photo-1678197937465-bdbc4ed95815?q=80&w=687&auto=format&fit=crop',
    keywords: ['maxi', 'dress', 'fashion', 'elegant', 'casual'],
    brand: 'ModernWear',
    rating: 4.6,
    reviews: 198,
    supplier: 'ModernWear',
    description: 'Elegant maxi dress.',
    inStock: true,
    stock: 15,
    createdAt: '2026-07-20',
  },

  // =========================
  // SHOES
  // =========================
  {
    id: '9',
    name: 'Athletic Training Shoes',
    category: 'shoes',
    price: 99.99,
    image:
      'https://images.unsplash.com/photo-1637437757614-6491c8e915b5?q=80&w=1170&auto=format&fit=crop',
    keywords: ['athletic', 'training', 'shoes', 'sports', 'running'],
    brand: 'SportGear',
    rating: 4.8,
    reviews: 567,
    supplier: 'SportGear',
    description: 'High-performance training shoes.',
    inStock: true,
    stock: 42,
    createdAt: '2026-08-01',
    isNew: true,
  },

  {
    id: '10',
    name: 'White Sneakers',
    category: 'shoes',
    price: 84.99,
    image:
      'https://images.unsplash.com/photo-1695073621086-aa692bc32a3d?q=80&w=1170&auto=format&fit=crop',
    keywords: ['white', 'sneakers', 'shoes', 'casual', 'everyday'],
    brand: 'UrbanStep',
    rating: 4.7,
    reviews: 398,
    supplier: 'UrbanStep',
    description: 'Minimal everyday sneakers.',
    inStock: true,
    stock: 37,
    createdAt: '2026-07-28',
  },

  {
    id: '11',
    name: 'Leather Chelsea Boots',
    category: 'shoes',
    price: 149.99,
    image:
      'https://plus.unsplash.com/premium_photo-1729788891863-0d9b6f2b453b?q=80&w=1170&auto=format&fit=crop',
    keywords: ['leather', 'boots', 'chelsea', 'formal', 'shoes'],
    brand: 'ClassicFoot',
    rating: 4.9,
    reviews: 254,
    supplier: 'ClassicFoot',
    description: 'Premium leather Chelsea boots.',
    inStock: true,
    stock: 14,
    createdAt: '2026-07-15',
  },

  {
    id: '12',
    name: 'Canvas Casual Shoes',
    category: 'shoes',
    price: 74.99,
    image:
      'https://images.unsplash.com/photo-1612942910539-9ff28b2e00d3?q=80&w=1170&auto=format&fit=crop',
    keywords: ['canvas', 'casual', 'shoes', 'everyday', 'comfortable'],
    brand: 'StreetStyle',
    rating: 4.6,
    reviews: 318,
    supplier: 'StreetStyle',
    description: 'Comfortable everyday shoes.',
    inStock: true,
    stock: 29,
    createdAt: '2026-06-30',
  },

  // =========================
  // ACCESSORIES
  // =========================
  {
    id: '13',
    name: 'Luxury Sunglasses',
    category: 'accessories',
    price: 149.99,
    image:
      'https://plus.unsplash.com/premium_photo-1692809752539-fc7e9c347b14?q=80&w=687&auto=format&fit=crop',
    keywords: ['sunglasses', 'luxury', 'accessories', 'designer'],
    brand: 'LuxVision',
    rating: 4.9,
    reviews: 345,
    supplier: 'LuxVision',
    description: 'Designer sunglasses.',
    inStock: true,
    stock: 17,
    createdAt: '2026-08-05',
    isNew: true,
  },

  {
    id: '14',
    name: 'Leather Wallet',
    category: 'accessories',
    price: 69.99,
    image:
      'https://images.unsplash.com/photo-1614330315526-166f2d71e544?q=80&w=688&auto=format&fit=crop',
    keywords: ['wallet', 'leather', 'accessories', 'men'],
    brand: 'ClassicCraft',
    rating: 4.7,
    reviews: 222,
    supplier: 'ClassicCraft',
    description: 'Premium leather wallet.',
    inStock: true,
    stock: 44,
    createdAt: '2026-06-20',
  },

  {
    id: '15',
    name: 'Luxury Wrist Watch',
    category: 'accessories',
    price: 229.99,
    image:
      'https://images.unsplash.com/photo-1670177257750-9b47927f68eb?q=80&w=781&auto=format&fit=crop',
    keywords: ['watch', 'luxury', 'wristwatch', 'accessories'],
    brand: 'TimeLux',
    rating: 4.9,
    reviews: 512,
    supplier: 'TimeLux',
    description: 'Luxury stainless steel watch.',
    inStock: true,
    stock: 8,
    createdAt: '2026-07-10',
  },

  {
    id: '16',
    name: 'Leather Handbag',
    category: 'accessories',
    price: 179.99,
    image:
      'https://images.unsplash.com/photo-1603219527847-24c87f552a77?q=80&w=687&auto=format&fit=crop',
    keywords: ['handbag', 'leather', 'bag', 'women', 'accessories'],
    brand: 'LuxuryCraft',
    rating: 4.8,
    reviews: 278,
    supplier: 'LuxuryCraft',
    description: 'Elegant leather handbag.',
    inStock: true,
    stock: 11,
    createdAt: '2026-07-05',
  },

  // =========================
  // SHIRTS
  // =========================
  {
    id: '17',
    name: 'Premium Linen Shirt',
    category: 'shirts',
    price: 64.99,
    image:
      'https://plus.unsplash.com/premium_photo-1673125287084-e90996bad505?q=80&w=687&auto=format&fit=crop',
    keywords: ['linen', 'shirt', 'summer', 'casual', 'men'],
    brand: 'CasualWear',
    rating: 4.6,
    reviews: 156,
    supplier: 'CasualWear',
    description: 'Breathable linen shirt.',
    inStock: true,
    stock: 36,
    createdAt: '2026-06-15',
  },

  {
    id: '18',
    name: 'Oxford Cotton Shirt',
    category: 'shirts',
    price: 79.99,
    image:
      'https://images.unsplash.com/photo-1549037173-e3b717902c57?q=80&w=1170&auto=format&fit=crop',
    keywords: ['oxford', 'cotton', 'shirt', 'formal', 'office'],
    brand: 'UrbanWear',
    rating: 4.8,
    reviews: 268,
    supplier: 'UrbanWear',
    description: 'Classic Oxford cotton shirt.',
    inStock: true,
    stock: 28,
    createdAt: '2026-07-01',
  },

  {
    id: '19',
    name: 'Slim Fit Formal Shirt',
    category: 'shirts',
    price: 69.99,
    image:
      'https://media.istockphoto.com/id/1201022726/photo/stylish-man-wearing-sunglasses-and-white-shirt-city-life.jpg?s=2048x2048&w=is&k=20&c=NaSC4ufRKW46KwYlPPqguDPzQ_7K3SPzrC8H4vdbrw0=',
    keywords: ['formal', 'shirt', 'slim fit', 'office', 'men'],
    brand: 'EliteStyle',
    rating: 4.7,
    reviews: 214,
    supplier: 'EliteStyle',
    description: 'Modern slim-fit formal shirt.',
    inStock: true,
    stock: 19,
    createdAt: '2026-06-28',
  },

  {
    id: '20',
    name: 'Casual Checked Shirt',
    category: 'shirts',
    price: 59.99,
    image:
      'https://images.unsplash.com/photo-1744535814656-65f3cfa561bc?q=80&w=687&auto=format&fit=crop',
    keywords: ['checked', 'shirt', 'casual', 'streetwear'],
    brand: 'StreetWear',
    rating: 4.5,
    reviews: 175,
    supplier: 'StreetWear',
    description: 'Comfortable checked casual shirt.',
    inStock: true,
    stock: 33,
    createdAt: '2026-06-10',
  },
];

const prices = dummyProducts.map((product) => product.price);

const initialState: ProductsState = {
  items: dummyProducts,
  filtered: dummyProducts,
  selectedCategory: 'all',
  searchQuery: '',
  minPrice: Math.floor(Math.min(...prices)),
  maxPrice: Math.ceil(Math.max(...prices)),
  inStockOnly: false,
};

const productsSlice = createSlice({
  name: 'products',

  initialState,

  reducers: {
    filterByCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },

    searchProducts: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    setPriceRange: (
      state,
      action: PayloadAction<{ min: number; max: number }>
    ) => {
      state.minPrice = action.payload.min;
      state.maxPrice = action.payload.max;
    },

    setInStockOnly: (state, action: PayloadAction<boolean>) => {
      state.inStockOnly = action.payload;
    },

    resetFilters: (state) => {
      state.selectedCategory = 'all';
      state.searchQuery = '';

      const prices = state.items.map((product) => product.price);

      state.minPrice = Math.floor(Math.min(...prices));
      state.maxPrice = Math.ceil(Math.max(...prices));

      state.inStockOnly = false;
      state.filtered = state.items;
    },
  },
});

export const {
  filterByCategory,
  searchProducts,
  setPriceRange,
  setInStockOnly,
  resetFilters,
} = productsSlice.actions;

export default productsSlice.reducer;