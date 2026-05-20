"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Search, LayoutDashboard, BarChart3, Users, ShoppingCart, Settings, FileText, Receipt, UserPlus, Activity, ArrowRight, History, HeartPulse } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, category: "Pages", shortcut: "G D" },
  { name: "Analytics", href: "/analytics", icon: BarChart3, category: "Pages", shortcut: "G A" },
  { name: "Users", href: "/users", icon: Users, category: "Pages", shortcut: "G U" },
  { name: "Orders", href: "/orders", icon: ShoppingCart, category: "Pages", shortcut: "G O" },
  { name: "Invoices", href: "/invoices", icon: Receipt, category: "Pages", shortcut: "G I" },
  { name: "Team", href: "/team", icon: UserPlus, category: "Pages", shortcut: "G T" },
  { name: "Audit Log", href: "/audit", icon: Activity, category: "Pages", shortcut: "G L" },
  { name: "Reports", href: "/reports", icon: FileText, category: "Pages", shortcut: "G R" },
  { name: "Health", href: "/health", icon: HeartPulse, category: "Pages", shortcut: "G H" },
  { name: "Settings", href: "/settings", icon: Settings, category: "Pages", shortcut: "⌘," },
];

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const navigate = useCallback(
    (href: string, name: string) => {
      setRecentSearches((prev) => {
        const updated = [name, ...prev.filter((s) => s !== name)].slice(0, 3);
        return updated;
      });
      router.push(href);
      onClose();
    },
    [router, onClose]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      navigate(filtered[selectedIndex].href, filtered[selectedIndex].name);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-700">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages... (try G + letter shortcuts)"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
          />
          <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-xs text-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {query === "" && recentSearches.length > 0 && (
            <>
              <div className="flex items-center gap-2 px-3 py-2">
                <History className="h-3 w-3 text-slate-400" />
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Recent</span>
              </div>
              {recentSearches.map((name, i) => {
                const item = items.find((it) => it.name === name);
                if (!item) return null;
                const Icon = item.icon;
                return (
                  <button
                    key={i}
                    onClick={() => navigate(item.href, item.name)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
              <div className="mx-3 my-2 border-t border-slate-100 dark:border-slate-700" />
            </>
          )}

          <div className="flex items-center gap-2 px-3 py-2">
            <LayoutDashboard className="h-3 w-3 text-slate-400" />
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Pages</span>
          </div>

          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((item, index) => (
              <button
                key={item.href}
                onClick={() => navigate(item.href, item.name)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  index === selectedIndex
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
                )}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <div className="flex-1">
                  <span className="font-medium">{item.name}</span>
                  <span className="ml-2 text-xs text-slate-400">{item.category}</span>
                </div>
                <div className="flex items-center gap-1">
                  {item.shortcut && (
                    <kbd className="hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-500 sm:inline-block">
                      {item.shortcut}
                    </kbd>
                  )}
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-4 py-2 dark:border-slate-700">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>↑↓ Navigate</span>
            <span>↵ Open</span>
            <span>⌘K Close</span>
            <span className="hidden sm:inline">⌘/ Shortcuts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
