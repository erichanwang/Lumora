"use client";

import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar, Cell,
} from "recharts";
import { Activity, Clock, CheckCircle2, AlertTriangle, RefreshCw, Server, Cpu, HardDrive, Zap, BarChart3 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PageTransition, SectionItem } from "@/components/ui/page-transition";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const GPU_METRICS = [
  { name: "GPU 0", utilization: 78, memory: 62, temp: 68 },
  { name: "GPU 1", utilization: 82, memory: 71, temp: 72 },
];

const MODEL_VERSIONS = [
  { name: "ResNet-50 v2.4.1", status: "active", accuracy: 96.8, latency: 45, lastDeployed: "Mar 10, 2025" },
  { name: "ResNet-50 v2.4.0", status: "standby", accuracy: 95.9, latency: 48, lastDeployed: "Feb 15, 2025" },
  { name: "ResNet-50 v2.3.0", status: "archived", accuracy: 94.5, latency: 52, lastDeployed: "Jan 8, 2025" },
];

const ENDPOINT_METRICS = [
  { name: "/api/detection", requests: 12457, avgLatency: 45, errorRate: 0.12, p99: 120 },
  { name: "/api/health", requests: 893421, avgLatency: 2, errorRate: 0.01, p99: 8 },
  { name: "/api/stats", requests: 56723, avgLatency: 12, errorRate: 0.05, p99: 45 },
];

export default function HealthPage() {
  const { data, isValidating, mutate } = useSWR("/api/health", fetcher, { refreshInterval: 15000 });
  const [selectedMetric, setSelectedMetric] = useState<"latency" | "requests">("latency");

  const statusColor = data?.status === "healthy" ? "text-emerald-500" : "text-red-500";
  const statusBg = data?.status === "healthy" ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-red-100 dark:bg-red-900/30";
  const StatusIcon = data?.status === "healthy" ? CheckCircle2 : AlertTriangle;

  return (
    <PageTransition>
      <SectionItem>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Image src="/lumora-icon.svg" alt="" width={22} height={22} className="opacity-25 dark:hidden" unoptimized />
            <Image src="/lumora-icon-white.svg" alt="" width={22} height={22} className="hidden opacity-25 dark:block" unoptimized />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Model Health</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor AI model performance, GPU metrics, and API endpoint health
          </p>
        </div>
        <button
          onClick={() => mutate()} disabled={isValidating}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 active:scale-95 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <RefreshCw className={cn("h-4 w-4", isValidating && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Status banner */}
      <div className={cn(
        "flex items-center gap-3 rounded-xl border p-5 shadow-sm",
        data?.status === "healthy" ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
          : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
      )}>
        <StatusIcon className={cn("h-8 w-8", statusColor)} />
        <div className="flex-1">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            Detection Model {data?.status === "healthy" ? "Operational" : "Degraded"}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {data?.status === "healthy" ? "All inference services running normally" : "Some inference services experiencing issues"}
          </p>
        </div>
        <div className="hidden items-center gap-6 sm:flex">
          <div className="text-right"><p className="text-xs text-slate-500 dark:text-slate-400">Uptime</p><span className="text-sm font-semibold text-slate-900 dark:text-white">{data?.uptime || "99.99%"}</span></div>
          <div className="text-right"><p className="text-xs text-slate-500 dark:text-slate-400">P99 Latency</p><span className="text-sm font-semibold text-slate-900 dark:text-white">120ms</span></div>
          <div className="text-right"><p className="text-xs text-slate-500 dark:text-slate-400">Throughput</p><span className="text-sm font-semibold text-slate-900 dark:text-white">142/min</span></div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Uptime", value: "99.99%", icon: Clock, color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/40" },
          { label: "Avg Inference", value: "45ms", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
          { label: "Model Accuracy", value: "96.8%", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
          { label: "Error Rate", value: "0.12%", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/40" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", stat.bg)}>
                  <Icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div><p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p><p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* GPU Utilization */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">GPU Utilization</h3>
          <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">Real-time GPU compute and memory usage</p>
          <div className="space-y-5">
            {GPU_METRICS.map((gpu) => (
              <div key={gpu.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{gpu.name}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">Temp: {gpu.temp}°C</span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1"><span className="text-xs text-slate-500">Compute</span><span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{gpu.utilization}%</span></div>
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all" style={{ width: `${gpu.utilization}%` }} /></div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1"><span className="text-xs text-slate-500">Memory</span><span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{gpu.memory}%</span></div>
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700"><div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all" style={{ width: `${gpu.memory}%` }} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inference Latency Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Inference Latency</h3>
            <div className="flex rounded-lg border border-slate-200 p-0.5 dark:border-slate-700">
              {(["latency", "requests"] as const).map((m) => (
                <button key={m} onClick={() => setSelectedMetric(m)} className={cn("rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-all", selectedMetric === m ? "bg-indigo-600 text-white" : "text-slate-600 dark:text-slate-400")}>{m}</button>
              ))}
            </div>
          </div>
          <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">API response time over the last 24 hours</p>
          <div className="h-64 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.latencyHistory || []} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit="ms" />
                <Tooltip content={({ active, payload, label }) => active && payload?.length ? (
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{payload[0].value}ms</p>
                  </div>) : null
                } />
                <Area type="monotone" dataKey="latency" stroke="#6366f1" strokeWidth={2} fill="url(#latencyGrad)" name="Latency" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model Versions */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="p-5 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Model Versions</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Deployed and archived AI detection model versions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Version</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Accuracy</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Avg Latency</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Deployed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {MODEL_VERSIONS.map((mv) => (
                <tr key={mv.name} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-indigo-500" />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{mv.name}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                      mv.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" :
                      mv.status === "standby" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" :
                      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400")}>
                      {mv.status === "active" ? <CheckCircle2 className="h-3 w-3" /> : mv.status === "standby" ? <Clock className="h-3 w-3" /> : <HardDrive className="h-3 w-3" />}
                      {mv.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">{mv.accuracy}%</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{mv.latency}ms</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{mv.lastDeployed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Endpoint Metrics */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="p-5 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">API Endpoint Metrics</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Request volume and performance per endpoint</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Endpoint</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Requests</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Avg Latency</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">P99</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Error Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {ENDPOINT_METRICS.map((ep) => (
                <tr key={ep.name} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-indigo-500" />
                      <code className="text-sm font-mono text-slate-900 dark:text-white">{ep.name}</code>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">{ep.requests.toLocaleString()}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{ep.avgLatency}ms</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{ep.p99}ms</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", ep.errorRate < 0.1 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400")}>
                      {ep.errorRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
      </SectionItem>
    </PageTransition>
  );
}
