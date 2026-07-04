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
  // =========================
  // JACKETS
  // =========================
  {
    id: "1",
    name: "Premium Denim Jacket",
    category: "jackets",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1555583743-991174c11425?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
    reviews: 234,
    supplier: "StyleCo",
    description: "Premium slim-fit denim jacket.",
    inStock: true,
  },
  {
    id: "2",
    name: "Leather Biker Jacket",
    category: "jackets",
    price: 189.99,
    image: "https://plus.unsplash.com/premium_photo-1744395627361-7d8323c95cfc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.9,
    reviews: 182,
    supplier: "UrbanWear",
    description: "Classic leather biker jacket.",
    inStock: true,
  },
  {
    id: "3",
    name: "Bomber Jacket",
    category: "jackets",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1614848184342-fec060159c89?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.7,
    reviews: 143,
    supplier: "FashionHub",
    description: "Modern bomber jacket.",
    inStock: true,
  },
  {
    id: "4",
    name: "Winter Puffer Jacket",
    category: "jackets",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1727515192207-3dc860bfd773?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    
    rating: 4.8,
    reviews: 298,
    supplier: "NorthWear",
    description: "Warm insulated puffer jacket.",
    inStock: true,
  },

  // =========================
  // DRESSES
  // =========================
  {
    id: "5",
    name: "Silk Evening Dress",
    category: "dresses",
    price: 199.99,
    image: "https://plus.unsplash.com/premium_photo-1673481601147-ee95199d3896?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.9,
    reviews: 456,
    supplier: "Elegance",
    description: "Luxury silk evening dress.",
    inStock: true,
  },
  {
    id: "6",
    name: "Floral Summer Dress",
    category: "dresses",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1593105522065-9a6ecd21aeb2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.7,
    reviews: 165,
    supplier: "BloomWear",
    description: "Elegant floral summer dress.",
    inStock: true,
  },
  
  {
    id: "8",
    name: "Maxi Fashion Dress",
    category: "dresses",
    price: 119.99,
    image: "https://plus.unsplash.com/premium_photo-1678197937465-bdbc4ed95815?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.6,
    reviews: 198,
    supplier: "ModernWear",
    description: "Elegant maxi dress.",
    inStock: true,
  },

  // =========================
  // SHOES
  // =========================
  {
    id: "9",
    name: "Athletic Training Shoes",
    category: "shoes",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1637437757614-6491c8e915b5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
    reviews: 567,
    supplier: "SportGear",
    description: "High-performance training shoes.",
    inStock: true,
  },
  {
    id: "10",
    name: "White Sneakers",
    category: "shoes",
    price: 84.99,
    image: "https://images.unsplash.com/photo-1695073621086-aa692bc32a3d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.7,
    reviews: 398,
    supplier: "UrbanStep",
    description: "Minimal everyday sneakers.",
    inStock: true,
  },
  {
    id: "11",
    name: "Leather Chelsea Boots",
    category: "shoes",
    price: 149.99,
    image: "https://plus.unsplash.com/premium_photo-1729788891863-0d9b6f2b453b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.9,
    reviews: 254,
    supplier: "ClassicFoot",
    description: "Premium leather Chelsea boots.",
    inStock: true,
  },
  {
    id: "12",
    name: "Canvas Casual Shoes",
    category: "shoes",
    price: 74.99,
    image: "https://images.unsplash.com/photo-1612942910539-9ff28b2e00d3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.6,
    reviews: 318,
    supplier: "StreetStyle",
    description: "Comfortable everyday shoes.",
    inStock: true,
  },

  // =========================
  // ACCESSORIES
  // =========================
  {
    id: "13",
    name: "Luxury Sunglasses",
    category: "accessories",
    price: 149.99,
    image: "https://plus.unsplash.com/premium_photo-1692809752539-fc7e9c347b14?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.9,
    reviews: 345,
    supplier: "LuxVision",
    description: "Designer sunglasses.",
    inStock: true,
  },
  {
    id: "14",
    name: "Leather Wallet",
    category: "accessories",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1614330315526-166f2d71e544?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.7,
    reviews: 222,
    supplier: "ClassicCraft",
    description: "Premium leather wallet.",
    inStock: true,
  },
  {
    id: "15",
    name: "Luxury Wrist Watch",
    category: "accessories",
    price: 229.99,
    image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?q=80&w=781&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.9,
    reviews: 512,
    supplier: "TimeLux",
    description: "Luxury stainless steel watch.",
    inStock: true,
  },
  {
    id: "16",
    name: "Leather Handbag",
    category: "accessories",
    price: 179.99,
    image: "https://images.unsplash.com/photo-1603219527847-24c87f552a77?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
    reviews: 278,
    supplier: "LuxuryCraft",
    description: "Elegant leather handbag.",
    inStock: true,
  },

  // =========================
  // SHIRTS
  // =========================
  {
    id: "17",
    name: "Premium Linen Shirt",
    category: "shirts",
    price: 64.99,
    image: "https://plus.unsplash.com/premium_photo-1673125287084-e90996bad505?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.6,
    reviews: 156,
    supplier: "CasualWear",
    description: "Breathable linen shirt.",
    inStock: true,
  },
  {
    id: "18",
    name: "Oxford Cotton Shirt",
    category: "shirts",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1549037173-e3b717902c57?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
    reviews: 268,
    supplier: "UrbanWear",
    description: "Classic Oxford cotton shirt.",
    inStock: true,
  },
  {
    id: "19",
    name: "Slim Fit Formal Shirt",
    category: "shirts",
    price: 69.99,
    image: "https://media.istockphoto.com/id/1201022726/photo/stylish-man-wearing-sunglasses-and-white-shirt-city-life.jpg?s=2048x2048&w=is&k=20&c=NaSC4ufRKW46KwYlPPqguDPzQ_7K3SPzrC8H4vdbrw0=",
    rating: 4.7,
    reviews: 214,
    supplier: "EliteStyle",
    description: "Modern slim-fit formal shirt.",
    inStock: true,
  },
  {
    id: "20",
    name: "Casual Checked Shirt",
    category: "shirts",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1744535814656-65f3cfa561bc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.5,
    reviews: 175,
    supplier: "StreetWear",
    description: "Comfortable checked casual shirt.",
    inStock: true,
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
