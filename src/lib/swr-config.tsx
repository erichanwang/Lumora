"use client";

import { SWRConfig } from "swr";
import type { ReactNode } from "react";

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
        dedupingInterval: 2000,
        errorRetryCount: 3,
        errorRetryInterval: 5000,
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
