import { type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';

interface AdminLayoutProps {
  children?: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <>
      <AdminHeader />

      {/* Main Content Container */}
      <div className='mt-16'>
        {children || <Outlet />}
      </div>
    </>
  );
}