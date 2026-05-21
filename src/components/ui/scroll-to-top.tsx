"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Find the dashboard's scrollable main content container
    containerRef.current = document.getElementById("main-content");
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      setVisible(container.scrollTop > 400);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    // Check initial position
    onScroll();
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:shadow-xl hover:ring-indigo-300 active:scale-95 dark:bg-slate-800 dark:ring-slate-700 dark:hover:bg-slate-700 dark:hover:ring-indigo-700"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-4 w-4 text-slate-600 dark:text-slate-300" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
