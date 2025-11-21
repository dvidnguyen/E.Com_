import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark' | 'system';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface UIState {
  theme: Theme;
  toasts: Toast[];
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  isLoading: Record<string, boolean>;
}

const initialState: UIState = {
  theme: (localStorage.getItem('theme') as Theme) || 'system',
  toasts: [],
  isCartOpen: false,
  isMobileMenuOpen: false,
  isLoading: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },

    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const toast: Toast = {
        ...action.payload,
        id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      state.toasts.push(toast);
    },

    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },

    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },

    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isCartOpen = action.payload;
    },

    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },

    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    },

    setLoading: (state, action: PayloadAction<{ key: string; isLoading: boolean }>) => {
      const { key, isLoading } = action.payload;
      if (isLoading) {
        state.isLoading[key] = true;
      } else {
        delete state.isLoading[key];
      }
    },
  },
});

export const {
  setTheme,
  addToast,
  removeToast,
  toggleCart,
  setCartOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
  setLoading,
} = uiSlice.actions;

// Selectors
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;
export const selectToasts = (state: { ui: UIState }) => state.ui.toasts;
export const selectIsCartOpen = (state: { ui: UIState }) => state.ui.isCartOpen;
export const selectIsMobileMenuOpen = (state: { ui: UIState }) => state.ui.isMobileMenuOpen;
export const selectIsLoading = (state: { ui: UIState }, key: string) => Boolean(state.ui.isLoading[key]);

export default uiSlice.reducer;