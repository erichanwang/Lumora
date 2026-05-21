"use client";

import Image from "next/image";
import { CopyButton } from "@/lib/clipboard";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
}

const transactions: Transaction[] = [
  {
    id: "#INV-001",
    customer: "Olivia Martin",
    email: "olivia@example.com",
    amount: 2499,
    status: "completed",
    date: "Feb 23, 2025",
  },
  {
    id: "#INV-002",
    customer: "Jackson Lee",
    email: "jackson@example.com",
    amount: 1299,
    status: "completed",
    date: "Feb 22, 2025",
  },
  {
    id: "#INV-003",
    customer: "Isabella Nguyen",
    email: "isabella@example.com",
    amount: 899,
    status: "pending",
    date: "Feb 21, 2025",
  },
  {
    id: "#INV-004",
    customer: "William Chen",
    email: "william@example.com",
    amount: 4599,
    status: "completed",
    date: "Feb 20, 2025",
  },
  {
    id: "#INV-005",
    customer: "Sofia Rodriguez",
    email: "sofia@example.com",
    amount: 1999,
    status: "failed",
    date: "Feb 19, 2025",
  },
  {
    id: "#INV-006",
    customer: "Ethan Kim",
    email: "ethan@example.com",
    amount: 3299,
    status: "completed",
    date: "Feb 18, 2025",
  },
];

const statusStyles = {
  completed: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
};

export function RecentTransactions() {
  const { toast } = useToast();

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="relative flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-700">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent Transactions
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Latest 6 transactions from your account
          </p>
        </div>
        <div className="absolute right-4 top-4 opacity-[0.04] dark:opacity-[0.03]">
          <Image
            src="/lumora-icon.svg"
            alt=""
            width={40}
            height={40}
            className="dark:hidden"
            unoptimized
          />
          <Image
            src="/lumora-icon-white.svg"
            alt=""
            width={40}
            height={40}
            className="hidden dark:block"
            unoptimized
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Invoice
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 group"
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                  <span className="inline-flex items-center gap-1.5">
                    {tx.id}
                    <CopyButton text={tx.id} toast={toast} />
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {tx.customer}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{tx.email}</p>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                  ${tx.amount.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                      statusStyles[tx.status]
                    )}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                  {tx.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
