"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useDebounce } from "@/lib/use-debounce";

type AutosaveStatus = "saved" | "saving" | "unsaved" | "idle";

interface UseFormAutosaveOptions<T> {
  key: string;
  data: T;
  delay?: number;
  onSave?: (data: T) => void;
}

interface UseFormAutosaveReturn<T> {
  status: AutosaveStatus;
  lastSaved: Date | null;
  forceSave: () => void;
  clearDraft: () => void;
  hasDraft: boolean;
  loadDraft: () => T | null;
}

/**
 * Debounced form autosave hook with localStorage persistence.
 * Shows "Saving..." → "Saved" → "Unsaved changes" status.
 */
export function useFormAutosave<T>({
  key,
  data,
  delay = 1000,
  onSave,
}: UseFormAutosaveOptions<T>): UseFormAutosaveReturn<T> {
  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const debouncedData = useDebounce(data, delay);
  const prevRef = useRef(data);
  const isInitialMount = useRef(true);

  // Track unsaved changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const hasChanged = JSON.stringify(prevRef.current) !== JSON.stringify(data);
    if (hasChanged) {
      setStatus("unsaved");
    }
    prevRef.current = data;
  }, [data]);

  // Autosave debounced data to localStorage
  useEffect(() => {
    if (isInitialMount.current) return;

    const hasChanged = JSON.stringify(prevRef.current) !== JSON.stringify(debouncedData);
    if (!hasChanged) return;

    setStatus("saving");

    const timer = setTimeout(() => {
      try {
        localStorage.setItem(`lumora-draft-${key}`, JSON.stringify(debouncedData));
        setLastSaved(new Date());
        setStatus("saved");
        onSave?.(debouncedData);

        // Reset to idle after 3s
        setTimeout(() => {
          setStatus((s) => (s === "saved" ? "idle" : s));
        }, 3000);
      } catch {
        setStatus("idle");
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedData, key]);

  const forceSave = useCallback(() => {
    try {
      localStorage.setItem(`lumora-draft-${key}`, JSON.stringify(data));
      setLastSaved(new Date());
      setStatus("saved");
      onSave?.(data);
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("idle");
    }
  }, [data, key, onSave]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(`lumora-draft-${key}`);
      setStatus("idle");
    } catch {
      // Silently fail
    }
  }, [key]);

  const loadDraft = useCallback((): T | null => {
    try {
      const raw = localStorage.getItem(`lumora-draft-${key}`);
      if (raw) return JSON.parse(raw) as T;
    } catch {
      // Silently fail
    }
    return null;
  }, [key]);

  return {
    status,
    lastSaved,
    forceSave,
    clearDraft,
    hasDraft: !!loadDraft(),
    loadDraft,
  };
}

/**
 * Inline autosave status badge component.
 */
export function AutosaveBadge({ status, lastSaved }: { status: AutosaveStatus; lastSaved: Date | null }) {
  if (status === "idle" && !lastSaved) return null;

  const config = {
    saved: { label: "Draft saved", color: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
    saving: { label: "Saving...", color: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500 animate-pulse" },
    unsaved: { label: "Unsaved changes", color: "text-slate-500 dark:text-slate-400", dot: "bg-slate-400" },
    idle: { label: "", color: "", dot: "" },
  };

  const c = config[status];
  if (!c.label) return null;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${c.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
      {status === "saved" && lastSaved && (
        <span className="text-slate-400 dark:text-slate-500">
          {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      )}
    </span>
  );
}
