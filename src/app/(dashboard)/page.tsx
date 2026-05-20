import { StatsCard } from "@/components/dashboard/stats-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  Activity,
  Clock,
} from "lucide-react";

const topProducts = [
  { name: "Enterprise Plan", revenue: "$45,200", growth: "+12.3%", color: "bg-indigo-500" },
  { name: "Pro Subscription", revenue: "$28,900", growth: "+8.7%", color: "bg-emerald-500" },
  { name: "Add-on Analytics", revenue: "$12,400", growth: "+15.2%", color: "bg-amber-500" },
  { name: "API Access", revenue: "$7,700", growth: "+22.1%", color: "bg-rose-500" },
];

const activities = [
  { user: "Sarah Chen", action: "upgraded to Enterprise", time: "2 min ago", type: "upgrade" },
  { user: "James Wilson", action: "created a new report", time: "15 min ago", type: "create" },
  { user: "Emily Rodriguez", action: "completed onboarding", time: "1 hour ago", type: "complete" },
  { user: "Michael Kim", action: "added 3 team members", time: "2 hours ago", type: "add" },
  { user: "Lisa Thompson", action: "subscribed to Pro", time: "3 hours ago", type: "upgrade" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Welcome back, Alex! Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value="$94,200"
          change={12.5}
          changeLabel="vs last month"
          icon={DollarSign}
          iconColor="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-100 dark:bg-indigo-900/40"
        />
        <StatsCard
          title="Active Users"
          value="2,847"
          change={8.2}
          changeLabel="vs last month"
          icon={Users}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-100 dark:bg-emerald-900/40"
        />
        <StatsCard
          title="Orders"
          value="1,423"
          change={-3.1}
          changeLabel="vs last month"
          icon={ShoppingCart}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-100 dark:bg-amber-900/40"
        />
        <StatsCard
          title="Growth Rate"
          value="23.6%"
          change={4.3}
          changeLabel="vs last month"
          icon={TrendingUp}
          iconColor="text-rose-600 dark:text-rose-400"
          iconBg="bg-rose-100 dark:bg-rose-900/40"
        />
      </div>

      {/* Secondary stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Page Views", value: "142,389", change: "+12%", icon: Activity, color: "text-indigo-600" },
          { label: "Bounce Rate", value: "24.8%", change: "-3%", color: "text-emerald-600" },
          { label: "Avg. Session", value: "4m 32s", change: "+8%", color: "text-amber-600" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              <span className={cn("text-sm font-semibold", stat.color)}>{stat.change}</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart & Transactions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <RecentTransactions />
      </div>

      {/* Bottom row: Top Products + Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Products */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
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

        {/* Recent Activity */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Latest actions from your team</p>
            </div>
            <Clock className="h-5 w-5 text-slate-400" />
          </div>
          <div className="space-y-0">
            {activities.map((activity, i) => (
              <div
                key={i}
                className="flex items-start gap-3 border-b border-slate-100 py-3 last:border-0 dark:border-slate-700"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[10px] font-bold text-white">
                  {activity.user.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-medium text-slate-900 dark:text-white">{activity.user}</span>{" "}
                    {activity.action}
                  </p>
                  <p className="text-xs text-slate-400">{activity.time}</p>
                </div>
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 capitalize dark:bg-slate-700 dark:text-slate-400">
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
