"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  showSizeSelector?: boolean;
  pageOptions?: number[];
}

export function EnhancedPagination({
  page,
  totalPages,
  total,
  perPage,
  onPageChange,
  onPerPageChange,
  showSizeSelector = true,
  pageOptions = [5, 10, 20, 50],
}: EnhancedPaginationProps) {
  const [goToValue, setGoToValue] = useState("");
  const [showGoTo, setShowGoTo] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showGoTo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showGoTo]);

  const handleGoTo = useCallback(() => {
    const num = parseInt(goToValue, 10);
    if (num >= 1 && num <= totalPages) {
      onPageChange(num - 1);
    }
    setGoToValue("");
    setShowGoTo(false);
  }, [goToValue, totalPages, onPageChange]);

  const startItem = page * perPage + 1;
  const endItem = Math.min((page + 1) * perPage, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-6 py-3 dark:border-slate-700">
      <div className="flex items-center gap-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing <span className="font-medium text-slate-700 dark:text-slate-300">{startItem}</span>
          –<span className="font-medium text-slate-700 dark:text-slate-300">{endItem}</span> of{" "}
          <span className="font-medium text-slate-700 dark:text-slate-300">{total}</span>
        </p>

        {/* Page size selector */}
        {showSizeSelector && onPerPageChange && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 dark:text-slate-500">Show</span>
            <select
              value={perPage}
              onChange={(e) => {
                onPerPageChange(Number(e.target.value));
                onPageChange(0);
              }}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {pageOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(Math.max(0, page - 1))}
          disabled={page === 0}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </button>

        {/* Page numbers */}
        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
          let pageNum: number;
          if (totalPages <= 7) {
            pageNum = i;
          } else if (page < 4) {
            pageNum = i;
          } else if (page > totalPages - 5) {
            pageNum = totalPages - 7 + i;
          } else {
            pageNum = page - 3 + i;
          }

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={cn(
                "hidden min-w-[32px] rounded-lg px-2 py-1.5 text-xs font-medium transition-colors sm:block",
                page === pageNum
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
              )}
            >
              {pageNum + 1}
            </button>
          );
        })}

        {/* Go to page */}
        {totalPages > 7 && (
          <div className="relative">
            {showGoTo ? (
              <div className="flex items-center gap-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={goToValue}
                  onChange={(e) => setGoToValue(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleGoTo();
                    if (e.key === "Escape") setShowGoTo(false);
                  }}
                  onBlur={() => setTimeout(() => setShowGoTo(false), 200)}
                  placeholder="Go to"
                  className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                />
              </div>
            ) : (
              <button
                onClick={() => setShowGoTo(true)}
                className="rounded-lg px-2 py-1.5 text-xs text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                title="Go to page"
              >
                Go to
              </button>
            )}
          </div>
        )}

        {/* Next button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
