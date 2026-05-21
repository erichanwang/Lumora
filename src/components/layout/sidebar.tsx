"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  ShoppingCart,
  Settings,
  ChevronLeft,
  FileText,
  Receipt,
  Activity,
  UserCog,
  ScrollText,
  Microscope,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Tooltip } from "@/components/ui/tooltip";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Detection", href: "/detection", icon: Microscope },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Users", href: "/users", icon: Users },
  { name: "Team", href: "/team", icon: UserCog },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Invoices", href: "/invoices", icon: Receipt },
  { name: "Audit Log", href: "/audit", icon: ScrollText },
  { name: "Health", href: "/health", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ collapsed: controlledCollapsed, onToggle }: { collapsed?: boolean; onToggle?: () => void }) {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const collapsed = controlledCollapsed ?? internalCollapsed;

  const toggleCollapsed = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-slate-900 text-white transition-all duration-300 dark:bg-slate-950",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-4 dark:border-slate-900">
        {collapsed ? (
          <Image
            src="/lumora-icon-white.svg"
            alt="Lumora"
            width={32}
            height={32}
            className="shrink-0"
            unoptimized
          />
        ) : (
          <div className="flex flex-col gap-0.5">
            <Image
              src="/lumora-logo-white.svg"
              alt="Lumora"
              width={140}
              height={28}
              className="shrink-0"
              priority
              unoptimized
            />
            <span className="text-[10px] text-slate-500 font-mono tracking-wider">
              Ctrl+/ for shortcuts
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "text-indigo-400 dark:text-indigo-300"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white dark:hover:bg-slate-900",
                collapsed && isActive && "ring-1 ring-indigo-500/30"
              )}
              title={collapsed ? item.name : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-indigo-500/10 shadow-sm dark:bg-indigo-500/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon className="relative z-10 h-5 w-5 shrink-0" />
              {!collapsed && <span className="relative z-10">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div className="border-t border-slate-800 p-3 dark:border-slate-900">
        {!collapsed && (
          <div className="flex items-center justify-center pb-2 opacity-15">
            <Image
              src="/lumora-icon-white.svg"
              alt=""
              width={14}
              height={14}
              unoptimized
            />
          </div>
        )}
        <Tooltip content={collapsed ? "Expand sidebar" : "Collapse sidebar"} branded>
        <button
          onClick={toggleCollapsed}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white dark:hover:bg-slate-900",
            collapsed && "justify-center"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className={cn(
              "h-5 w-5 transition-transform",
              collapsed && "rotate-180"
            )}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
        </Tooltip>
      </div>
    </aside>
  );
}
