declare module "swr" {
  import type { ReactNode } from "react";

  interface SWRConfiguration<Data = unknown, Error = unknown> {
    fetcher?: (...args: any[]) => any;
    fallback?: Record<string, Data>;
    revalidateOnFocus?: boolean;
    revalidateOnReconnect?: boolean;
    refreshInterval?: number;
    refreshWhenHidden?: boolean;
    refreshWhenOffline?: boolean;
    shouldRetryOnError?: boolean;
    dedupingInterval?: number;
    focusThrottleInterval?: number;
    loadingTimeout?: number;
    errorRetryInterval?: number;
    errorRetryCount?: number;
    revalidateIfStale?: boolean;
    isPaused?: () => boolean;
    compare?: (a: Data | undefined, b: Data | undefined) => boolean;
    fallbackData?: Data;
    keepPreviousData?: boolean;
    onLoadingSlow?: (key: string, config: SWRConfiguration<Data, Error>) => void;
    onSuccess?: (data: Data, key: string, config: SWRConfiguration<Data, Error>) => void;
    onError?: (err: unknown, key: string, config: SWRConfiguration<Data, Error>) => void;
    onErrorRetry?: (
      err: Error,
      key: string,
      config: SWRConfiguration<Data, Error>,
      revalidate: { retryCount: number },
      revalidateOptions: Record<string, unknown>
    ) => void;
  }

  interface SWRResponse<Data = unknown, Error = unknown> {
    data?: Data;
    error?: Error;
    isValidating: boolean;
    isLoading: boolean;
    mutate: (
      data?: Data | Promise<Data> | ((currentData: Data) => Data),
      shouldRevalidate?: boolean
    ) => Promise<Data | undefined>;
  }

  export function SWRConfig(props: {
    value: SWRConfiguration;
    children?: ReactNode;
  }): JSX.Element;

  export default function useSWR<Data = unknown, Error = unknown>(
    key: string | null | (() => string | null),
    fetcher?: ((...args: any[]) => Data | Promise<Data>) | null,
    config?: SWRConfiguration<Data, Error>
  ): SWRResponse<Data, Error>;
}

declare module "swr/mutation" {
  import type { SWRConfiguration, SWRResponse } from "swr";

  interface SWRMutationConfiguration<Data = unknown, Error = unknown> {
    optimisticData?: Data;
    populateCache?: boolean;
    rollbackOnError?: boolean;
    revalidate?: boolean;
  }

  export default function useSWRMutation<Data = unknown, Error = unknown>(
    key: string | null,
    fetcher: (...args: any[]) => Promise<Data>,
    config?: SWRMutationConfiguration<Data, Error> & SWRConfiguration<Data, Error>
  ): SWRResponse<Data, Error> & { trigger: (extraArg?: Record<string, unknown>) => Promise<Data | undefined>; reset: () => void };
}
