import { useState } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
}

let toastIdCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, action, variant = "default" }: Omit<Toast, "id">) => {
    const id = (++toastIdCounter).toString();
    const newToast: Toast = { id, title, description, action, variant };

    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismiss(id);
    }, 5000);

    return { id };
  };

  const dismiss = (toastId?: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  };

  return {
    toast,
    dismiss,
    toasts,
  };
}