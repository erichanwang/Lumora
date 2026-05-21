"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const icons: Record<ToastType, any> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles: Record<ToastType, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  error: "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
  warning: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
  info: "border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const countRef = useRef(0);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 4s with stagger for stacked toasts
    const stagger = countRef.current * 100;
    countRef.current += 1;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timersRef.current.delete(id);
    }, 4000 + stagger);

    timersRef.current.set(id, timer);
  }, []);

  const removeToast = useCallback((id: number) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    setToasts([]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[300] flex flex-col items-end gap-2">
        {/* Subtle Lumora logo watermark */}
        <div className="pointer-events-none absolute -bottom-8 -right-8 opacity-[0.04] dark:opacity-[0.03]">
          <Image
            src="/lumora-icon.svg"
            alt=""
            width={80}
            height={80}
            unoptimized
          />
        </div>
        {toasts.length > 1 && (
          <button
            onClick={dismissAll}
            className="self-end rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            Dismiss all ({toasts.length})
          </button>
        )}
        {toasts.map((t, index) => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border bg-white px-4 py-3 shadow-lg text-sm font-medium animate-slide-up dark:bg-slate-800",
                styles[t.type],
                index > 0 && "animate-slide-up"
              )}
              style={{
                animationDelay: `${index * 80}ms`,
                animationFillMode: "both",
              }}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="flex-1">{t.message}</span>
              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
