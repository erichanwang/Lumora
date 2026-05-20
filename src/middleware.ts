import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const publicPaths = ["/", "/login", "/register"];

  // Allow public pages without auth check
  if (publicPaths.includes(pathname) || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // For all other routes, NextAuth handles the redirect
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
