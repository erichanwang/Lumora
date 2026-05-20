"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lightbulb, ArrowRight, Loader2, Check, Shield, AlertTriangle, Key, Eye, EyeOff } from "lucide-react";
import { registerSchema } from "@/lib/validations";
import type { RegisterInput } from "@/lib/validations";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const input: RegisterInput = { name, email, password, confirmPassword };
    const result = registerSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    setTimeout(async () => {
      setLoading(false);
      setSuccess(true);
      setTimeout(async () => {
        await signIn("credentials", {
          email: "alex@lumora.io",
          password: "demo1234",
          redirect: true,
          callbackUrl: "/",
        });
      }, 1000);
    }, 800);
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
            <Check className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">Account created!</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Redirecting you to the dashboard...</p>
          <Loader2 className="mx-auto mt-4 h-5 w-5 animate-spin text-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-10">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">Lumora</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create account</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Start your free trial — no credit card needed
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => { setName(e.target.value); clearFieldError("name"); }}
                placeholder="Alex Morgan"
                className={cn(
                  "mt-1 block w-full rounded-lg border bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:ring-2 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500",
                  errors.name
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-700 dark:focus:border-red-500 dark:focus:ring-red-900/30"
                    : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100 dark:border-slate-600 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
                )}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                placeholder="you@company.com"
                className={cn(
                  "mt-1 block w-full rounded-lg border bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:ring-2 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500",
                  errors.email
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-700 dark:focus:border-red-500 dark:focus:ring-red-900/30"
                    : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100 dark:border-slate-600 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
                )}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
                  placeholder="At least 6 characters"
                  className={cn(
                    "block w-full rounded-lg border bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:ring-2 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500",
                    errors.password
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-700 dark:focus:border-red-500 dark:focus:ring-red-900/30"
                      : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100 dark:border-slate-600 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.password}</p>}
              {/* Password strength indicator */}
              {password.length > 0 && !errors.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    {(() => {
                      const hasLower = /[a-z]/.test(password);
                      const hasUpper = /[A-Z]/.test(password);
                      const hasNumber = /[0-9]/.test(password);
                      const hasSpecial = /[^a-zA-Z0-9]/.test(password);
                      const score = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
                      const bars = [
                        { filled: hasLower || hasUpper, color: "bg-red-500" },
                        { filled: hasNumber, color: "bg-amber-500" },
                        { filled: hasSpecial || (hasUpper && hasNumber), color: "bg-yellow-500" },
                        { filled: score >= 3 && password.length >= 8, color: "bg-emerald-500" },
                      ];
                      const labels = ["Weak", "Fair", "Good", "Strong"];
                      const label = score <= 1 ? labels[0] : score === 2 ? labels[1] : score === 3 ? labels[2] : labels[3];
                      const colors = ["text-red-500", "text-amber-500", "text-yellow-500", "text-emerald-500"];
                      const colorIdx = score <= 1 ? 0 : score === 2 ? 1 : score === 3 ? 2 : 3;
                      return (
                        <>
                          <div className="flex gap-1 flex-1">
                            {bars.map((bar, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "h-1.5 flex-1 rounded-full transition-colors",
                                  bar.filled ? bar.color : "bg-slate-200 dark:bg-slate-700"
                                )}
                              />
                            ))}
                          </div>
                          <span className={cn("text-xs font-medium", colors[colorIdx])}>{label}</span>
                        </>
                      );
                    })()}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <span className={cn("flex items-center gap-1", /[a-z]/.test(password) ? "text-emerald-600" : "text-slate-400")}>
                      <Key className="h-3 w-3" /> lowercase
                    </span>
                    <span className={cn("flex items-center gap-1", /[A-Z]/.test(password) ? "text-emerald-600" : "text-slate-400")}>
                      <Key className="h-3 w-3" /> uppercase
                    </span>
                    <span className={cn("flex items-center gap-1", /[0-9]/.test(password) ? "text-emerald-600" : "text-slate-400")}>
                      <Shield className="h-3 w-3" /> number
                    </span>
                    <span className={cn("flex items-center gap-1", /[^a-zA-Z0-9]/.test(password) ? "text-emerald-600" : "text-slate-400")}>
                      <AlertTriangle className="h-3 w-3" /> special
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
              <div className="relative mt-1">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError("confirmPassword"); }}
                  placeholder="Confirm your password"
                  className={cn(
                    "block w-full rounded-lg border bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:ring-2 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500",
                    errors.confirmPassword
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-700 dark:focus:border-red-500 dark:focus:ring-red-900/30"
                      : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100 dark:border-slate-600 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Create account <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden flex-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-12 lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="max-w-md space-y-6">
          {[
            { title: "Beautiful dashboards", desc: "Real-time visualizations of your business metrics" },
            { title: "Team collaboration", desc: "Share reports and insights with your whole team" },
            { title: "Enterprise security", desc: "SOC 2 compliant with end-to-end encryption" },
          ].map((feature) => (
            <div key={feature.title} className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{feature.title}</p>
                <p className="text-xs text-indigo-200">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
