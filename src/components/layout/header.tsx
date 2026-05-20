"use client";

import { Bell, Search, Moon, Sun, Menu } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/lib/theme-context";
import { SearchModal } from "./search-modal";
import { NotificationsPanel } from "./notifications-panel";
import { UserDropdown } from "./user-dropdown";
import { LocaleSwitcher } from "./locale-switcher";
import { useNotifications } from "@/lib/swr";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const { resolvedTheme, toggle } = useTheme();
  const { data: notifData } = useNotifications(true);
  const unreadCount = notifData?.unreadCount ?? 0;

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 lg:px-6">
        {/* Left: mobile menu + search */}
        <div className="flex flex-1 items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search bar */}
          <div className="max-w-md flex-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-400 transition-all hover:border-indigo-400 hover:ring-2 hover:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-500 dark:hover:ring-indigo-900/30"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="flex-1">Search anything...</span>
              <kbd className="hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs text-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-500 sm:inline-block">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Locale switcher */}
          <LocaleSwitcher />

          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
              className="relative rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white transition-transform dark:ring-slate-900">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
          </div>

          {/* User menu */}
          <div className="relative ml-1 sm:ml-2">
            <button
              onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
              className="flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Alex Morgan
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  alex@lumora.io
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white transition-transform hover:scale-105">
                AM
              </div>
            </button>
            <UserDropdown open={userOpen} onClose={() => setUserOpen(false)} />
          </div>
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
