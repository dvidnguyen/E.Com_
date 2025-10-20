import StatCard from "@/components/admin/dashboard/StatCard";
import RecentOrders from "@/components/admin/dashboard/RecentOrders";
import TopProducts from "@/components/admin/dashboard/TopProducts";
import VisitorsChart from "@/components/admin/dashboard/VisitorsChart";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { House } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Tổng Doanh Thu",
      value: "67,890,000₫",
      change: "+12.5%",
      isPositive: true
    },
    {
      title: "Đơn Hàng",
      value: "2,450",
      change: "+8.2%",
      isPositive: true
    },
    {
      title: "Sản Phẩm",
      value: "1,250",
      change: "+3.1%",
      isPositive: true
    },
    {
      title: "Khách Hàng",
      value: "8,920",
      change: "-2.4%",
      isPositive: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Header Section with Primary Background */}
      <div className="  px-8 py-8 pb-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/admin/dashboard' className='flex items-center gap-2 '>
                  <House className="w-4 h-4" />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-blue-200"> / </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href='/admin' className="">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-blue-200"> / </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className=" font-medium">Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Page Title */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-lg">Chào mừng đến với trang quản trị</p>
        </div>
      </div>

      {/* Stats Cards - Clean spacing */}
      <div className="px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              isPositive={stat.isPositive}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <VisitorsChart />
          <RecentOrders />
        </div>

        {/* Top Products */}
        <div className="mb-8">
          <TopProducts />
        </div>
      </div>
    </div>
  );
}
