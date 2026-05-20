import { Users } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your team members and user accounts.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-20 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
          <Users className="h-8 w-8 text-indigo-600" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          User Management
        </h3>
        <p className="mt-1 max-w-sm text-center text-sm text-slate-500">
          View and manage all users, assign roles, and control permissions from
          this section.
        </p>
      </div>
    </div>
  );
}
