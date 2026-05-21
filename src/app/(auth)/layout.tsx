import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      {/* Subtle background brand watermark */}
      <div className="pointer-events-none fixed bottom-6 left-6 z-0 flex items-center gap-1.5 opacity-[0.04] dark:opacity-[0.03]">
        <Image
          src="/lumora-icon.svg"
          alt=""
          width={120}
          height={120}
          className="dark:hidden"
          unoptimized
        />
        <Image
          src="/lumora-icon-white.svg"
          alt=""
          width={120}
          height={120}
          className="hidden dark:block"
          unoptimized
        />
      </div>
      {children}
    </div>
  );
}
