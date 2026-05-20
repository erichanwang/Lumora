"use client";

import { useEffect, useRef } from "react";
import {
  Bell,
  UserPlus,
  ShoppingCart,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "user" | "order" | "payment" | "alert" | "success";
  read: boolean;
}

const notifications: Notification[] = [
  { id: 1, title: "New user registered", message: "Sarah Chen created an account", time: "2 min ago", type: "user", read: false },
  { id: 2, title: "Order #ORD-7842 delivered", message: "Olivia Martin's order has been delivered", time: "15 min ago", type: "order", read: false },
  { id: 3, title: "Payment received", message: "$249.99 payment from Acme Corp", time: "1 hour ago", type: "payment", read: false },
  { id: 4, title: "Pro plan upgrade", message: "James Wilson upgraded to Enterprise", time: "2 hours ago", type: "success", read: true },
  { id: 5, title: "System alert", message: "API response time increased by 12%", time: "3 hours ago", type: "alert", read: true },
  { id: 6, title: "New team member", message: "Emily Rodriguez joined your workspace", time: "5 hours ago", type: "user", read: true },
];

const typeIcons = {
  user: UserPlus,
  order: ShoppingCart,
  payment: CreditCard,
  alert: AlertCircle,
  success: CheckCircle2,
};

const typeStyles = {
  user: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
  order: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
  payment: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
  alert: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
  success: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
};

export function NotificationsPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (open) {
      document.addEventListener("mousedown", handler);
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handler);
    }
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-96 origin-top-right rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.map((notif) => {
          const Icon = typeIcons[notif.type];
          return (
            <div
              key={notif.id}
              className={cn(
                "flex items-start gap-3 border-b border-slate-50 px-5 py-3.5 transition-colors hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-700/50",
                !notif.read && "bg-indigo-50/50 dark:bg-indigo-950/20"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  typeStyles[notif.type]
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {notif.title}
                    {!notif.read && (
                      <span className="ml-2 inline-block h-2 w-2 rounded-full bg-indigo-500" />
                    )}
                  </p>
                </div>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {notif.message}
                </p>
                <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{notif.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 px-5 py-3 text-center dark:border-slate-700">
        <button className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
          View all notifications
        </button>
      </div>
    </div>
  );
}
