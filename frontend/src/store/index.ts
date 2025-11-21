import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

// Import slices
import authSlice from './slices/authSlice.ts';
import cartSlice from './slices/cartSlice.ts';
import uiSlice from './slices/uiSlice.ts';

// Configure the store
export const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore toast actions that may contain functions
        ignoredActions: ['ui/addToast'],
        ignoredPaths: ['ui.toasts.action'],
      },
    }),
  devTools: import.meta.env.DEV,
});

// Infer types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;