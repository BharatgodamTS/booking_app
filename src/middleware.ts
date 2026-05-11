import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role as string;

    console.log(`🛡️ [SAFE-MODE] Path: ${path} | Role: ${role || 'NONE'}`);

    // 1. Prevent Redirect Loops (If already on destination, stop)
    if (path === "/unauthorized") return NextResponse.next();

    // 2. Handle Root Redirects
    if (path === "/") {
      if (role === "ADMIN") {
        console.log("➡️ [REDIRECT] Admin -> /admin/users");
        return NextResponse.redirect(new URL("/admin/users", req.url));
      }
      if (role === "OWNER" || role === "WAREHOUSE_OWNER") {
        console.log("➡️ [REDIRECT] Owner -> /dashboard/warehouse/dashboard");
        return NextResponse.redirect(new URL("/dashboard/warehouse/dashboard", req.url));
      }
      if (role === "CLIENT") {
        console.log("➡️ [REDIRECT] Client -> /dashboard/client", req.url);
        return NextResponse.redirect(new URL("/dashboard/client", req.url));
      }
      console.log("➡️ [REDIRECT] Unknown Role -> /unauthorized");
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // 3. Strict Route Guarding
    if (path.startsWith("/admin") && role !== "ADMIN") {
      console.warn("🚫 [DENIED] Non-Admin access to /admin");
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (path.startsWith("/dashboard/warehouse") && role !== "OWNER" && role !== "WAREHOUSE_OWNER") {
      console.warn(`🚫 [DENIED] Access to /dashboard/warehouse for role: ${role}`);
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        const publicPaths = ["/auth/signin", "/auth/signup", "/unauthorized", "/api/auth"];
        if (publicPaths.some(p => path === p || path.startsWith("/api/auth"))) return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
