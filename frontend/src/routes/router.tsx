import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import DashboardPage from '@/pages/admin/dashboard/DashboardPage';
import ProductListPage from '@/pages/admin/products/ProductListPage';
import ProductFormPage from '@/pages/admin/products/ProductFormPage';
import CategoryPage from '@/pages/admin/products/CategoryPage';
import InventoryPage from '@/pages/admin/products/InventoryPage';
import OrderListPage from '@/pages/admin/orders/OrderListPage';
import OrderDetailPage from '@/pages/admin/orders/OrderDetailPage';
import ErrorPage from '@/pages/error/ErrorPage';

export const router = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        index: true, // Default route for /admin
        element: <DashboardPage />
      },
      // Product Management Routes
      {
        path: 'products',
        element: <ProductListPage />
      },
      {
        path: 'products/new',
        element: <ProductFormPage />
      },
      {
        path: 'products/edit/:id',
        element: <ProductFormPage />
      },
      {
        path: 'products/categories',
        element: <CategoryPage />
      },
      {
        path: 'products/inventory',
        element: <InventoryPage />
      },
      // Order Management Routes
      {
        path: 'orders',
        element: <OrderListPage />
      },
      {
        path: 'orders/:orderId',
        element: <OrderDetailPage />
      }
    ]
  },
  {
    path: '/',
    element: <div>Client Landing Page</div> // Placeholder
  },
  {
    path: '/*',
    element: <ErrorPage />
  }
]);