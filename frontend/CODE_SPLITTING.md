# Code Splitting Implementation Guide

## 📖 Tổng quan
Code splitting được implement để tối ưu hiệu suất ứng dụng bằng cách chia nhỏ bundle và chỉ load những component cần thiết khi user truy cập.

## 🚀 Cách triển khai

### 1. Route-based Code Splitting với React.lazy

```typescript
// router.tsx
import { lazy, Suspense } from 'react';

// Lazy load components
const DashboardPage = lazy(() => import('@/pages/admin/dashboard/DashboardPage'));
const ProductListPage = lazy(() => import('@/pages/admin/products/ProductListPage'));

// Wrap với Suspense
const withSuspense = (Component: React.ComponentType) => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Component />
    </Suspense>
  );
};

// Sử dụng trong router
{
  path: 'products',
  element: withSuspense(ProductListPage)
}
```

### 2. Advanced Code Splitting với Preloading

```typescript
// lazy-loading.ts
export function createLazyComponent<T>(
  importFn: () => Promise<{ default: ComponentType<T> }>
): LazyComponent<T> & { preload: () => void } {
  let componentPromise: Promise<{ default: ComponentType<T> }> | null = null;

  const lazyComponent = lazy(() => {
    if (!componentPromise) {
      componentPromise = importFn();
    }
    return componentPromise;
  }) as LazyComponent<T> & { preload: () => void };

  // Thêm preload method
  lazyComponent.preload = () => {
    if (!componentPromise) {
      componentPromise = importFn();
    }
  };

  return lazyComponent;
}
```

### 3. Preloading on Hover

```typescript
// AdminHeader.tsx
const preloadFunctions = {
  dashboard: () => import('@/pages/admin/dashboard/DashboardPage'),
  products: () => import('@/pages/admin/products/ProductListPage'),
  // ...
};

const preloadComponent = (preloadFn: () => Promise<unknown>) => {
  setTimeout(() => {
    preloadFn().catch(() => {
      // Ignore preload errors
    });
  }, 100);
};

// Sử dụng trong JSX
<Button onMouseEnter={() => preloadComponent(preloadFunctions.dashboard)}>
  Dashboard
</Button>
```

## 🎯 Lợi ích

### 1. **Performance**
- **Giảm Initial Bundle Size**: Chỉ load code cần thiết ban đầu
- **Faster Page Load**: Thời gian load trang đầu nhanh hơn
- **Better Core Web Vitals**: Cải thiện LCP, FID, CLS

### 2. **User Experience**
- **Smooth Navigation**: Preloading giúp navigation mượt mà hơn
- **Progressive Loading**: Load dần các phần theo nhu cầu
- **Loading States**: Feedback rõ ràng khi load component

### 3. **Scalability**
- **Modular Architecture**: Dễ dàng thêm/xóa routes
- **Bundle Optimization**: Webpack tự động chia bundles
- **Memory Efficiency**: Không load unused code

## 📊 Bundle Analysis

### Trước khi Code Splitting:
```
main.bundle.js: ~2.5MB
├── Dashboard: 300KB
├── Products: 500KB  
├── Orders: 400KB
├── Customers: 300KB
└── Other: 1MB
```

### Sau khi Code Splitting:
```
main.bundle.js: ~800KB (chỉ core + routing)
├── dashboard.chunk.js: 300KB (load khi cần)
├── products.chunk.js: 500KB (load khi cần)
├── orders.chunk.js: 400KB (load khi cần)
└── customers.chunk.js: 300KB (load khi cần)
```

## 🛠️ Best Practices

### 1. **Loading States**
```tsx
// Sử dụng Loading Spinner có sẵn
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';

<Suspense fallback={<PageLoadingSpinner />}>
  <LazyComponent />
</Suspense>
```

### 2. **Error Boundaries**
```tsx
// Wrap lazy components với Error Boundary
<ErrorBoundary fallback={<ErrorPage />}>
  <Suspense fallback={<Loading />}>
    <LazyComponent />
  </Suspense>
</ErrorBoundary>
```

### 3. **Preloading Strategy**
- **On Hover**: Preload khi user hover over navigation
- **On Route Enter**: Preload adjacent routes
- **On Idle**: Preload khi browser idle

### 4. **Component Requirements**
- **Export Default**: Tất cả lazy components phải có `export default`
- **Named Exports**: Không support với React.lazy
- **Type Safety**: Maintain TypeScript support

## 📝 Implementation Checklist

- [x] ✅ Route-based code splitting với React.lazy
- [x] ✅ Loading spinner components
- [x] ✅ Suspense wrapper utility
- [x] ✅ Advanced lazy loading utilities
- [x] ✅ Hover-based preloading
- [x] ✅ Navigation preloading
- [ ] 🔄 Error boundaries cho lazy components
- [ ] 🔄 Bundle size monitoring
- [ ] 🔄 Performance metrics

## 🔧 Monitoring & Debug

### 1. **Bundle Analysis**
```bash
# Analyze bundle size
npm run build -- --analyze

# Check chunk sizes
ls -la dist/assets/
```

### 2. **Network Tab**
- Kiểm tra chunks load đúng timing
- Verify preloading behavior
- Monitor cache headers

### 3. **Performance**
```javascript
// Measure component load time
console.time('ComponentLoad');
import('./Component').then(() => {
  console.timeEnd('ComponentLoad');
});
```

## 📈 Next Steps

1. **Implement Error Boundaries** cho tất cả lazy routes
2. **Add Bundle Analyzer** để monitor size
3. **Implement Route Preloading** based on user behavior
4. **Add Service Worker** cho advanced caching
5. **Monitor Core Web Vitals** impact

---

**Note**: Code splitting là một optimization technique quan trọng cho ứng dụng React lớn. Implementation này giúp cải thiện đáng kể performance và user experience! 🚀