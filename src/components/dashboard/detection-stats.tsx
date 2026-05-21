"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface DetectionStatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function DetectionStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-indigo-600 dark:text-indigo-400",
  iconBg = "bg-indigo-100 dark:bg-indigo-900/40",
  trend,
  trendValue,
}: DetectionStatCardProps) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-600"
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <div
          className={cn(
            "rounded-lg p-2.5 transition-all duration-200 group-hover:scale-110",
            iconBg
          )}
        >
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        {(subtitle || trendValue) && (
          <div className="mt-1 flex items-center gap-1.5">
            {trend && (
              <span
                className={cn("text-xs font-medium", {
                  "text-emerald-600 dark:text-emerald-400": trend === "up",
                  "text-red-600 dark:text-red-400": trend === "down",
                  "text-slate-500 dark:text-slate-400": trend === "neutral",
                })}
              >
                {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
              </span>
            )}
            {subtitle && (
              <span className="text-xs text-slate-400 dark:text-slate-500">{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
