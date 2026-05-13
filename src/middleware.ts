import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role as string;

    // 1. ADMIN PROTECTION
    if (path.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // 2. OWNER PROTECTION
    if (path.startsWith("/dashboard/warehouse") && (role !== "OWNER" && role !== "WAREHOUSE_OWNER")) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // 3. CLIENT PROTECTION
    if (path.startsWith("/dashboard/client") && role !== "CLIENT") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
  ],
};
