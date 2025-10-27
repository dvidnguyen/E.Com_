import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';

// Type cho lazy loaded components
type LazyComponent<T = Record<string, unknown>> = LazyExoticComponent<ComponentType<T>>;

// Route configuration với preloading
export interface RouteConfig {
  path: string;
  component: LazyComponent;
  preload?: () => void;
  index?: boolean;
  children?: RouteConfig[];
}

// Utility function để tạo lazy component với preloading
export function createLazyComponent<T = Record<string, unknown>>(
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

// Hook để preload components khi hover
export function usePreloadOnHover() {
  const preloadComponent = (preloadFn: () => void) => {
    return {
      onMouseEnter: () => {
        // Delay một chút để tránh preload quá sớm
        setTimeout(preloadFn, 100);
      }
    };
  };

  return { preloadComponent };
}