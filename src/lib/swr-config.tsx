"use client";

import { SWRConfig } from "swr";
import type { ReactNode } from "react";

/** Milliseconds between identical key requests to deduplicate */
const DEDUPING_INTERVAL_MS = 2000;
/** Number of times to retry failed requests */
const ERROR_RETRY_COUNT = 3;
/** Milliseconds between retry attempts */
const ERROR_RETRY_INTERVAL_MS = 5000;

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    return res.json();
  });

export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        dedupingInterval: DEDUPING_INTERVAL_MS,
        errorRetryCount: ERROR_RETRY_COUNT,
        errorRetryInterval: ERROR_RETRY_INTERVAL_MS,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        keepPreviousData: true,
        onError: (err: unknown) => {
          // Only log in development
          if (process.env.NODE_ENV === "development") {
            console.error("[SWR]", err instanceof Error ? err.message : String(err));
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
