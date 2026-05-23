"use client";

import { useState, useEffect } from "react";
import { Brain, Activity, Cpu, HardDrive, Wifi, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModelHealthData {
  status: "healthy" | "degraded" | "down";
  uptime: string;
  gpuUtilization: number;
  memoryUsage: number;
  queueDepth: number;
  avgLatency: number;
  requestsPerMinute: number;
  errorRate: number;
  lastDeployed: string;
}

const mockHealthData: ModelHealthData = {
  status: "healthy",
  uptime: "14d 6h 32m",
  gpuUtilization: 47.3,
  memoryUsage: 62.8,
  queueDepth: 3,
  avgLatency: 1.8,
  requestsPerMinute: 342,
  errorRate: 0.02,
  lastDeployed: "2025-03-01T08:00:00Z",
};

interface ModelHealthIndicatorProps {
  compact?: boolean;
  className?: string;
}

export function ModelHealthIndicator({ compact = false, className }: ModelHealthIndicatorProps) {
  const [data, setData] = useState<ModelHealthData>(mockHealthData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setData({
        ...mockHealthData,
        gpuUtilization: Math.min(100, Math.max(10, mockHealthData.gpuUtilization + (Math.random() * 20 - 10))),
        requestsPerMinute: Math.floor(mockHealthData.requestsPerMinute + (Math.random() * 50 - 25)),
        queueDepth: Math.max(0, Math.floor(Math.random() * 8)),
      });
      setIsRefreshing(false);
    }, 600);
  };

  const statusConfig = {
    healthy: { color: "text-emerald-500", bg: "bg-emerald-500", label: "Healthy", icon: CheckCircle2 },
    degraded: { color: "text-amber-500", bg: "bg-amber-500", label: "Degraded", icon: AlertTriangle },
    down: { color: "text-red-500", bg: "bg-red-500", label: "Down", icon: AlertTriangle },
  };

  const { color, bg, label, icon: StatusIcon } = statusConfig[data.status];

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <span className={cn("relative flex h-2.5 w-2.5")}>
          <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", bg)} />
          <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", bg)} />
        </span>
        <span className={cn("text-xs font-medium", color)}>{label}</span>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40">
            <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Model Health</h4>
            <div className="flex items-center gap-1.5">
              <span className={cn("relative flex h-2 w-2")}>
                <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", bg)} />
                <span className={cn("relative inline-flex h-2 w-2 rounded-full", bg)} />
              </span>
              <span className={cn("text-xs font-medium", color)}>{label}</span>
            </div>
          </div>
        </div>
        <button
          onClick={refresh}
          disabled={isRefreshing}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          aria-label="Refresh model health"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
        </button>
      </div>

      <div className="space-y-3">
        <MetricRow icon={Activity} label="GPU" value={`${data.gpuUtilization.toFixed(1)}%`} />
        <MetricRow icon={HardDrive} label="Memory" value={`${data.memoryUsage.toFixed(1)}%`} />
        <MetricRow icon={Wifi} label="Latency" value={`${data.avgLatency.toFixed(1)}s`} />
        <MetricRow icon={Cpu} label="Queue" value={`${data.queueDepth} requests`} />
        <MetricRow icon={Activity} label="Throughput" value={`${data.requestsPerMinute}/min`} />
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-700">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Error Rate: <span className="font-medium text-emerald-600">{data.errorRate}%</span></span>
          <span>Uptime: <span className="font-medium text-slate-700 dark:text-slate-300">{data.uptime}</span></span>
        </div>
      </div>
    </div>
  );
}

function MetricRow({ icon: Icon, label, value }: { icon: typeof Activity; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>
      <span className="text-sm font-medium tabular-nums text-slate-900 dark:text-white">{value}</span>
    </div>
  );
}
