import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Check admin routes
    if (pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/edit")) {
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/login", req.url))
      }
    }

    // Allow all authenticated users to access their profile and borrow pages
    if (pathname.startsWith("/profile") || pathname.startsWith("/borrows")) {
      return NextResponse.next()
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/profile/:path*",
    "/borrows/:path*"
  ]
}
