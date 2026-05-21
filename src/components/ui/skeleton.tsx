import { cn } from "@/lib/utils";

/**
 * Skeleton placeholder component with staggered animation and dark-mode shimmer.
 *
 * Uses Tailwind's `animate-shimmer` with a diagonal gradient sweep on dark mode
 * for a more sophisticated loading feel than the basic pulse.
 */
export function Skeleton({
  className,
  delay,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { delay?: number }) {
  return (
    <div
      className={cn(
        "rounded-md relative overflow-hidden",
        "bg-slate-200 dark:bg-slate-700/60",
        "after:absolute after:inset-0 after:translate-x-[-100%] after:animate-shimmer-slide",
        "after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent",
        "dark:after:via-slate-600/30",
        className
      )}
      style={delay != null ? { animationDelay: `${delay}ms` } : undefined}
      {...props}
    />
  );
}
