import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { House, ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface AdminBreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export default function AdminBreadcrumb({ items, className = "" }: AdminBreadcrumbProps) {
  const location = useLocation();

  // Auto-generate breadcrumb từ URL nếu không có items
  const generateBreadcrumb = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbItems: BreadcrumbItem[] = [
      { label: 'Home', href: '/admin/dashboard' }
    ];

    if (pathSegments.length > 0 && pathSegments[0] === 'admin') {
      breadcrumbItems.push({ label: 'Admin', href: '/admin' });

      // Mapping cho các routes
      const routeMapping: Record<string, string> = {
        'dashboard': 'Dashboard',
        'products': 'Products',
        'orders': 'Orders',
        'customers': 'Customers',
        'categories': 'Categories',
        'inventory': 'Inventory',
        'new': 'Create New',
        'edit': 'Edit'
      };

      for (let i = 1; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        const isLast = i === pathSegments.length - 1;
        const isId = /^\d+$/.test(segment); // Check if segment is numeric ID

        if (isId) {
          // Nếu là ID, hiển thị dạng "Detail #ID"
          breadcrumbItems.push({
            label: `Detail #${segment}`,
            isActive: isLast
          });
        } else {
          const label = routeMapping[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
          breadcrumbItems.push({
            label,
            href: isLast ? undefined : `/admin/${pathSegments.slice(1, i + 1).join('/')}`,
            isActive: isLast
          });
        }
      }
    }

    return breadcrumbItems;
  };

  const breadcrumbItems = items || generateBreadcrumb();

  return (
    <div className={`mb-6 ${className}`}>
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && (
                <BreadcrumbSeparator className="text-muted-foreground mx-2">
                  <ChevronRight className="w-4 h-4" />
                </BreadcrumbSeparator>
              )}
              <BreadcrumbItem>
                {item.href && !item.isActive ? (
                  <BreadcrumbLink
                    asChild
                    className={`flex items-center gap-2 hover:text-primary transition-colors ${index === 0 ? 'text-muted-foreground' : ''
                      }`}
                  >
                    <Link to={item.href}>
                      {index === 0 && <House className="w-4 h-4" />}
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="font-medium text-foreground">
                    {index === 0 && <House className="w-4 h-4 mr-2" />}
                    {item.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}