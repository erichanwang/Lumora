export interface Order {
  id: string;
  customer: string;
  email: string;
  items: number;
  amount: number;
  status: "delivered" | "shipped" | "processing" | "cancelled";
  payment: "paid" | "pending" | "refunded";
  date: string;
  eta: string;
}

export const orders: Order[] = [
  { id: "ORD-7842", customer: "Olivia Martin", email: "olivia@example.com", items: 3, amount: 249.99, status: "delivered", payment: "paid", date: "2025-03-01", eta: "2025-03-03" },
  { id: "ORD-7841", customer: "Jackson Lee", email: "jackson@example.com", items: 1, amount: 1299.00, status: "shipped", payment: "paid", date: "2025-02-28", eta: "2025-03-05" },
  { id: "ORD-7840", customer: "Isabella Nguyen", email: "isabella@example.com", items: 5, amount: 89.99, status: "processing", payment: "paid", date: "2025-02-27", eta: "2025-03-06" },
  { id: "ORD-7839", customer: "William Chen", email: "william@example.com", items: 2, amount: 459.00, status: "delivered", payment: "paid", date: "2025-02-26", eta: "2025-02-28" },
  { id: "ORD-7838", customer: "Sofia Rodriguez", email: "sofia@example.com", items: 4, amount: 199.95, status: "cancelled", payment: "refunded", date: "2025-02-25", eta: "" },
  { id: "ORD-7837", customer: "Ethan Kim", email: "ethan@example.com", items: 2, amount: 329.99, status: "delivered", payment: "paid", date: "2025-02-24", eta: "2025-02-26" },
  { id: "ORD-7836", customer: "Ava Johnson", email: "ava@example.com", items: 1, amount: 799.00, status: "shipped", payment: "paid", date: "2025-02-23", eta: "2025-03-02" },
  { id: "ORD-7835", customer: "Mason Brown", email: "mason@example.com", items: 7, amount: 1249.50, status: "processing", payment: "pending", date: "2025-02-22", eta: "2025-03-08" },
  { id: "ORD-7834", customer: "Charlotte Davis", email: "charlotte@example.com", items: 2, amount: 54.99, status: "delivered", payment: "paid", date: "2025-02-21", eta: "2025-02-23" },
  { id: "ORD-7833", customer: "Liam Martinez", email: "liam@example.com", items: 1, amount: 1899.00, status: "cancelled", payment: "refunded", date: "2025-02-20", eta: "" },
  { id: "ORD-7832", customer: "Emma Wilson", email: "emma@example.com", items: 3, amount: 445.00, status: "delivered", payment: "paid", date: "2025-02-19", eta: "2025-02-22" },
  { id: "ORD-7831", customer: "Noah Garcia", email: "noah@example.com", items: 2, amount: 689.50, status: "processing", payment: "pending", date: "2025-02-18", eta: "2025-03-04" },
  { id: "ORD-7830", customer: "Sophia Lee", email: "sophia@example.com", items: 6, amount: 124.99, status: "shipped", payment: "paid", date: "2025-02-17", eta: "2025-02-28" },
  { id: "ORD-7829", customer: "Lucas Brown", email: "lucas@example.com", items: 1, amount: 59.99, status: "delivered", payment: "paid", date: "2025-02-16", eta: "2025-02-18" },
  { id: "ORD-7828", customer: "Mia Anderson", email: "mia@example.com", items: 4, amount: 899.00, status: "delivered", payment: "paid", date: "2025-02-15", eta: "2025-02-17" },
];
