"use client";

import { useTheme } from "@/lib/theme-context";
import { Moon, Sun } from "lucide-react";

export default function SettingsPage() {
  const { theme, toggle } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* General */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              General Information
            </h3>
            <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
              Update your personal details
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue="Alex"
                  className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue="Morgan"
                  className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="alex@lumora.io"
                  className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
                Save Changes
              </button>
            </div>
          </div>

          {/* Appearance */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Appearance
            </h3>
            <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
              Customize your dashboard experience
            </p>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-600">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Dark Mode
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {theme === "dark" ? "Dark mode is active" : "Switch to dark mode"}
                </p>
              </div>
              <button
                onClick={toggle}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-amber-500" />
                ) : (
                  <Moon className="h-5 w-5 text-indigo-500" />
                )}
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Notifications
            </h3>
            <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
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
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-4 dark:border-slate-600"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      defaultChecked={item.label !== "Product updates"}
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:bg-indigo-600 peer-checked:after:translate-x-full dark:bg-slate-600 dark:after:bg-slate-300" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-6">
          {/* Profile card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold text-white">
                AM
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                Alex Morgan
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Administrator</p>
            </div>
            <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 dark:border-slate-700">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Plan</span>
                <span className="font-medium text-slate-900 dark:text-white">Enterprise</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Team Members</span>
                <span className="font-medium text-slate-900 dark:text-white">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Storage</span>
                <span className="font-medium text-slate-900 dark:text-white">45.2 GB</span>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-900 dark:bg-slate-800">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
              Danger Zone
            </h3>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              Irreversible actions
            </p>
            <button className="w-full rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-950/30">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
