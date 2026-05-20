import { StatsCard } from "@/components/dashboard/stats-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
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
          iconColor="text-indigo-600"
          iconBg="bg-indigo-100"
        />
        <StatsCard
          title="Active Users"
          value="2,847"
          change={8.2}
          changeLabel="vs last month"
          icon={Users}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-100"
        />
        <StatsCard
          title="Orders"
          value="1,423"
          change={-3.1}
          changeLabel="vs last month"
          icon={ShoppingCart}
          iconColor="text-amber-600"
          iconBg="bg-amber-100"
        />
        <StatsCard
          title="Growth Rate"
          value="23.6%"
          change={4.3}
          changeLabel="vs last month"
          icon={TrendingUp}
          iconColor="text-rose-600"
          iconBg="bg-rose-100"
        />
      </div>

      {/* Chart & Transactions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <RecentTransactions />
      </div>
    </div>
  );
}
