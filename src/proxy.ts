import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role as string;

    console.log(`🛡️ [SAFE-MODE] Path: ${path} | Role: ${role || 'NONE'}`);

    // 1. Prevent Redirect Loops
    if (path === "/unauthorized") return NextResponse.next();

    // 2. Handle Root Redirects
    if (path === "/") {
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/users", req.url));
      }
      if (role === "OWNER" || role === "WAREHOUSE_OWNER") {
        return NextResponse.redirect(new URL("/dashboard/warehouse", req.url));
      }
      if (role === "CLIENT") {
        return NextResponse.redirect(new URL("/dashboard/client", req.url));
      }
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // 3. Strict Route Guarding
    if (path.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (path.startsWith("/dashboard/warehouse") && role !== "OWNER" && role !== "WAREHOUSE_OWNER") {
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
