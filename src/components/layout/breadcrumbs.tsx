"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { useMemo } from "react";

const labelMap: Record<string, string> = {
  "": "Dashboard",
  analytics: "Analytics",
  users: "Users",
  orders: "Orders",
  reports: "Reports",
  invoices: "Invoices",
  settings: "Settings",
};

export function Breadcrumbs() {
  const pathname = usePathname();

  const segments = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return [{ label: "Dashboard", href: "/" }];

    return parts.map((part, index) => {
      const href = "/" + parts.slice(0, index + 1).join("/");
      const label = labelMap[part.toLowerCase()] || part.charAt(0).toUpperCase() + part.slice(1);
      return { label, href };
    });
  }, [pathname]);

  return (
    <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
      <Link
        href="/"
        className="flex items-center gap-1 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {segments.map((segment, index) => (
        <div key={segment.href} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
          {index === segments.length - 1 ? (
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {segment.label}
            </span>
          ) : (
            <Link
              href={segment.href}
              className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
            >
              {segment.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
