export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-800 dark:border-t-indigo-400" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading Lumora...</p>
      </div>
    </div>
  );
}
