"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 p-8 dark:bg-slate-950">
      <div className="rounded-full bg-red-100 p-5 dark:bg-red-900/30">
        <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Something went wrong
      </h1>
      <p className="max-w-md text-center text-slate-500 dark:text-slate-400">
        An unexpected error occurred. Please try refreshing the page, or return
        to the homepage.
      </p>
      {error.digest && (
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Error ID: {error.digest}
        </p>
      )}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <Home className="h-4 w-4" />
          Go home
        </Link>
      </div>
    </div>
  );
}
