import { cn } from "@/lib/utils";

function Skeleton({ className, delay }: { className?: string; delay?: number }) {
  return (
    <div
      className={cn(
        "rounded-lg bg-slate-200 dark:bg-slate-700/60 relative overflow-hidden",
        "after:absolute after:inset-0 after:translate-x-[-100%] after:animate-shimmer-slide",
        "after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent",
        "dark:after:via-slate-600/30",
        className
      )}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    />
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
      <div className="mt-3 space-y-2">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <Skeleton className="mb-2 h-5 w-40" />
      <Skeleton className="mb-6 h-4 w-56" />
      <Skeleton className="h-72 w-full rounded-xl" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="border-b border-slate-100 p-6 dark:border-slate-700">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="mt-1 h-4 w-48" />
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" delay={0} />
        <Skeleton className="h-4 w-72" delay={50} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartSkeleton />
        <TableSkeleton />
      </div>
    </div>
  );
}
