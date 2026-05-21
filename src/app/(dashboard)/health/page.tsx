"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  Activity,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Server,
  Database,
  Shield,
  Zap,
  Mail,
  BarChart3,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CopyButton, useClipboard } from "@/lib/clipboard";
import { useToast } from "@/lib/toast-context";
import { PageTransition, SectionItem } from "@/components/ui/page-transition";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const serviceIcons: Record<string, typeof Server> = {
  "API Gateway": Zap,
  Authentication: Shield,
  Database: Database,
  Cache: Zap,
  "Email Service": Mail,
  Analytics: BarChart3,
};

export default function HealthPage() {
  const { data, isValidating, mutate } = useSWR("/api/health", fetcher, {
    refreshInterval: 10000,
  });
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const { toast: healthToast } = useToast();

  const statusColor = data?.status === "healthy" ? "text-emerald-500" : "text-red-500";
  const statusBg = data?.status === "healthy" ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-red-100 dark:bg-red-900/30";
  const StatusIcon = data?.status === "healthy" ? CheckCircle2 : XCircle;

  return (
    <PageTransition>
      <SectionItem>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/lumora-icon.svg"
                alt=""
                width={22}
                height={22}
                className="opacity-25 dark:hidden"
                unoptimized
              />
              <Image
                src="/lumora-icon-white.svg"
                alt=""
                width={22}
                height={22}
                className="hidden opacity-25 dark:block"
                unoptimized
              />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                System Health
              </h1>
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Monitor API performance, uptime, and service status
            </p>
          </div>
        </div>
        <button
          onClick={() => mutate()}
          disabled={isValidating}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <RefreshCw className={cn("h-4 w-4", isValidating && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Status banner */}
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border p-5 shadow-sm",
          data?.status === "healthy"
            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
            : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
        )}
      >
        <StatusIcon className={cn("h-8 w-8", statusColor)} />
        <div className="flex-1">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            All Systems {data?.status === "healthy" ? "Operational" : "Degraded"}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {data?.status === "healthy"
              ? "All services are running normally"
              : "Some services are experiencing issues"}
          </p>
        </div>
        <div className="hidden items-center gap-4 sm:flex">
          <div className="text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400">Uptime</p>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {data?.uptime || "—"}
              {data?.uptime && <CopyButton text={data.uptime} toast={healthToast} />}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400">Avg Latency</p>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {data?.avgLatency ? `${data.avgLatency}ms` : "—"}
              {data?.avgLatency && (
                <CopyButton text={`${data.avgLatency}ms`} label="Latency" toast={healthToast} />
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Uptime",
            value: data?.uptime || "—",
            icon: Clock,
            color: "text-indigo-600",
            bg: "bg-indigo-100 dark:bg-indigo-900/40",
          },
          {
            label: "Avg Latency",
            value: data?.avgLatency ? `${data.avgLatency}ms` : "—",
            icon: Activity,
            color: "text-emerald-600",
            bg: "bg-emerald-100 dark:bg-emerald-900/40",
          },
          {
            label: "Services",
            value: data?.services?.length || "—",
            icon: Server,
            color: "text-amber-600",
            bg: "bg-amber-100 dark:bg-amber-900/40",
          },
          {
            label: "Status",
            value: "Healthy",
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-100 dark:bg-emerald-900/40",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", stat.bg)}>
                  <Icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Latency chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Response Latency (24h)
        </h3>
        <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
          Average API response time over the last 24 hours
        </p>
        <div className="h-64 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data?.latencyHistory || []}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit="ms" />
              <Tooltip
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {payload[0].value}ms
                      </p>
                    </div>
                  ) : null
                }
              />
              <Area
                type="monotone"
                dataKey="latency"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#latencyGradient)"
                name="Latency"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Services grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(data?.services || []).map((service: { name: string; status: string; latency: number }) => {
          const Icon = serviceIcons[service.name] || Server;
          const isOperational = service.status === "operational";
          return (
            <div
              key={service.name}
              onClick={() => setSelectedService(selectedService === service.name ? null : service.name)}
              className={cn(
                "rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md cursor-pointer dark:bg-slate-800",
                selectedService === service.name
                  ? "border-indigo-300 ring-2 ring-indigo-100 dark:border-indigo-600 dark:ring-indigo-900/30"
                  : "border-slate-200 dark:border-slate-700",
                !isOperational && "border-red-200 dark:border-red-800"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      isOperational
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
                        : "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{service.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{service.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{service.latency}ms</p>
                  <div
                    className={cn(
                      "mt-1 h-2 w-2 rounded-full",
                      isOperational ? "bg-emerald-500" : "bg-red-500"
                    )}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
      </SectionItem>
    </PageTransition>
  );
}
