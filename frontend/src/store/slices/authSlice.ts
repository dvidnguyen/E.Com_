import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../services/api';
import { APP_CONFIG } from '../../config/app';
import type { User } from '../../types';

// Auth state
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem(APP_CONFIG.STORAGE.ACCESS_TOKEN),
  isAuthenticated: !!localStorage.getItem(APP_CONFIG.STORAGE.ACCESS_TOKEN),
  isLoading: false,
  error: null,
};

// Login async thunk
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.post(APP_CONFIG.API.ENDPOINTS.AUTH.LOGIN, credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem(APP_CONFIG.STORAGE.ACCESS_TOKEN);
      localStorage.removeItem(APP_CONFIG.STORAGE.REFRESH_TOKEN);
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem(APP_CONFIG.STORAGE.ACCESS_TOKEN, action.payload.token);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.isAuthenticated = true;
        localStorage.setItem(APP_CONFIG.STORAGE.ACCESS_TOKEN, action.payload.access_token);
        if (action.payload.refresh_token) {
          localStorage.setItem(APP_CONFIG.STORAGE.REFRESH_TOKEN, action.payload.refresh_token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, logout, setCredentials } = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;

export default authSlice.reducer;