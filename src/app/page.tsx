"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { useSession, signOut } from "next-auth/react";
import { ArrowRight, BarChart3, Lightbulb, Shield, Zap, Users, Layers, Moon, Sun, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { theme, toggle } = useTheme();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = status === "authenticated";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">Lumora</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Features
            </a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Pricing
            </a>
            <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Testimonials
            </a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {isAuthenticated ? (
              <Link
                href="/analytics"
                className="hidden rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 sm:inline-flex items-center gap-2"
              >
                <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
              </Link>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  Get Started
                </Link>
              </div>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-slate-600 dark:text-slate-400 md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950 md:hidden">
            <div className="flex flex-col gap-3">
              <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-400">Features</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 dark:text-slate-400">Pricing</a>
              <a href="#testimonials" className="text-sm font-medium text-slate-600 dark:text-slate-400">Testimonials</a>
              {isAuthenticated ? (
                <Link
                  href="/analytics"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="mt-2 block text-sm font-medium text-slate-600 dark:text-slate-400"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-400/10 rounded-full blur-3xl dark:bg-indigo-600/10" />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
            <Zap className="h-3.5 w-3.5" />
            New: AI-powered insights now available
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-slate-900 md:text-6xl dark:text-white">
            Illuminate Your{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Business Performance
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Lumora brings clarity to your data with beautiful dashboards, real-time analytics,
            and actionable insights. Make informed decisions faster.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/analytics"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 dark:shadow-indigo-900/30 dark:hover:shadow-indigo-900/50"
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              View Features
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Everything You Need
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Powerful features to help you understand and grow your business
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                desc: "Comprehensive dashboards with real-time data visualization and custom reporting.",
              },
              {
                icon: Users,
                title: "User Management",
                desc: "Manage team members, roles, and permissions with granular control.",
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                desc: "Bank-grade encryption, SSO, and compliance certifications included.",
              },
              {
                icon: Layers,
                title: "Custom Reports",
                desc: "Build and schedule custom reports with drag-and-drop simplicity.",
              },
              {
                icon: Zap,
                title: "Real-time Updates",
                desc: "Live data synchronization across all your devices and team members.",
              },
              {
                icon: Lightbulb,
                title: "AI Insights",
                desc: "Smart alerts and predictive analytics powered by machine learning.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-800"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-900/50 dark:text-indigo-400 dark:group-hover:bg-indigo-600 dark:group-hover:text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Choose the plan that fits your needs. Upgrade anytime.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Free",
                price: "$0",
                period: "/month",
                desc: "Perfect for individuals getting started",
                features: ["Basic dashboard", "3 team members", "7-day data history", "Email support"],
                cta: "Get Started",
                highlighted: false,
              },
              {
                name: "Pro",
                price: "$29",
                period: "/month",
                desc: "Best for growing teams and businesses",
                features: ["Advanced analytics", "Unlimited team members", "90-day data history", "Priority support", "Custom reports", "API access"],
                cta: "Start Free Trial",
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "$99",
                period: "/month",
                desc: "For large organizations with advanced needs",
                features: ["Everything in Pro", "Unlimited data history", "SSO & SSO", "Dedicated support", "Custom integrations", "SLA guarantee", "Audit logs", "Team training"],
                cta: "Contact Sales",
                highlighted: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border-2 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  plan.highlighted
                    ? "border-indigo-500 bg-white shadow-lg shadow-indigo-100 dark:bg-slate-800 dark:shadow-indigo-900/20"
                    : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-1 text-xs font-semibold text-white shadow-md">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{plan.desc}</p>
                </div>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <svg className="h-4 w-4 shrink-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {plan.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="border-t border-slate-200 bg-slate-50 py-20 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Trusted by Industry Leaders
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              See what our customers have to say about Lumora
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                quote: "Lumora completely transformed our analytics workflow. We went from spending hours on reports to getting instant insights.",
                name: "Alex Morgan",
                role: "CTO, TechVentures",
                initials: "AM",
              },
              {
                quote: "The real-time dashboard is incredible. We caught a critical issue before it affected our customers thanks to Lumora.",
                name: "Sarah Chen",
                role: "Engineering Lead, DataFlow",
                initials: "SC",
              },
              {
                quote: "We evaluated 8 analytics platforms and Lumora won on every metric. The AI insights feature is a game-changer.",
                name: "Michael Kim",
                role: "VP Product, CloudScale",
                initials: "MK",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <svg className="h-6 w-6 text-indigo-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
                </svg>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { label: "Active Users", value: "10,000+" },
              { label: "Revenue Tracked", value: "$2.4B+" },
              { label: "Data Points", value: "1.2M+" },
              { label: "Uptime SLA", value: "99.99%" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Ready to Illuminate Your Business?
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Start making data-driven decisions today. No credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/analytics"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 dark:shadow-indigo-900/30"
            >
              Launch Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-8 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Lumora
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500">
            &copy; {new Date().getFullYear()} Lumora. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              Privacy
            </a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              Terms
            </a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
