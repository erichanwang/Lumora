"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  User,
  Settings,
  CreditCard,
  LogOut,
  HelpCircle,
  Shield,
} from "lucide-react";
import Link from "next/link";

export function UserDropdown({
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

  const items = [
    { label: "Profile", icon: User, href: "/settings" },
    { label: "Billing", icon: CreditCard, href: "/settings" },
    { label: "Security", icon: Shield, href: "/settings" },
    { label: "Help & Support", icon: HelpCircle, href: "#" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
    >
      {/* User info */}
      <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
            <Image
              src="/lumora-icon-white.svg"
              alt=""
              width={18}
              height={18}
              unoptimized
            />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Alex Morgan</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">alex@lumora.io</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="p-1.5">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onClose}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <item.icon className="h-4 w-4 text-slate-400" />
            {item.label}
          </Link>
        ))}
      </div>

      {/* Sign out */}
      <div className="border-t border-slate-100 p-1.5 dark:border-slate-700">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
