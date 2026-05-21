import useSWR from "swr";
import useSWRMutation from "swr/mutation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

/** Default refresh interval for dashboard stats: 30 seconds */
const DASHBOARD_REFRESH_MS = 30000;
/** Default refresh interval for notifications: 15 seconds */
const NOTIFICATION_REFRESH_MS = 15000;
/** Number of times to retry failed SWR fetches */
const ERROR_RETRY_COUNT = 3;

// Generic hook for fetching data with auto-refresh
export function useApi<T>(url: string, refreshInterval?: number) {
  return useSWR<T>(url, fetcher, {
    refreshInterval,
    revalidateOnFocus: true,
    errorRetryCount: ERROR_RETRY_COUNT,
  });
}

// Stats dashboard data
export function useDashboardStats() {
  return useApi<{
    data: {
      totalRevenue: number;
      activeUsers: number;
      orders: number;
      growthRate: number;
      pageViews: number;
      bounceRate: number;
      avgSession: string;
    };
    timestamp: string;
  }>("/api/stats", DASHBOARD_REFRESH_MS);
}

// Users with pagination and filters
export function useUsers(params?: {
  page?: number;
  perPage?: number;
  search?: string;
  role?: string;
  status?: string;
  sortField?: string;
  sortDir?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page != null) searchParams.set("page", String(params.page));
  if (params?.perPage) searchParams.set("perPage", String(params.perPage));
  if (params?.search) searchParams.set("search", params.search);
  if (params?.role && params.role !== "all") searchParams.set("role", params.role);
  if (params?.status && params.status !== "all") searchParams.set("status", params.status);
  if (params?.sortField) searchParams.set("sortField", params.sortField);
  if (params?.sortDir) searchParams.set("sortDir", params.sortDir);

  const qs = searchParams.toString();
  return useApi<{
    data: Array<Record<string, unknown>>;
    pagination: {
      page: number;
      perPage: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }>(`/api/users${qs ? `?${qs}` : ""}`);
}

// Orders with pagination and filters
export function useOrders(params?: {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  sortField?: string;
  sortDir?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page != null) searchParams.set("page", String(params.page));
  if (params?.perPage) searchParams.set("perPage", String(params.perPage));
  if (params?.search) searchParams.set("search", params.search);
  if (params?.status && params.status !== "all") searchParams.set("status", params.status);
  if (params?.sortField) searchParams.set("sortField", params.sortField);
  if (params?.sortDir) searchParams.set("sortDir", params.sortDir);

  const qs = searchParams.toString();
  return useApi<{
    data: Array<Record<string, unknown>>;
    pagination: {
      page: number;
      perPage: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }>(`/api/orders${qs ? `?${qs}` : ""}`);
}

// Revenue data
export function useRevenue() {
  return useApi<{
    data: Array<{ date: string; revenue: number; expenses: number; profit: number }>;
    total: number;
    average: number;
  }>("/api/revenue");
}

// Notifications
export function useNotifications(unreadOnly?: boolean) {
  return useApi<{
    data: Array<{
      id: number;
      title: string;
      message: string;
      time: string;
      type: string;
      read: boolean;
    }>;
    unreadCount: number;
    total: number;
  }>(`/api/notifications${unreadOnly ? "?unread=true" : ""}`, NOTIFICATION_REFRESH_MS);
}

// Mark all notifications as read
export function useMarkAllRead() {
  return useSWRMutation("/api/notifications", (url: string) =>
    fetch(url, { method: "PATCH" }).then((res) => res.json())
  );
}

// Invoices
export function useInvoices(search?: string) {
  return useApi<{
    data: Array<Record<string, unknown>>;
    summary: {
      total: number;
      paid: number;
      pending: number;
      overdue: number;
      totalOutstanding: number;
    };
  }>(`/api/invoices${search ? `?search=${encodeURIComponent(search)}` : ""}`);
}

// Activity feed
export function useActivity() {
  return useApi<{
    data: Array<Record<string, unknown>>;
    total: number;
  }>("/api/activity", DASHBOARD_REFRESH_MS);
}
