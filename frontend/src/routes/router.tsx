import { createBrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';
import { createLazyComponent } from '@/utils/lazy-loading';
import ErrorPage from '@/pages/error/ErrorPage';
import SignupPage from '@/pages/auth/Login';
import RegisterPage from '@/pages/auth/Regis';

// Lazy load các components với preloading capabilities
const DashboardPage = createLazyComponent(() => import('@/pages/admin/dashboard/DashboardPage'));
const ProductListPage = createLazyComponent(() => import('@/pages/admin/products/ProductListPage'));
const ProductFormPage = createLazyComponent(() => import('@/pages/admin/products/ProductFormPage'));
const CategoryPage = createLazyComponent(() => import('@/pages/admin/products/CategoryPage'));
const InventoryPage = createLazyComponent(() => import('@/pages/admin/products/InventoryPage'));
const OrderListPage = createLazyComponent(() => import('@/pages/admin/orders/OrderListPage'));
const OrderDetailPage = createLazyComponent(() => import('@/pages/admin/orders/OrderDetailPage'));

// Client Pages - Temporary placeholder

// Wrapper component để bọc Suspense cho từng lazy component
const withSuspense = (Component: React.ComponentType) => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Component />
    </Suspense>
  );
};

export const router = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'dashboard',
        element: withSuspense(DashboardPage)
      },
      {
        index: true, // Default route for /admin
        element: withSuspense(DashboardPage)
      },
      // Product Management Routes
      {
        path: 'products',
        element: withSuspense(ProductListPage)
      },
      {
        path: 'products/new',
        element: withSuspense(ProductFormPage)
      },
      {
        path: 'products/edit/:id',
        element: withSuspense(ProductFormPage)
      },
      {
        path: 'products/categories',
        element: withSuspense(CategoryPage)
      },
      {
        path: 'products/inventory',
        element: withSuspense(InventoryPage)
      },
      // Order Management Routes
      {
        path: 'orders',
        element: withSuspense(OrderListPage)
      },
      {
        path: 'orders/:orderId',
        element: withSuspense(OrderDetailPage)
      }
    ]
  },
  {
    path: '/authenticate',
    element: <SignupPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/',
    element: <div>Homepage</div>
  },
  {
    path: '/*',
    element: <ErrorPage />
  }
]);