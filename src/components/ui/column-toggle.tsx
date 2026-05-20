"use client";

import { useState, useRef, useEffect } from "react";
import { Columns3, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ColumnDef {
  key: string;
  label: string;
  defaultVisible?: boolean;
}

interface ColumnToggleProps {
  columns: ColumnDef[];
  visibleColumns: Set<string>;
  onChange: (keys: Set<string>) => void;
}

export function ColumnToggle({ columns, visibleColumns, onChange }: ColumnToggleProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggleColumn = (key: string) => {
    const next = new Set(visibleColumns);
    // Don't allow hiding the last column
    if (next.has(key) && next.size <= 1) return;
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChange(next);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        title="Toggle columns"
      >
        <Columns3 className="h-3.5 w-3.5" />
        Columns
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
          {columns.map((col) => (
            <button
              key={col.key}
              onClick={() => toggleColumn(col.key)}
              disabled={visibleColumns.has(col.key) && visibleColumns.size <= 1}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50",
                visibleColumns.has(col.key)
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-400 dark:text-slate-500",
                visibleColumns.has(col.key) && visibleColumns.size <= 1 && "cursor-not-allowed opacity-50"
              )}
            >
              <div
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                  visibleColumns.has(col.key)
                    ? "border-indigo-500 bg-indigo-500"
                    : "border-slate-300 dark:border-slate-600"
                )}
              >
                {visibleColumns.has(col.key) && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </div>
              {col.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
