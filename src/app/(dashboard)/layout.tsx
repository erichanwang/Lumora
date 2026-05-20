"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { KeyboardShortcuts, useKeyboardShortcuts } from "@/components/layout/keyboard-shortcuts";
import { useTheme } from "@/lib/theme-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  const { toggle } = useTheme();

  useKeyboardShortcuts({
    onSearch: () => {
      const event = new KeyboardEvent("keydown", { metaKey: true, key: "k" });
      document.dispatchEvent(event);
    },
    onToggleTheme: toggle,
    onToggleSidebar: () => setSidebarCollapsed((prev) => !prev),
    onNavigate: (path) => router.push(path),
  });

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((prev) => !prev)} />
      </div>

      {/* Mobile sidebar */}
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mb-4 lg:mb-6">
            <Breadcrumbs />
          </div>
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>

      {/* Keyboard shortcuts modal */}
      <KeyboardShortcuts />
    </div>
  );
}
