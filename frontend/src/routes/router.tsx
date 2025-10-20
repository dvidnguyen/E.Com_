import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import DashboardPage from '@/pages/admin/dashboard/DashboardPage';
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