import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Toast } from "@/components/molecules/Toast";
import type { ToastTheme, ToastPosition } from "@/components/molecules/Toast";

interface ToastOptions {
  title?: string;
  message: string;
  theme?: ToastTheme;
  position?: ToastPosition;
  duration?: number;
}

interface ToastItem {
  id: string;
  title?: string;
  message: string;
  theme: ToastTheme;
  position: ToastPosition;
  duration: number;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => string;
  hideToast: (id: string) => void;
  hideAllToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
};

interface ToastProviderProps {
  children: ReactNode;
}

const MAX_TOASTS = 5;

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((options: ToastOptions) => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const toast: ToastItem = {
      id,
      title: options.title,
      message: options.message,
      theme: options.theme ?? "info",
      position: options.position ?? "top",
      duration: options.duration ?? 10_000,
    };

    setToasts((prev) => [...prev.slice(-MAX_TOASTS + 1), toast]);
    return id;
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const hideAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const topToasts = toasts.filter((t) => t.position === "top");
  const bottomToasts = toasts.filter((t) => t.position === "bottom");

  return (
    <ToastContext.Provider value={{ showToast, hideToast, hideAllToasts }}>
      {children}

      {createPortal(
        <>
          {topToasts.length > 0 && (
            <div className="fixed left-1/2 top-4 z-50 flex -translate-x-1/2 flex-col gap-2 px-4 w-full max-w-xl">
              {topToasts.map((toast) => (
                <Toast
                  key={toast.id}
                  {...toast}
                  onClose={() => hideToast(toast.id)}
                />
              ))}
            </div>
          )}

          {bottomToasts.length > 0 && (
            <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2">
              {bottomToasts.map((toast) => (
                <Toast
                  key={toast.id}
                  {...toast}
                  onClose={() => hideToast(toast.id)}
                />
              ))}
            </div>
          )}
        </>,
        document.body,
      )}
    </ToastContext.Provider>
  );
};
