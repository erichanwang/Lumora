import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export function DetectionPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-20 mt-3" />
            <Skeleton className="h-3 w-28 mt-2" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <Skeleton className="h-5 w-40 mb-1" />
        <Skeleton className="h-3 w-52 mb-6" />
        <Skeleton className="h-72 w-full rounded-lg" />
      </div>

      {/* Filter bar skeleton */}
      <div className="flex flex-wrap gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-lg" />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-slate-100 px-4 py-3 dark:border-slate-700"
          >
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
