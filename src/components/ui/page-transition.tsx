"use client";

import { motion, type Variants, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, type ReactNode } from "react";

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps page content with a fade-in + slide-up entrance animation.
 * Uses a staggered container for child sections.
 */
export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * An individual animated section within a PageTransition.
 * Staggers automatically when nested inside PageTransition.
 */
export function SectionItem({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Standalone fade-in animation for a single element (no stagger).
 */
export function FadeIn({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={defaultVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Page transition with a brief Lumora logo splash overlay.
 * Wraps page content and shows logo briefly on mount.
 */
export function PageTransitionWithLogo({ children, className = "" }: PageTransitionProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            key="logo-splash"
            className="fixed inset-0 z-[300] flex items-center justify-center bg-white dark:bg-slate-950"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center gap-4"
            >
              <Image
                src="/lumora-loading.svg"
                alt=""
                width={80}
                height={93}
                className="animate-pulse"
                style={{ animationDuration: "2s" }}
                unoptimized
              />
              <div className="h-1 w-32 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div className="h-full w-full animate-progress-bar rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={className}
      >
        {children}
      </motion.div>
    </>
  );
}
