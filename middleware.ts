import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname
    const role = token?.role as string

    // Route-level access control
    const protectedRoutes: Record<string, string[]> = {
      "/finance": ["SUPER_ADMIN", "ACCOUNTANT"],
      "/media-buying": ["SUPER_ADMIN", "MEDIA_BUYER", "ACCOUNT_MANAGER"],
      "/sales": ["SUPER_ADMIN", "SALES", "ACCOUNT_MANAGER"],
      "/hr": ["SUPER_ADMIN"],
    }

    for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
      if (path.startsWith(route) && !allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ token }) {
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/clients/:path*",
    "/media-buying/:path*",
    "/creative/:path*",
    "/sales/:path*",
    "/finance/:path*",
    "/calendar/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/hr/:path*",
    "/notifications/:path*",
  ],
}
