# KIẾN TRÚC THỨ MỤC ADMIN 

## Cấu trúc thư mục 

```
src/
├── components/
│   ├── ui/                     # Shadcn/ui components
│   ├── admin/                  # Admin-specific components
│   │   ├── layout/
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Breadcrumb.tsx
│   │   ├── charts/             # Charts components
│   │   ├── tables/             # Data table components
│   │   └── forms/              # Form components
│   └── shared/                 # Shared components
│
├── pages/
│   ├── admin/
│   │   ├── dashboard/          # Trang dashboard
│   │   ├── products/           # Quản lý sản phẩm
│   │   ├── orders/             # Quản lý đơn hàng  
│   │   ├── customers/          # Quản lý khách hàng
│   │   ├── promotions/         # Quản lý khuyến mãi
│   │   ├── inventory/          # Quản lý kho
│   │   ├── reviews/            # Quản lý đánh giá
│   │   ├── content/            # Quản lý nội dung
│   │   ├── reports/            # Báo cáo
│   │   ├── settings/           # Cài đặt
│   │   └── users/              # Quản lý admin/staff
│   └── client/                 # Pages cho phía client (user)
│
├── hooks/                      # Custom React hooks
├── services/                   # API calls
├── store/                      # State management (Zustand/Redux)
├── types/                      # TypeScript types
├── utils/                      # Utility functions
├── Route/                    # Route 
└── constants/                  # Constants
```

## Lợi ích của cấu trúc này:

✅ **Tách biệt rõ ràng** admin và client
✅ **Dễ maintain** và scale
✅ **Team-friendly** - nhiều dev có thể work song song
✅ **Reusable components**
✅ **Type-safe** với TypeScript