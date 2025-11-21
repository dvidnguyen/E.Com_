// Database-driven TypeScript interfaces for E-commerce Client

// Common types
export type UUID = string;
export type ISOString = string; // For TIMESTAMP
export type Status = 'active' | 'inactive';

// ===== USER & AUTHENTICATION =====
export interface User {
  id: UUID;
  email: string;
  user_name: string | null;
  phone: string | null;
  role: 'user' | 'admin';
  created_at: ISOString;
  updated_at: ISOString;
}

export interface UserAddress {
  id: UUID;
  user_id: UUID;
  full_name: string;
  phone: string;
  street_address: string;
  ward: string | null;
  district: string;
  city: string;
  is_default: boolean;
  created_at: ISOString;
}

// ===== CATEGORY =====
export interface Category {
  id: UUID;
  category_id: UUID | null; // Parent category ID (self-referencing)
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  status: Status;
  created_at: ISOString;
  updated_at: ISOString;
  // Frontend calculated fields
  children?: Category[];
  level?: number;
}

// ===== PRODUCT & VARIANTS =====
export interface Product {
  id: UUID;
  category_id: UUID;
  name: string;
  slug: string;
  content: string; // HTML description
  sku_prefix: string;
  base_price: number;
  status: Status;
  created_at: ISOString;
  updated_at: ISOString;
  // Relations
  category?: Category;
  variants?: ProductVariant[];
  // Frontend calculated
  min_price?: number;
  max_price?: number;
  total_stock?: number;
}

export interface ProductVariant {
  id: UUID;
  product_id: UUID;
  sku_suffix: string;
  price: number;
  compare_price: number | null;
  color: string | null;
  size: string | null;
  quantity: number;
  created_at: ISOString;
  updated_at: ISOString;
  // Relations
  product?: Product;
  images?: ProductImage[];
  // Frontend calculated
  full_sku?: string; // sku_prefix + sku_suffix
  is_available?: boolean;
}

export interface ProductImage {
  id: UUID;
  product_variant_id: UUID;
  img_url: string;
  created_at: ISOString;
}

// ===== CART =====
export interface Cart {
  id: UUID;
  user_id: UUID;
  created_at: ISOString;
  updated_at: ISOString;
  // Relations
  items?: CartItem[];
}

export interface CartItem {
  id: UUID;
  cart_id: UUID;
  product_variant_id: UUID;
  quantity: number;
  created_at: ISOString;
  // Relations for display
  variant?: ProductVariant & {
    product?: Product;
    images?: ProductImage[];
  };
  // Frontend calculated
  total_price?: number;
}

// ===== ORDER =====
export interface Order {
  id: UUID;
  user_id: UUID;
  order_code: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: string; // JSON string
  payment_method: 'cod' | 'bank_transfer' | 'credit_card' | 'e_wallet';
  payment_status: 'pending' | 'paid' | 'failed';
  notes: string | null;
  created_at: ISOString;
  updated_at: ISOString;
  // Relations
  items?: OrderItem[];
  voucher?: Voucher;
  // Frontend parsed
  shipping_address_parsed?: UserAddress;
}

export interface OrderItem {
  id: UUID;
  order_id: UUID;
  product_variant_id: UUID;
  quantity: number;
  price_at_purchase: number;
  product_name: string;
  variant_sku: string;
  // Frontend calculated
  total_price?: number;
}

// ===== VOUCHER =====
export interface Voucher {
  id: UUID;
  code: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  min_order_value: number | null;
  usage_limit: number | null;
  used_count: number;
  start_date: ISOString;
  end_date: ISOString;
  status: Status;
  created_at: ISOString;
}

// ===== FEEDBACK =====
export interface Feedback {
  id: UUID;
  user_id: UUID;
  order_id: UUID;
  product_variant_id: UUID;
  rating: number; // 1-5 stars
  comment: string | null;
  created_at: ISOString;
  // Relations
  user?: User;
  variant?: ProductVariant & { product?: Product };
}

// ===== API RESPONSES =====
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  details?: Record<string, unknown>;
}

// ===== FRONTEND SPECIFIC =====
export interface ProductFilter {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  search?: string;
  sortBy?: 'name' | 'price' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export interface CartSummary {
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  totalItems: number;
}

// ===== FORM DATA TYPES =====
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  user_name?: string;
  phone?: string;
  terms: boolean;
}

export interface AddToCartData {
  productVariantId: string;
  quantity: number;
}

export interface CheckoutData {
  shippingAddress: UserAddress;
  paymentMethod: 'cod' | 'bank_transfer' | 'credit_card' | 'e_wallet';
  voucherCode?: string;
  notes?: string;
}