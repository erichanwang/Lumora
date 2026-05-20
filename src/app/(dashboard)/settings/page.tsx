export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* General */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              General Information
            </h3>
            <p className="mb-5 text-sm text-slate-500">
              Update your personal details
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue="Alex"
                  className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue="Morgan"
                  className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="alex@lumora.io"
                  className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
                Save Changes
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Notifications
            </h3>
            <p className="mb-5 text-sm text-slate-500">
              Choose what notifications you receive
            </p>
            <div className="space-y-4">
              {[
                { label: "Email notifications", desc: "Receive emails about account activity" },
                { label: "Push notifications", desc: "Receive push notifications in browser" },
                { label: "Weekly digest", desc: "Get a weekly summary of your activity" },
                { label: "Product updates", desc: "Receive updates about new features" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-4"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      defaultChecked={item.label !== "Product updates"}
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:bg-indigo-600 peer-checked:after:translate-x-full" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-6">
          {/* Profile card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold text-white">
                AM
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">
                Alex Morgan
              </h3>
              <p className="text-sm text-slate-500">Administrator</p>
            </div>
            <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Plan</span>
                <span className="font-medium text-slate-900">Enterprise</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Team Members</span>
                <span className="font-medium text-slate-900">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Storage</span>
                <span className="font-medium text-slate-900">45.2 GB</span>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-red-600">
              Danger Zone
            </h3>
            <p className="mb-4 text-sm text-slate-500">
              Irreversible actions
            </p>
            <button className="w-full rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
