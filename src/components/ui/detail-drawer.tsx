"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface DetailRow {
  label: string;
  value: ReactNode;
}

interface DetailDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  rows: DetailRow[];
  footer?: ReactNode;
  badge?: ReactNode;
}

export function DetailDrawer({
  open,
  onClose,
  title,
  subtitle,
  rows,
  footer,
  badge,
}: DetailDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[180] flex items-end justify-center bg-black/30 backdrop-blur-sm sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="animate-drawer-up relative w-full max-w-lg overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800 sm:rounded-2xl"
      >
        {/* Subtle logo watermark */}
        <div className="pointer-events-none absolute -bottom-4 -right-4 opacity-[0.03] dark:opacity-[0.02]">
          <Image
            src="/lumora-icon.svg"
            alt=""
            width={100}
            height={100}
            unoptimized
          />
        </div>
        {/* Handle bar for mobile */}
        <div className="flex justify-center pt-2 sm:hidden">
          <div className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-700">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                {title}
              </h3>
              {badge}
            </div>
            {subtitle && (
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {rows.map((row, i) => (
              <div
                key={i}
                className="flex items-start justify-between py-3 first:pt-0 last:pb-0"
              >
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {row.label}
                </span>
                <span className="ml-4 text-right text-sm font-medium text-slate-900 dark:text-white">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
