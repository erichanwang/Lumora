export default function DashboardLoading() {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-6">
      {/* Animated logo — light mode */}
      <div className="relative block dark:hidden">
        <img
          src="/lumora-loading.svg"
          alt="Lumora"
          width={120}
          height={140}
          className="animate-pulse"
          style={{ animationDuration: "2s" }}
        />
      </div>
      {/* Animated logo — dark mode */}
      <div className="relative hidden dark:block">
        <img
          src="/lumora-loading-white.svg"
          alt="Lumora"
          width={120}
          height={140}
          className="animate-pulse"
          style={{ animationDuration: "2s" }}
        />
      </div>
      {/* Loading bar */}
      <div className="h-1 w-48 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div className="h-full w-full animate-progress-bar rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
      </div>
      <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
        Loading your dashboard...
      </p>
    </div>
  );
}
