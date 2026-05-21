"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface SpinnerProps {
  /** Spinner size in pixels. Default 32 */
  size?: number;
  /** Additional class names */
  className?: string;
  /** Whether to show the Lumora icon branding. Default true */
  branded?: boolean;
  /** Accessible label for screen readers */
  label?: string;
}

export function Spinner({
  size = 32,
  className,
  branded = true,
  label = "Loading...",
}: SpinnerProps) {
  const ringWidth = Math.max(4, Math.round(size * 0.125));
  const halfSize = size / 2;

  return (
    <div
      role="status"
      aria-label={label}
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {/* Spinning ring */}
      <svg
        className="animate-spin"
        viewBox={`0 0 ${size} ${size}`}
        style={{ width: size, height: size }}
      >
        <circle
          cx={halfSize}
          cy={halfSize}
          r={halfSize - ringWidth}
          fill="none"
          stroke="currentColor"
          strokeWidth={ringWidth}
          className="text-slate-200 dark:text-slate-700"
        />
        <circle
          cx={halfSize}
          cy={halfSize}
          r={halfSize - ringWidth}
          fill="none"
          stroke="currentColor"
          strokeWidth={ringWidth}
          strokeLinecap="round"
          strokeDasharray={`${Math.round(halfSize * 2.5)} ${Math.round(halfSize * 1.2)}`}
          className="text-indigo-500 dark:text-indigo-400"
        />
      </svg>

      {/* Centered Lumora icon */}
      {branded && size >= 24 && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/lumora-icon.svg"
            alt=""
            width={Math.round(size * 0.45)}
            height={Math.round(size * 0.45)}
            className="dark:hidden"
            unoptimized
          />
          <Image
            src="/lumora-icon-white.svg"
            alt=""
            width={Math.round(size * 0.45)}
            height={Math.round(size * 0.45)}
            className="hidden dark:block"
            unoptimized
          />
        </span>
      )}

    </div>
  );
}
