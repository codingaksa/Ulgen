import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: number;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (type: ToastType, message: string, title?: string) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, type, title, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Container */}
      <div className="fixed z-[1000] bottom-6 right-6 space-y-3">
        {toasts.map((t) => (
          <Toast key={t.id} item={t} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

const typeStyles: Record<
  ToastType,
  { bar: string; bg: string; icon: ReactNode }
> = {
  success: {
    bar: "from-green-500 to-emerald-600",
    bg: "bg-emerald-900/40 border-emerald-700",
    icon: (
      <svg
        className="w-5 h-5 text-emerald-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
  },
  error: {
    bar: "from-red-500 to-rose-600",
    bg: "bg-rose-900/40 border-rose-700",
    icon: (
      <svg
        className="w-5 h-5 text-rose-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
  },
  info: {
    bar: "from-blue-500 to-indigo-600",
    bg: "bg-indigo-900/40 border-indigo-700",
    icon: (
      <svg
        className="w-5 h-5 text-indigo-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
        />
      </svg>
    ),
  },
  warning: {
    bar: "from-yellow-500 to-amber-600",
    bg: "bg-amber-900/40 border-amber-700",
    icon: (
      <svg
        className="w-5 h-5 text-amber-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        />
      </svg>
    ),
  },
};

const Toast = ({ item }: { item: ToastItem }) => {
  const style = typeStyles[item.type];
  return (
    <div
      className={`relative overflow-hidden border ${style.bg} rounded-xl shadow-xl backdrop-blur px-4 py-3 min-w-[260px]`}
    >
      <div
        className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${style.bar}`}
      />
      <div className="flex items-start space-x-3">
        {style.icon}
        <div className="text-sm">
          {item.title && (
            <div className="text-white font-semibold mb-0.5">{item.title}</div>
          )}
          <div className="text-gray-300">{item.message}</div>
        </div>
        {/* Kapat butonu kaldırıldı */}
      </div>
    </div>
  );
};
