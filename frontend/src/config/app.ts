// Application configuration
export const APP_CONFIG = {
  // API Configuration
  API: {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1',
    TIMEOUT: 30000,
    ENDPOINTS: {
      // Auth endpoints
      AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
        PROFILE: '/auth/me',
        CHANGE_PASSWORD: '/auth/change-password',
      },
      // User endpoints
      USER: {
        ADDRESSES: '/user/addresses',
        ORDERS: '/user/orders',
        WISHLIST: '/user/wishlist',
      },
      // Product endpoints
      PRODUCT: {
        LIST: '/products',
        DETAIL: (id: string) => `/products/${id}`,
        VARIANTS: (id: string) => `/products/${id}/variants`,
        REVIEWS: (id: string) => `/products/${id}/reviews`,
        SEARCH: '/products/search',
      },
      // Category endpoints
      CATEGORY: {
        LIST: '/categories',
        DETAIL: (id: string) => `/categories/${id}`,
        PRODUCTS: (id: string) => `/categories/${id}/products`,
      },
      // Cart endpoints
      CART: {
        GET: '/cart',
        ADD_ITEM: '/cart/items',
        UPDATE_ITEM: (itemId: string) => `/cart/items/${itemId}`,
        REMOVE_ITEM: (itemId: string) => `/cart/items/${itemId}`,
        CLEAR: '/cart/clear',
        MERGE: '/cart/merge',
      },
      // Order endpoints
      ORDER: {
        CREATE: '/orders',
        LIST: '/orders',
        DETAIL: (id: string) => `/orders/${id}`,
        CANCEL: (id: string) => `/orders/${id}/cancel`,
      },
      // Voucher endpoints
      VOUCHER: {
        VALIDATE: '/vouchers/validate',
        LIST: '/vouchers',
      },
      // Upload endpoints
      UPLOAD: {
        IMAGE: '/upload/image',
        MULTIPLE: '/upload/multiple',
      },
    },
  },

  // App metadata
  APP: {
    NAME: 'E-Commerce',
    VERSION: '1.0.0',
    DESCRIPTION: 'Modern E-commerce Platform',
  },

  // Storage keys
  STORAGE: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user_data',
    CART: 'cart_items',
    THEME: 'app_theme',
    LANGUAGE: 'app_language',
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },

  // File upload limits
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    MAX_FILES: 10,
  },

  // UI Configuration
  UI: {
    TOAST_DURATION: 3000,
    DEBOUNCE_DELAY: 300,
    ANIMATION_DURATION: 200,
  },

  // Feature flags
  FEATURES: {
    SOCIAL_LOGIN: true,
    WISHLIST: true,
    REVIEWS: true,
    LIVE_CHAT: false,
    ANALYTICS: import.meta.env.PROD,
  },
} as const;

// Type exports
export type AppConfig = typeof APP_CONFIG;
export type ApiEndpoints = typeof APP_CONFIG.API.ENDPOINTS;