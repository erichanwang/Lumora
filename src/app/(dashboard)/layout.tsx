"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { KeyboardShortcuts, useKeyboardShortcuts } from "@/components/layout/keyboard-shortcuts";
import { NotificationToaster } from "@/components/layout/notification-toaster";
import { RouteLoader, dispatchRouteStart, dispatchRouteComplete } from "@/components/layout/route-loader";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { useToast } from "@/components/ui/toast";
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

  const { toast } = useToast();

  const pageNames: Record<string, string> = {
    "/": "Dashboard",
    "/analytics": "Analytics",
    "/users": "Users",
    "/orders": "Orders",
    "/reports": "Reports",
    "/invoices": "Invoices",
    "/team": "Team",
    "/health": "Health",
    "/audit": "Audit Log",
    "/settings": "Settings",
  };

  useKeyboardShortcuts({
    onSearch: () => {
      const event = new KeyboardEvent("keydown", { metaKey: true, key: "k" });
      document.dispatchEvent(event);
    },
    onToggleTheme: toggle,
    onToggleSidebar: () => setSidebarCollapsed((prev) => !prev),
    onNavigate: (path) => {
      const name = pageNames[path] || path;
      toast(`→ ${name}`, "info");
      dispatchRouteStart();
      router.push(path);
      setTimeout(() => dispatchRouteComplete(), 500);
    },
  });

  const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Skip-to-content link for keyboard users */}
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[200] -translate-y-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-medium text-white shadow-xl opacity-0 transition-all focus:translate-y-0 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
      >
        Skip to content
      </a>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((prev) => !prev)} />
      </div>

      {/* Mobile sidebar */}
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main id="main-content" className="flex-1 overflow-y-auto p-4 lg:p-6" tabIndex={-1}>
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
              className="min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
          {/* Powered by Lumora footer */}
          <div className="mt-8 flex items-center justify-center gap-1.5 pb-4 opacity-30">
            <Image
              src="/favicon.svg"
              alt=""
              width={10}
              height={10}
              unoptimized
            />
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Powered by Lumora</span>
          </div>
        </main>
      </div>

      {/* Keyboard shortcuts modal */}
      <KeyboardShortcuts />
      <NotificationToaster />
      <RouteLoader />
      <ScrollToTop />
    </div>
  );
}
