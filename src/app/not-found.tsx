"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-50 p-8 dark:bg-slate-950">
      {/* Animated logo entrance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-950">
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/lumora-icon-white.svg"
              alt="Lumora"
              width={36}
              height={36}
              unoptimized
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold text-slate-900 dark:text-white">404</h1>
        <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
          This page doesn&apos;t exist or has been moved.
        </p>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
          The page you&apos;re looking for could not be found.
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
        className="flex gap-3"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md active:scale-95"
        >
          <Home className="h-4 w-4" />
          Go to Dashboard
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </motion.div>

      {/* Footer watermark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute bottom-6 flex items-center gap-1.5 opacity-30"
      >
        <Image src="/favicon.svg" alt="" width={10} height={10} unoptimized />
        <span className="text-xs text-slate-400 dark:text-slate-500">Powered by Lumora</span>
      </motion.div>
    </div>
  );
}
