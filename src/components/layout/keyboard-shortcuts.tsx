"use client";

import { useEffect, useState, useRef } from "react";
import { Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";

const shortcuts = [
  { keys: ["⌘", "K"], label: "Open search" },
  { keys: ["⌘", "D"], label: "Toggle dark mode" },
  { keys: ["⌘", "B"], label: "Toggle sidebar" },
  { keys: ["Escape"], label: "Close modals" },
  { keys: ["⌘", "⇧", "L"], label: "Switch locale" },
  { keys: ["⌘", ","], label: "Open settings" },
  { keys: ["G", "D"], label: "Go to Dashboard" },
  { keys: ["G", "A"], label: "Go to Analytics" },
  { keys: ["G", "U"], label: "Go to Users" },
  { keys: ["G", "O"], label: "Go to Orders" },
];

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // ⌘/Ctrl + / to toggle
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      // Escape to close
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="mx-4 w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-slate-500" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Close"
          >
            <span className="text-xs">ESC</span>
          </button>
        </div>
        <div className="p-4">
          <div className="space-y-1">
            {shortcuts.map((shortcut) => (
              <div
                key={shortcut.label}
                className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {shortcut.label}
                </span>
                <div className="flex items-center gap-1">
                  {shortcut.keys.map((key, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <kbd
                        className={cn(
                          "inline-flex min-w-[1.5rem] items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-xs font-medium text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300",
                          key === "Escape" && "min-w-[3rem]"
                        )}
                      >
                        {key}
                      </kbd>
                      {i < shortcut.keys.length - 1 && (
                        <span className="text-xs text-slate-400">+</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-slate-200 px-5 py-3 dark:border-slate-700">
          <p className="text-center text-xs text-slate-400">
            Press <kbd className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-xs font-medium dark:border-slate-600 dark:bg-slate-700">⌘/Ctrl + /</kbd> to toggle this panel
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to register global keyboard shortcuts.
 * Handles ⌘K (search), ⌘D (dark mode), ⌘B (sidebar), G->navigation
 */
export function useKeyboardShortcuts(handlers: {
  onSearch?: () => void;
  onToggleTheme?: () => void;
  onToggleSidebar?: () => void;
  onNavigate?: (path: string) => void;
}) {
  // Use a ref to avoid re-registering listeners on every render
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    let gPressed = false;

    function handleKeyDown(e: KeyboardEvent) {
      const h = handlersRef.current;
      const meta = e.metaKey || e.ctrlKey;

      // ⌘K — search
      if (meta && e.key === "k") {
        e.preventDefault();
        h.onSearch?.();
        return;
      }

      // ⌘D — dark mode
      if (meta && e.key === "d") {
        e.preventDefault();
        h.onToggleTheme?.();
        return;
      }

      // ⌘B — sidebar
      if (meta && e.key === "b") {
        e.preventDefault();
        h.onToggleSidebar?.();
        return;
      }

      // G then key navigator
      if (e.key === "g" && !meta) {
        gPressed = true;
        setTimeout(() => { gPressed = false; }, 500);
        return;
      }

      if (gPressed && h.onNavigate) {
        const navMap: Record<string, string> = {
          d: "/analytics",
          a: "/analytics",
          u: "/users",
          o: "/orders",
          r: "/reports",
          i: "/invoices",
          s: "/settings",
        };
        const path = navMap[e.key.toLowerCase()];
        if (path) {
          e.preventDefault();
          h.onNavigate(path);
        }
        gPressed = false;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
  // Empty deps — handlersRef is always up-to-date
}
