// Common types cho admin panel
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'user';
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  stock: number;
  sku: string;
  category: string;
  brand?: string;
  images: string[];
  status: 'active' | 'draft' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Address {
  street: string;
  city: string;
  district: string;
  ward: string;
  zipCode?: string;
  country: string;
}

export interface Promotion {
  id: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'inactive' | 'expired';
  conditions?: {
    minimumAmount?: number;
    applicableProducts?: string[];
    applicableCategories?: string[];
  };
  createdAt: Date;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  topSellingProducts: Array<{
    id: string;
    name: string;
    sold: number;
    revenue: number;
  }>;
  recentOrders: Order[];
}