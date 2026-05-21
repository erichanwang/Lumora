"use client";

import Image from "next/image";
import type { ReactNode } from "react";

interface AuthGradientProps {
  children: ReactNode;
}

export function AuthGradient({ children }: AuthGradientProps) {
  return (
    <div className="hidden flex-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-12 lg:flex lg:flex-col lg:justify-between relative overflow-hidden">
      {/* Background watermark logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none">
        <Image
          src="/lumora-logo-white.svg"
          alt=""
          width={400}
          height={80}
          unoptimized
        />
      </div>
      <div className="relative">
        <Image
          src="/lumora-logo-white.svg"
          alt="Lumora"
          width={140}
          height={28}
          priority
          unoptimized
        />
      </div>
      <div className="relative max-w-md">
        {children}
      </div>
    </div>
  );
}
