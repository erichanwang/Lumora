import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "@/lib/theme-context";
import { ToastProvider } from "@/lib/toast-context";
import { AuthProvider } from "@/lib/auth-provider";
import { SWRProvider } from "@/lib/swr-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lumora — Business Dashboard",
    template: "%s | Lumora",
  },
  description:
    "Modern SaaS dashboard for monitoring your business performance, analytics, and growth.",
  keywords: ["dashboard", "analytics", "saas", "business", "lumora"],
  authors: [{ name: "Lumora" }],
  openGraph: {
    title: "Lumora — Business Dashboard",
    description:
      "Modern SaaS dashboard for monitoring your business performance, analytics, and growth.",
    type: "website",
    locale: "en_US",
    siteName: "Lumora",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumora — Business Dashboard",
    description:
      "Modern SaaS dashboard for monitoring your business performance, analytics, and growth.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lumora",
  },
  formatDetection: {
    telephone: false,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('lumora-theme');
                  var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (t === 'dark' || (t === 'system' && isDark) || (!t && isDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <AuthProvider>
              <ToastProvider>
                <SWRProvider>{children}</SWRProvider>
              </ToastProvider>
            </AuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
