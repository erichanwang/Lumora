"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";

export function RouteLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  // Listen for route change start events
  useEffect(() => {
    function handleRouteChangeStart() {
      setLoading(true);
    }
    function handleRouteChangeComplete() {
      setLoading(false);
    }

    // Next.js App Router doesn't expose route events directly,
    // so we listen for link clicks and programmatic navigation
    document.addEventListener("next-route-change-start", handleRouteChangeStart);
    document.addEventListener("next-route-change-complete", handleRouteChangeComplete);

    return () => {
      document.removeEventListener("next-route-change-start", handleRouteChangeStart);
      document.removeEventListener("next-route-change-complete", handleRouteChangeComplete);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[200]">
      {/* Progress bar */}
      <div className="h-1 w-full">
        <div className="h-full w-full animate-progress-bar rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
      </div>
      {/* Lumora logo indicator */}
      <div className="flex justify-center">
        <Image
          src="/lumora-loading.svg"
          alt=""
          width={20}
          height={24}
          className="mt-1 opacity-60 animate-pulse"
          style={{ animationDuration: "1s" }}
          unoptimized
        />
      </div>
    </div>
  );
}

/**
 * Dispatch this before router.push() to trigger the loading bar.
 */
export function dispatchRouteStart() {
  document.dispatchEvent(new CustomEvent("next-route-change-start"));
}

/**
 * Dispatch this after router.push() completes to hide the loading bar.
 */
export function dispatchRouteComplete() {
  document.dispatchEvent(new CustomEvent("next-route-change-complete"));
}
