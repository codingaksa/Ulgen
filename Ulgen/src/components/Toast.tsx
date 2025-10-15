import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { ReactNode } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastOptions {
  title?: string;
  duration?: number; // ms, default 3000
  id?: string; // optional custom id
}

interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration: number;
  createdAt: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, opts?: ToastOptions) => string; // returns id
  dismissToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const typeStyles: Record<
  ToastType,
  { bar: string; bg: string; icon: React.ReactNode }
> = {
  success: {
    bar: "from-green-500 to-emerald-600",
    bg: "bg-emerald-900/40 border border-emerald-700",
    icon: (
      <svg
        className="w-5 h-5 text-emerald-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
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
    bg: "bg-rose-900/40 border border-rose-700",
    icon: (
      <svg
        className="w-5 h-5 text-rose-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
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
    bg: "bg-indigo-900/40 border border-indigo-700",
    icon: (
      <svg
        className="w-5 h-5 text-indigo-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
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
    bg: "bg-amber-900/40 border border-amber-700",
    icon: (
      <svg
        className="w-5 h-5 text-amber-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
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

const genId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const ToastProvider: React.FC<{
  children: ReactNode;
  maxStack?: number;
}> = ({ children, maxStack = 5 }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());
  const pausedRef = useRef<boolean>(false);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const t = timersRef.current.get(id);
    if (t) {
      window.clearTimeout(t);
      timersRef.current.delete(id);
    }
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
    timersRef.current.forEach((tid) => window.clearTimeout(tid));
    timersRef.current.clear();
  }, []);

  const scheduleDismiss = useCallback(
    (toast: ToastItem) => {
      if (toast.duration <= 0) return; // persistent
      const tid = window.setTimeout(
        () => dismissToast(toast.id),
        toast.duration
      );
      timersRef.current.set(toast.id, tid);
    },
    [dismissToast]
  );

  const showToast = useCallback(
    (type: ToastType, message: string, opts?: ToastOptions) => {
      const id = opts?.id ?? genId();
      const duration = Number.isFinite(opts?.duration)
        ? Math.max(0, Number(opts!.duration))
        : 3000;
      const next: ToastItem = {
        id,
        type,
        title: opts?.title,
        message,
        duration,
        createdAt: Date.now(),
      };
      setToasts((prev) => {
        const arr = [...prev, next];
        if (arr.length > maxStack) arr.shift();
        return arr;
      });
      scheduleDismiss(next);
      return id;
    },
    [maxStack, scheduleDismiss]
  );

  const onMouseEnter = () => {
    pausedRef.current = true;
    timersRef.current.forEach((tid, id) => {
      window.clearTimeout(tid);
      timersRef.current.delete(id);
    });
  };

  const onMouseLeave = () => {
    if (!pausedRef.current) return;
    pausedRef.current = false;
    toasts.forEach((t) => scheduleDismiss(t));
  };

  useEffect(() => {
    return () => {
      timersRef.current.forEach((tid) => window.clearTimeout(tid));
      timersRef.current.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast, clearToasts }}>
      {children}
      <div
        className="fixed z-[1000] bottom-6 right-6 space-y-3 max-w-[92vw] sm:max-w-sm"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((t) => (
          <ToastView key={t.id} item={t} onClose={() => dismissToast(t.id)} />
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

const ToastView: React.FC<{ item: ToastItem; onClose: () => void }> = ({
  item,
  onClose,
}) => {
  const style = typeStyles[item.type];
  return (
    <div
      role="status"
      aria-live="polite"
      className={`relative overflow-hidden rounded-xl shadow-xl backdrop-blur px-4 py-3 min-w-[260px] ${style.bg}`}
    >
      <div
        className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${style.bar}`}
      />
      <div className="flex items-start space-x-3">
        {style.icon}
        <div className="text-sm pr-6">
          {item.title && (
            <div className="text-white font-semibold mb-0.5">{item.title}</div>
          )}
          <div className="text-gray-300">{item.message}</div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/30 rounded"
          aria-label="Bildirimi kapat"
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  );
};
