"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  UserPlus,
  ShoppingCart,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  X,
  CheckCheck,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications, useMarkAllRead } from "@/lib/swr";

const typeIcons = {
  user: UserPlus,
  order: ShoppingCart,
  payment: CreditCard,
  alert: AlertCircle,
  success: CheckCircle2,
} as const;

const typeStyles = {
  user: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
  order: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
  payment: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
  alert: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
  success: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
};

const typeLabels: Record<string, string> = {
  user: "User",
  order: "Order",
  payment: "Payment",
  alert: "Alert",
  success: "Success",
};

export function NotificationsPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [optimisticIds, setOptimisticIds] = useState<Set<number>>(new Set());
  const { data, isValidating, mutate } = useNotifications();
  const { trigger: markAllRead } = useMarkAllRead();

  // Reset optimistic state when panel opens
  useEffect(() => {
    if (open) setOptimisticIds(new Set());
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const allNotifs = data?.data ?? [];
  const unreadCount = data?.unreadCount ?? 0;
  const totalCount = data?.total ?? 0;

  const displayedNotifs = allNotifs.filter(
    (n) => !optimisticIds.has(n.id)
  );

  const handleMarkAllRead = async () => {
    // Optimistically mark all as read
    const unreadIds = allNotifs.filter((n) => !n.read).map((n) => n.id);
    setOptimisticIds((prev) => {
      const next = new Set(prev);
      unreadIds.forEach((id) => next.add(id));
      return next;
    });
    await markAllRead();
    mutate();
  };

  const handleRefresh = () => {
    mutate();
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-96 origin-top-right rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                : "All caught up!"}
            </p>
          </div>
          {isValidating && (
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-slate-400" />
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleRefresh}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mark all as read button */}
      {unreadCount > 0 && optimisticIds.size < unreadCount && (
        <div className="border-b border-slate-100 px-5 py-2 dark:border-slate-700">
          <button
            onClick={handleMarkAllRead}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/30"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all as read
          </button>
        </div>
      )}

      {/* List */}
      <div className="max-h-80 overflow-y-auto">
        {displayedNotifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
              <Bell className="h-6 w-6 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {totalCount === 0 ? "No notifications yet" : "All caught up!"}
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              {totalCount === 0
                ? "Notifications will appear here when something happens."
                : "You've read everything."}
            </p>
          </div>
        ) : (
          displayedNotifs.slice(0, 20).map((notif) => {
            const Icon = typeIcons[notif.type as keyof typeof typeIcons] || Bell;
            const isUnread = !notif.read && !optimisticIds.has(notif.id);
            return (
              <div
                key={notif.id}
                className={cn(
                  "flex items-start gap-3 border-b border-slate-50 px-5 py-3.5 transition-colors hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-700/50",
                  isUnread && "bg-indigo-50/50 dark:bg-indigo-950/20"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    typeStyles[notif.type as keyof typeof typeStyles] || "bg-slate-100 text-slate-600"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {notif.title}
                      {isUnread && (
                        <span className="ml-2 inline-block h-2 w-2 rounded-full bg-indigo-500 animate-pulse-dot" />
                      )}
                    </p>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {notif.message}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-medium",
                      typeStyles[notif.type as keyof typeof typeStyles] || "bg-slate-100 text-slate-600"
                    )}>
                      {typeLabels[notif.type] || notif.type}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">{notif.time}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 px-5 py-3 text-center dark:border-slate-700">
        <div className="flex items-center justify-center gap-4">
          <span className="text-xs text-slate-400">
            Auto-refreshes every 15s
          </span>
        </div>
      </div>
    </div>
  );
}
