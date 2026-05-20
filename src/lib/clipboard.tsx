"use client";

import { useCallback } from "react";

/**
 * Copy text to clipboard and return whether it succeeded
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textArea);
    return success;
  } catch {
    return false;
  }
}

type ToastFn = (message: string, type?: "success" | "error" | "warning" | "info") => void;

/**
 * Hook that provides a copy function with built-in toast notification.
 * Usage: const { copy } = useClipboard(toast);
 *         copy("text to copy", "Copied!");
 */
export function useClipboard(toast: ToastFn) {
  const copy = useCallback(
    async (text: string, label?: string) => {
      const success = await copyToClipboard(text);
      if (success) {
        toast(label ? `${label} copied to clipboard` : "Copied to clipboard", "success");
      } else {
        toast("Failed to copy to clipboard", "error");
      }
    },
    [toast],
  );

  return { copy };
}

/**
 * Simple inline copy button component
 */
export function CopyButton({
  text,
  label,
  toast,
  className = "",
}: {
  text: string;
  label?: string;
  toast: ToastFn;
  className?: string;
}) {
  const { copy } = useClipboard(toast);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        copy(text, label);
      }}
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300 ${className}`}
      title="Click to copy"
    >
      📋
    </button>
  );
}
