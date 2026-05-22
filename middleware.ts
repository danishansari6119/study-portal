// middleware.ts
// Protects routes based on authentication state and user role

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require auth
const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/register", "/auth/error"];

// Admin-only routes
const ADMIN_ROUTES = ["/dashboard/admin"];

export default auth(function middleware(req: NextRequest & { auth: any }) {
  const { nextUrl, auth: session } = req as any;
  const isLoggedIn = !!session;
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => nextUrl.pathname === route || nextUrl.pathname.startsWith("/auth")
  );

  // Redirect unauthenticated users to login
  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/auth/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && isPublicRoute && nextUrl.pathname !== "/") {
    const role = session?.user?.role;
    const dashboardPath =
      role === "ADMIN" || role === "SUPER_ADMIN"
        ? "/dashboard/admin"
        : "/dashboard/student";
    return NextResponse.redirect(new URL(dashboardPath, nextUrl.origin));
  }

  // Block students from admin routes
  if (
    isLoggedIn &&
    ADMIN_ROUTES.some((r) => nextUrl.pathname.startsWith(r)) &&
    session?.user?.role === "STUDENT"
  ) {
    return NextResponse.redirect(new URL("/dashboard/student", nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  // Apply middleware to all routes except static files and API auth
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)"],
};
