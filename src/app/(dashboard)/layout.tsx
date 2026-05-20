"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { KeyboardShortcuts, useKeyboardShortcuts } from "@/components/layout/keyboard-shortcuts";
import { NotificationToaster } from "@/components/layout/notification-toaster";
import { useTheme } from "@/lib/theme-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
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

  const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
  };

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
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Keyboard shortcuts modal */}
      <KeyboardShortcuts />
      <NotificationToaster />
    </div>
  );
}
