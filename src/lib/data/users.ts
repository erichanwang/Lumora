export interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "active" | "inactive" | "pending";
  plan: "Enterprise" | "Pro" | "Free";
  location: string;
  avatar: string;
  joined: string;
  revenue: number;
}

export const users: User[] = [
  { id: 1, name: "Alex Morgan", email: "alex@lumora.io", role: "Admin", status: "active", plan: "Enterprise", location: "San Francisco, CA", avatar: "AM", joined: "2023-01-15", revenue: 12400 },
  { id: 2, name: "Sarah Chen", email: "sarah@example.com", role: "Editor", status: "active", plan: "Pro", location: "New York, NY", avatar: "SC", joined: "2023-03-22", revenue: 8400 },
  { id: 3, name: "James Wilson", email: "james@example.com", role: "Viewer", status: "inactive", plan: "Free", location: "London, UK", avatar: "JW", joined: "2023-06-10", revenue: 0 },
  { id: 4, name: "Emily Rodriguez", email: "emily@example.com", role: "Editor", status: "active", plan: "Pro", location: "Miami, FL", avatar: "ER", joined: "2024-02-05", revenue: 5600 },
  { id: 5, name: "Michael Kim", email: "michael@example.com", role: "Admin", status: "active", plan: "Enterprise", location: "Seattle, WA", avatar: "MK", joined: "2022-08-12", revenue: 18900 },
  { id: 6, name: "Lisa Thompson", email: "lisa@example.com", role: "Viewer", status: "pending", plan: "Free", location: "Austin, TX", avatar: "LT", joined: "2025-03-01", revenue: 0 },
  { id: 7, name: "David Park", email: "david@example.com", role: "Editor", status: "active", plan: "Pro", location: "Chicago, IL", avatar: "DP", joined: "2023-11-18", revenue: 7200 },
  { id: 8, name: "Anna Novak", email: "anna@example.com", role: "Admin", status: "active", plan: "Enterprise", location: "Berlin, DE", avatar: "AN", joined: "2023-04-02", revenue: 15100 },
  { id: 9, name: "Tom Fischer", email: "tom@example.com", role: "Viewer", status: "inactive", plan: "Free", location: "Vienna, AT", avatar: "TF", joined: "2024-09-20", revenue: 0 },
  { id: 10, name: "Rachel Green", email: "rachel@example.com", role: "Editor", status: "active", plan: "Pro", location: "Boston, MA", avatar: "RG", joined: "2023-10-05", revenue: 9300 },
  { id: 11, name: "Chris Evans", email: "chris@example.com", role: "Viewer", status: "pending", plan: "Free", location: "Denver, CO", avatar: "CE", joined: "2025-01-14", revenue: 0 },
  { id: 12, name: "Priya Sharma", email: "priya@example.com", role: "Admin", status: "active", plan: "Enterprise", location: "Mumbai, IN", avatar: "PS", joined: "2022-07-08", revenue: 22100 },
  { id: 13, name: "Omar Hassan", email: "omar@example.com", role: "Editor", status: "active", plan: "Pro", location: "Dubai, AE", avatar: "OH", joined: "2024-06-15", revenue: 6800 },
  { id: 14, name: "Yuki Tanaka", email: "yuki@example.com", role: "Viewer", status: "inactive", plan: "Free", location: "Tokyo, JP", avatar: "YT", joined: "2024-11-30", revenue: 0 },
  { id: 15, name: "Maria Silva", email: "maria@example.com", role: "Editor", status: "active", plan: "Pro", location: "São Paulo, BR", avatar: "MS", joined: "2023-08-21", revenue: 10200 },
];
