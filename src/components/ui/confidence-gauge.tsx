"use client";

import { cn } from "@/lib/utils";

interface ConfidenceGaugeProps {
  value: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { dimension: 64, stroke: 6, fontSize: "text-sm", labelSize: "text-[10px]" },
  md: { dimension: 96, stroke: 8, fontSize: "text-lg", labelSize: "text-xs" },
  lg: { dimension: 128, stroke: 10, fontSize: "text-2xl", labelSize: "text-sm" },
};

export function ConfidenceGauge({ value, size = "md", showLabel = true, className }: ConfidenceGaugeProps) {
  const { dimension, stroke, fontSize, labelSize } = sizeMap[size];
  const radius = (dimension - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const getColor = (v: number) => {
    if (v >= 95) return "stroke-emerald-500";
    if (v >= 85) return "stroke-amber-500";
    if (v >= 70) return "stroke-orange-500";
    return "stroke-red-500";
  };

  const getTrackColor = (v: number) => {
    if (v >= 95) return "stroke-emerald-100 dark:stroke-emerald-900/30";
    if (v >= 85) return "stroke-amber-100 dark:stroke-amber-900/30";
    if (v >= 70) return "stroke-orange-100 dark:stroke-orange-900/30";
    return "stroke-red-100 dark:stroke-red-900/30";
  };

  const getTextColor = (v: number) => {
    if (v >= 95) return "text-emerald-600 dark:text-emerald-400";
    if (v >= 85) return "text-amber-600 dark:text-amber-400";
    if (v >= 70) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <svg width={dimension} height={dimension} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          className={cn(getTrackColor(value))}
          strokeWidth={stroke}
        />
        {/* Value arc */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          className={cn(getColor(value), "transition-all duration-1000 ease-out")}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-bold", getTextColor(value), fontSize)}>
          {value.toFixed(1)}
        </span>
        {showLabel && (
          <span className={cn("font-medium text-slate-400 dark:text-slate-500", labelSize)}>
            %
          </span>
        )}
      </div>
    </div>
  );
}

/** Horizontal bar version for inline use */
export function ConfidenceBar({ value, className }: { value: number; className?: string }) {
  const getBarColor = (v: number) => {
    if (v >= 95) return "bg-emerald-500";
    if (v >= 85) return "bg-amber-500";
    if (v >= 70) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", getBarColor(value))}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
      <span className={cn("text-xs font-semibold tabular-nums", getBarColor(value).replace("bg-", "text-"))}>
        {value.toFixed(1)}%
      </span>
    </div>
  );
}
