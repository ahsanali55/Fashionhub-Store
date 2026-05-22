import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  theme: 'light' | 'dark';
}

const initialState: UIState = {
  sidebarOpen: true,
  mobileMenuOpen: false,
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
  },
});

export const { toggleSidebar, toggleMobileMenu, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
