export * from "./users";
export * from "./orders";

export interface RevenuePoint {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export const revenueData: RevenuePoint[] = [
  { date: "Jan", revenue: 45000, expenses: 32000, profit: 13000 },
  { date: "Feb", revenue: 52000, expenses: 34000, profit: 18000 },
  { date: "Mar", revenue: 48000, expenses: 31000, profit: 17000 },
  { date: "Apr", revenue: 61000, expenses: 38000, profit: 23000 },
  { date: "May", revenue: 58000, expenses: 36000, profit: 22000 },
  { date: "Jun", revenue: 67000, expenses: 39000, profit: 28000 },
  { date: "Jul", revenue: 72000, expenses: 41000, profit: 31000 },
  { date: "Aug", revenue: 69000, expenses: 40000, profit: 29000 },
  { date: "Sep", revenue: 78000, expenses: 43000, profit: 35000 },
  { date: "Oct", revenue: 85000, expenses: 45000, profit: 40000 },
  { date: "Nov", revenue: 82000, expenses: 44000, profit: 38000 },
  { date: "Dec", revenue: 94200, expenses: 48000, profit: 46200 },
];

export interface DashboardStats {
  totalRevenue: number;
  activeUsers: number;
  orders: number;
  growthRate: number;
  pageViews: number;
  bounceRate: number;
  avgSession: string;
}

export const dashboardStats: DashboardStats = {
  totalRevenue: 94200,
  activeUsers: 2847,
  orders: 1423,
  growthRate: 23.6,
  pageViews: 142389,
  bounceRate: 24.8,
  avgSession: "4m 32s",
};

export interface Activity {
  user: string;
  action: string;
  time: string;
  type: "upgrade" | "create" | "complete" | "add";
}

export const activities: Activity[] = [
  { user: "Sarah Chen", action: "upgraded to Enterprise", time: "2 min ago", type: "upgrade" },
  { user: "James Wilson", action: "created a new report", time: "15 min ago", type: "create" },
  { user: "Emily Rodriguez", action: "completed onboarding", time: "1 hour ago", type: "complete" },
  { user: "Michael Kim", action: "added 3 team members", time: "2 hours ago", type: "add" },
  { user: "Lisa Thompson", action: "subscribed to Pro", time: "3 hours ago", type: "upgrade" },
  { user: "David Park", action: "generated Q1 report", time: "5 hours ago", type: "create" },
  { user: "Anna Novak", action: "completed audit", time: "1 day ago", type: "complete" },
];

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "user" | "order" | "payment" | "alert" | "success";
  read: boolean;
}

export const notifications: Notification[] = [
  { id: 1, title: "New user registered", message: "Sarah Chen created an account", time: "2 min ago", type: "user", read: false },
  { id: 2, title: "Order #ORD-7842 delivered", message: "Olivia Martin's order has been delivered", time: "15 min ago", type: "order", read: false },
  { id: 3, title: "Payment received", message: "$249.99 payment from Acme Corp", time: "1 hour ago", type: "payment", read: false },
  { id: 4, title: "Pro plan upgrade", message: "James Wilson upgraded to Enterprise", time: "2 hours ago", type: "success", read: true },
  { id: 5, title: "System alert", message: "API response time increased by 12%", time: "3 hours ago", type: "alert", read: true },
  { id: 6, title: "New team member", message: "Emily Rodriguez joined your workspace", time: "5 hours ago", type: "user", read: true },
  { id: 7, title: "Monthly report ready", message: "February analytics report is available for download", time: "1 day ago", type: "success", read: true },
  { id: 8, title: "Payment failed", message: "Invoice INV-2025-004 payment attempt failed", time: "2 days ago", type: "alert", read: true },
];
