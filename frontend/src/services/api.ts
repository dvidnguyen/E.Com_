import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { APP_CONFIG } from '../config/app';
import type { ApiResponse, ApiError } from '../types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    // Create axios instance with base config
    this.client = axios.create({
      baseURL: APP_CONFIG.API.BASE_URL,
      timeout: APP_CONFIG.API.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Setup interceptors
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(APP_CONFIG.STORAGE.ACCESS_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development
        if (import.meta.env.DEV) {
          console.log('🚀 API Request:', {
            url: config.url,
            method: config.method?.toUpperCase(),
            data: config.data,
          });
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle responses and errors
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        // Log response in development
        if (import.meta.env.DEV) {
          console.log('✅ API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data,
          });
        }

        return response;
      },
      (error) => {
        // Handle different error scenarios
        if (error.response) {
          const { status, data } = error.response;

          // Log error in development
          if (import.meta.env.DEV) {
            console.error('❌ API Error:', {
              url: error.config?.url,
              status,
              data,
            });
          }

          // Handle 401 Unauthorized - Token expired
          if (status === 401) {
            localStorage.removeItem(APP_CONFIG.STORAGE.ACCESS_TOKEN);
            localStorage.removeItem(APP_CONFIG.STORAGE.REFRESH_TOKEN);

            // Redirect to login if not already there
            if (!window.location.pathname.includes('/authenticate')) {
              window.location.href = '/authenticate';
            }
          }

          // Handle 403 Forbidden
          if (status === 403) {
            console.error('Access denied. Insufficient permissions.');
          }

          // Handle 500 Server Error
          if (status >= 500) {
            console.error('Server error. Please try again later.');
          }

          return Promise.reject({
            message: data?.message || 'An error occurred',
            statusCode: status,
            error: data?.error,
          } as ApiError);
        }

        // Handle network errors
        if (error.request) {
          console.error('Network error:', error.message);
          return Promise.reject({
            message: 'Network error. Please check your connection.',
            statusCode: 0,
          } as ApiError);
        }

        // Handle other errors
        return Promise.reject({
          message: error.message || 'An unexpected error occurred',
          statusCode: 0,
        } as ApiError);
      }
    );
  }

  // GET request
  async get<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(endpoint, config);
    return response.data.data;
  }

  // POST request
  async post<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(endpoint, data, config);
    return response.data.data;
  }

  // PUT request
  async put<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(endpoint, data, config);
    return response.data.data;
  }

  // PATCH request
  async patch<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(endpoint, data, config);
    return response.data.data;
  }

  // DELETE request
  async delete<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(endpoint, config);
    return response.data.data;
  }

  // Upload file
  async uploadFile<T = any>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    const response = await this.client.post<ApiResponse<T>>(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  }

  // Get raw axios instance for advanced usage
  getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiService = new ApiService();
