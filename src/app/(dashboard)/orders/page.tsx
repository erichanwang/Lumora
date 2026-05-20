import { ShoppingCart } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track and manage all customer orders.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-20 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <ShoppingCart className="h-8 w-8 text-amber-600" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          Order Management
        </h3>
        <p className="mt-1 max-w-sm text-center text-sm text-slate-500">
          View all orders, process returns, and manage fulfillment from this
          section.
        </p>
      </div>
    </div>
  );
}
