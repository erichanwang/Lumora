"use client";

import { Lightbulb } from "lucide-react";
import type { ReactNode } from "react";

interface AuthGradientProps {
  children: ReactNode;
}

export function AuthGradient({ children }: AuthGradientProps) {
  return (
    <div className="hidden flex-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-12 lg:flex lg:flex-col lg:justify-between">
      <div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
          <Lightbulb className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className="max-w-md">
        {children}
      </div>
    </div>
  );
}
