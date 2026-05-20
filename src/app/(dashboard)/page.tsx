"use client";

import { motion } from "framer-motion";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { cn } from "@/lib/utils";
import { useDashboardStats } from "@/lib/swr";
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  Activity,
  RefreshCw,
  HeartPulse,
  UserPlus,
  Settings,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const topProducts = [
  { name: "Enterprise Plan", revenue: "$45,200", growth: "+12.3%", color: "bg-indigo-500" },
  { name: "Pro Subscription", revenue: "$28,900", growth: "+8.7%", color: "bg-emerald-500" },
  { name: "Add-on Analytics", revenue: "$12,400", growth: "+15.2%", color: "bg-amber-500" },
  { name: "API Access", revenue: "$7,700", growth: "+22.1%", color: "bg-rose-500" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DashboardPage() {
  const { data: stats, isValidating } = useDashboardStats();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Page header */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Welcome back, Alex! Here&apos;s what&apos;s happening with your business today.
            </p>
          </div>
          {isValidating && (
            <RefreshCw className="h-4 w-4 animate-spin text-slate-400" />
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={stats?.data ? `$${stats.data.totalRevenue.toLocaleString()}` : "$94,200"}
          change={12.5}
          changeLabel="vs last month"
          icon={DollarSign}
          iconColor="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-100 dark:bg-indigo-900/40"
        />
        <StatsCard
          title="Active Users"
          value={stats?.data ? stats.data.activeUsers.toLocaleString() : "2,847"}
          change={8.2}
          changeLabel="vs last month"
          icon={Users}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-100 dark:bg-emerald-900/40"
        />
        <StatsCard
          title="Orders"
          value={stats?.data ? stats.data.orders.toLocaleString() : "1,423"}
          change={-3.1}
          changeLabel="vs last month"
          icon={ShoppingCart}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-100 dark:bg-amber-900/40"
        />
        <StatsCard
          title="Growth Rate"
          value={stats?.data ? `${stats.data.growthRate.toFixed(1)}%` : "23.6%"}
          change={4.3}
          changeLabel="vs last month"
          icon={TrendingUp}
          iconColor="text-rose-600 dark:text-rose-400"
          iconBg="bg-rose-100 dark:bg-rose-900/40"
        />
      </motion.div>

      {/* Secondary stats */}
      <motion.div variants={item} className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Page Views", value: stats?.data?.pageViews?.toLocaleString() || "142,389", change: "+12%", color: "text-indigo-600" },
          { label: "Bounce Rate", value: stats?.data ? `${stats.data.bounceRate.toFixed(1)}%` : "24.8%", change: "-3%", color: "text-emerald-600" },
          { label: "Avg. Session", value: stats?.data?.avgSession || "4m 32s", change: "+8%", color: "text-amber-600" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              <span className={cn("text-sm font-semibold", stat.color)}>{stat.change}</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Quick action cards */}
      <motion.div variants={item} className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/health"
          className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-600"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  System Health
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Check API status and latency</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-500 dark:text-slate-600" />
          </div>
        </Link>
        <Link
          href="/team"
          className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-600"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Invite Team Members
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Add collaborators to your workspace</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-500 dark:text-slate-600" />
          </div>
        </Link>
        <Link
          href="/settings"
          className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-600"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Workspace Settings
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Configure notifications, theme, language</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-500 dark:text-slate-600" />
          </div>
        </Link>
      </motion.div>

      {/* Chart & Transactions */}
      <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <RecentTransactions />
      </motion.div>

      {/* Bottom row: Top Products + Activity Feed */}
      <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
        {/* Top Products */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top Products</h3>
          <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
            Best performing products by revenue
          </p>
          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <div key={product.name} className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{product.name}</p>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700">
                    <div
                      className={cn("h-1.5 rounded-full", product.color)}
                      style={{ width: `${100 - i * 20}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{product.revenue}</p>
                  <p className="text-xs font-medium text-emerald-600">{product.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <ActivityFeed />
      </motion.div>
    </motion.div>
  );
}
