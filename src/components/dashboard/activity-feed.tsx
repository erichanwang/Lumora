"use client";

import { Clock, RefreshCw } from "lucide-react";
import { useActivity } from "@/lib/swr";

const typeColors: Record<string, string> = {
  upgrade: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400",
  create: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  complete: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  add: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
};

export function ActivityFeed() {
  const { data, error, isValidating } = useActivity();

  const activities = (data?.data as Array<{
    user: string;
    action: string;
    time: string;
    type: string;
  }>) || [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Latest actions from your team</p>
        </div>
        <div className="flex items-center gap-2">
          {isValidating && <RefreshCw className="h-4 w-4 animate-spin text-slate-400" />}
          <Clock className="h-5 w-5 text-slate-400" />
        </div>
      </div>

      {error ? (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          Failed to load activity. Using cached data.
        </div>
      ) : activities.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-400">
          {isValidating ? "Loading activity..." : "No recent activity"}
        </div>
      ) : (
        <div className="space-y-0">
          {activities.map((activity, i) => (
            <div
              key={i}
              className="flex items-start gap-3 border-b border-slate-100 py-3 last:border-0 dark:border-slate-700"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[10px] font-bold text-white">
                {activity.user?.split(" ").map((n: string) => n[0]).join("") || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-medium text-slate-900 dark:text-white">{activity.user}</span>{" "}
                  {activity.action}
                </p>
                <p className="text-xs text-slate-400">{activity.time}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${typeColors[activity.type] || "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"}`}>
                {activity.type}
              </span>
            </div>
          ))}
        </div>
      )}

      {data && !error && (
        <div className="mt-3 text-center">
          <p className="text-[10px] text-slate-400">
            Auto-refreshes every 30s
          </p>
        </div>
      )}
    </div>
  );
}
