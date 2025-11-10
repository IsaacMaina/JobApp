import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // This function will be called if the user is authenticated.
    // You can add custom logic here if needed, for example, role-based access control.

    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      req.nextauth.token?.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Example: Redirect authenticated users from login/register to dashboard
    if (req.nextUrl.pathname.startsWith("/auth/login") || req.nextUrl.pathname.startsWith("/auth/register")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // If there is a token, the user is authenticated.
        // This callback determines if the user is authorized to access the route.
        return !!token;
      },
    },
    pages: {
      signIn: "/landing", // Redirect unauthenticated users to this page
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|landing|auth/login|auth/register).*)",
  ],
};
