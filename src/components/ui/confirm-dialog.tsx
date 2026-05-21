"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AlertTriangle, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
}

const variantStyles = {
  danger: {
    icon: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
    button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    border: "border-red-200 dark:border-red-800",
  },
  warning: {
    icon: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
    button: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
    border: "border-amber-200 dark:border-amber-800",
  },
  info: {
    icon: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
    button: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
    border: "border-indigo-200 dark:border-indigo-800",
  },
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    if (open) {
      document.addEventListener("keydown", handler);
      // Focus trap — focus the confirm button
      setTimeout(() => {
        const btn = modalRef.current?.querySelector<HTMLButtonElement>('[data-confirm]');
        btn?.focus();
      }, 50);
    }
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose, loading]);

  if (!open) return null;

  const styles = variantStyles[variant];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div
        ref={modalRef}
        className={cn(
          "relative mx-4 w-full max-w-sm overflow-hidden rounded-xl border bg-white shadow-2xl dark:bg-slate-800",
          styles.border
        )}
      >
        {/* Subtle logo watermark */}
        <div className="pointer-events-none absolute -right-6 -top-6 opacity-[0.04] dark:opacity-[0.03]">
          <Image
            src="/lumora-icon.svg"
            alt=""
            width={80}
            height={80}
            unoptimized
          />
        </div>
        <div className="flex items-start justify-between px-5 pt-5 pb-3">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                styles.icon
              )}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {title}
              </h3>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {message}
              </div>
            </div>
          </div>
          {!loading && (
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-5 py-4 dark:border-slate-700">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {cancelLabel}
          </button>
          <button
            data-confirm
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60",
              styles.button
            )}
          >
            {loading && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
