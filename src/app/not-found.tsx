import Link from "next/link";
import Image from "next/image";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-50 p-8 dark:bg-slate-950">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-950">
        <Image
          src="/lumora-icon-white.svg"
          alt="Lumora"
          width={36}
          height={36}
          unoptimized
        />
      </div>

      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900 dark:text-white">404</h1>
        <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
          This page doesn&apos;t exist or has been moved.
        </p>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
          The page you&apos;re looking for could not be found.
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
        >
          <Home className="h-4 w-4" />
          Go to Dashboard
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </div>
    </div>
  );
}
