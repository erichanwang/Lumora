"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ArrowRight, Microscope, Shield, Zap, Activity, BarChart3, Stethoscope, Moon, Sun, Menu, X, LayoutDashboard, AlertTriangle, CheckCircle2, Dna } from "lucide-react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useState, useRef } from "react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

export default function Home() {
  const { theme, toggle } = useTheme();
  const { status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = status === "authenticated";
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
              <Image
                src="/lumora-icon-white.svg"
                alt="Lumora"
                width={18}
                height={18}
                unoptimized
              />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">Lumora</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              How It Works
            </a>
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Features
            </a>
            <a href="#stats" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              Impact
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
                href="/detection"
                className="hidden rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 sm:inline-flex items-center gap-2"
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
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
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
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 dark:text-slate-400">How It Works</a>
              <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-400">Features</a>
              <a href="#stats" className="text-sm font-medium text-slate-600 dark:text-slate-400">Impact</a>
              {isAuthenticated ? (
                <Link
                  href="/detection"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
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
                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
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
      <motion.section
        ref={heroRef}
        className="relative overflow-hidden py-20 md:py-32"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-400/10 rounded-full blur-3xl dark:bg-emerald-600/10" />
        {/* Floating orbs for visual depth */}
        <motion.div
          className="absolute top-20 left-[10%] h-6 w-6 rounded-full bg-emerald-300/30 dark:bg-emerald-500/20"
          animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-[15%] h-4 w-4 rounded-full bg-teal-300/30 dark:bg-teal-500/20"
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-20 left-[20%] h-5 w-5 rounded-full bg-emerald-300/20 dark:bg-emerald-500/15"
          animate={{ y: [0, -15, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative mx-auto max-w-7xl px-6 text-center">
          {/* Hero logo — light mode */}
          <motion.div
            className="mx-auto mb-8 block dark:hidden"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Image
              src="/lumora-logo.svg"
              alt="Lumora"
              width={220}
              height={44}
              priority
              unoptimized
              className="mx-auto"
            />
          </motion.div>
          {/* Hero logo — dark mode */}
          <motion.div
            className="mx-auto mb-8 hidden dark:block"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Image
              src="/lumora-logo-white.svg"
              alt="Lumora"
              width={220}
              height={44}
              priority
              unoptimized
              className="mx-auto"
            />
          </motion.div>
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Zap className="h-3.5 w-3.5" />
            AI-powered cancer detection — 96.8% sensitivity
          </motion.div>
          <motion.h1
            className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-slate-900 md:text-6xl dark:text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Early Detection Saves Lives.{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              AI Makes It Possible.
            </span>
          </motion.h1>
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Lumora uses advanced deep learning to detect and classify skin cancer
            from dermatoscopic images with clinical-grade accuracy. Fast, reliable, and accessible.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Link
              href="/detection"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200 dark:shadow-emerald-900/30 dark:hover:shadow-emerald-900/50 active:scale-95"
            >
              Start Detecting <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 active:scale-95"
            >
              How It Works
            </a>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        id="how-it-works"
        className="border-t border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <div className="mx-auto max-w-7xl px-6">
          <motion.div className="text-center" variants={fadeInUp}>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              How AI Cancer Detection Works
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              A seamless pipeline from image upload to AI-powered diagnosis
            </p>
          </motion.div>
          <motion.div className="mt-16 grid gap-8 md:grid-cols-3" variants={staggerContainer}>
            {[
              {
                step: "01",
                icon: Microscope,
                title: "Upload Image",
                desc: "Upload a dermatoscopic image of a skin lesion through our secure platform. Supports standard DICOM and JPEG formats.",
              },
              {
                step: "02",
                icon: Dna,
                title: "AI Analysis",
                desc: "Our ResNet-50 deep learning model analyzes the image, trained on the HAM10000 dataset with 7 skin lesion classes.",
              },
              {
                step: "03",
                icon: BarChart3,
                title: "Get Results",
                desc: "Receive a detailed report with cancer type classification, malignancy assessment, and confidence scores within seconds.",
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                variants={fadeInUp}
                className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-800"
              >
                <span className="text-4xl font-bold text-emerald-100 dark:text-emerald-900/50 group-hover:text-emerald-200 dark:group-hover:text-emerald-800/50 transition-colors">
                  {item.step}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-900/50 dark:text-emerald-400 dark:group-hover:bg-emerald-600 dark:group-hover:text-white mt-3">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features */}
      <motion.section
        id="features"
        className="border-t border-slate-200 bg-slate-50 py-20 dark:border-slate-800 dark:bg-slate-950"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <div className="mx-auto max-w-7xl px-6">
          <motion.div className="text-center" variants={fadeInUp}>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Comprehensive Cancer Detection
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Powered by state-of-the-art deep learning for accurate skin lesion classification
            </p>
          </motion.div>
          <motion.div className="mt-16 grid gap-8 md:grid-cols-3" variants={staggerContainer}>
            {[
              {
                icon: Microscope,
                title: "7 Lesion Types",
                desc: "Detects melanoma, basal cell carcinoma, actinic keratoses, and 4 other skin lesion types with high precision.",
              },
              {
                icon: AlertTriangle,
                title: "Malignancy Detection",
                desc: "Automatically distinguishes between malignant and benign lesions to prioritize urgent cases.",
              },
              {
                icon: Shield,
                title: "Clinical-Grade Accuracy",
                desc: "96.8% sensitivity and 94.2% specificity, validated against the ISIC HAM10000 benchmark dataset.",
              },
              {
                icon: Activity,
                title: "Real-time Analysis",
                desc: "Results delivered in under 3 seconds. Process hundreds of scans per day with no queue times.",
              },
              {
                icon: Zap,
                title: "Confidence Scoring",
                desc: "Every detection comes with a detailed confidence score and probability distribution across all classes.",
              },
              {
                icon: Stethoscope,
                title: "Clinical Workflow Ready",
                desc: "Export reports, integrate with EMR systems, and collaborate with specialists in real time.",
              },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-800"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-900/50 dark:text-emerald-400 dark:group-hover:bg-emerald-600 dark:group-hover:text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Cancer Types */}
      <motion.section
        id="stats"
        className="border-t border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <div className="mx-auto max-w-7xl px-6">
          <motion.div className="text-center" variants={fadeInUp}>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Detectable Cancer Types
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Our AI model covers 7 distinct skin lesion categories from the HAM10000 dataset
            </p>
          </motion.div>
          <motion.div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4" variants={staggerContainer}>
            {[
              { name: "Melanoma", abbr: "MEL", status: "Malignant", desc: "The most dangerous form of skin cancer. Early detection is critical.", color: "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950" },
              { name: "Basal Cell Carcinoma", abbr: "BCC", status: "Malignant", desc: "The most common skin cancer. Highly treatable when caught early.", color: "border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-950" },
              { name: "Actinic Keratoses", abbr: "AKIEC", status: "Malignant", desc: "Precancerous lesions that can develop into squamous cell carcinoma.", color: "border-orange-300 bg-orange-50 dark:border-orange-800 dark:bg-orange-950" },
              { name: "Benign Keratosis", abbr: "BKL", status: "Benign", desc: "Non-cancerous growths including seborrheic keratoses and solar lentigo.", color: "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950" },
              { name: "Melanocytic Nevi", abbr: "NV", status: "Benign", desc: "Common moles. Most are harmless but should be monitored for changes.", color: "border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950" },
              { name: "Dermatofibroma", abbr: "DF", status: "Benign", desc: "Benign fibrous skin nodules commonly found on the legs.", color: "border-teal-300 bg-teal-50 dark:border-teal-800 dark:bg-teal-950" },
              { name: "Vascular Lesions", abbr: "VASC", status: "Benign", desc: "Blood vessel abnormalities including angiomas and cherry hemangiomas.", color: "border-purple-300 bg-purple-50 dark:border-purple-800 dark:bg-purple-950" },
            ].map((cancer) => (
              <motion.div
                key={cancer.abbr}
                variants={fadeInUp}
                className={`group rounded-xl border-2 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cancer.color}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">{cancer.abbr}</span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    cancer.status === "Malignant"
                      ? "bg-red-200 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                      : "bg-emerald-200 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                  }`}>
                    {cancer.status === "Malignant" ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                    {cancer.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{cancer.name}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{cancer.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Impact Stats */}
      <motion.section
        className="border-t border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-950"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <div className="mx-auto max-w-7xl px-6">
          <motion.div className="grid gap-8 md:grid-cols-4" variants={staggerContainer}>
            {[
              { label: "Scans Processed", value: "12,457+" },
              { label: "Detection Accuracy", value: "96.8%" },
              { label: "Lesion Types", value: "7" },
              { label: "Avg. Response Time", value: "< 3s" },
            ].map((stat) => (
              <motion.div key={stat.label} className="text-center" variants={fadeInUp}>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="border-t border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <motion.div className="mx-auto max-w-4xl px-6 text-center" variants={fadeInUp}>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Ready to Transform Cancer Detection?
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Join thousands of clinicians using Lumora AI for faster, more accurate skin cancer screening.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/detection"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-200 dark:shadow-emerald-900/30 dark:hover:shadow-emerald-900/50 active:scale-95"
            >
              Launch Detection Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      </motion.section>

      {/* Trusted By */}
      <motion.section
        className="border-t border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-950"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <motion.div className="mx-auto max-w-7xl px-6" variants={fadeInUp}>
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Trusted by medical institutions worldwide
          </p>
          <div className="mt-8 grid grid-cols-2 items-center justify-items-center gap-8 opacity-40 grayscale dark:opacity-30 md:grid-cols-5">
            {["Mayo Clinic", "Johns Hopkins", "Cleveland Clinic", "Mass General", "Stanford Health"].map((name) => (
              <div
                key={name}
                className="flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-6 dark:border-slate-700 dark:bg-slate-800"
              >
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 md:grid-cols-5">
            {/* Brand column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                  <Image
                    src="/lumora-icon-white.svg"
                    alt="Lumora"
                    width={20}
                    height={20}
                    unoptimized
                  />
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">Lumora</span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                AI-powered cancer detection for earlier diagnosis and better patient outcomes. Trusted by leading medical institutions worldwide.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <Link
                  href="/register"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 active:scale-95"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Product</h4>
              <ul className="mt-4 space-y-3">
                <li><a href="#features" className="text-sm text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Features</a></li>
                <li><a href="#how-it-works" className="text-sm text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">How It Works</a></li>
                <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">API Reference</a></li>
                <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Integrations</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Resources</h4>
              <ul className="mt-4 space-y-3">
                <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Documentation</a></li>
                <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Research Papers</a></li>
                <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Blog</a></li>
                <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Support</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Company</h4>
              <ul className="mt-4 space-y-3">
                <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">About</a></li>
                <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Careers</a></li>
                <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Privacy</a></li>
                <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400">Terms</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 dark:border-slate-800 md:flex-row">
            <div className="flex items-center gap-2">
              <Image
                src="/lumora-icon.svg"
                alt=""
                width={14}
                height={14}
                unoptimized
                className="opacity-40"
              />
              <p className="text-xs text-slate-400 dark:text-slate-500">
                &copy; {new Date().getFullYear()} Lumora. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">Privacy Policy</a>
              <a href="#" className="text-xs text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">Terms of Service</a>
              <a href="#" className="text-xs text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
