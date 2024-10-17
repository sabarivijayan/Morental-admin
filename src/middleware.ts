// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define the protected paths
const protectedPaths = [
  "/add-cars",
  "/add-location",
  "/add-manufacturer",
  "/add-rentable-cars",
  "/booked-cars",
  "/edit-car",
  "/list-cars",
  "/list-manufacturers",
  "/list-rentable-cars",
  "/dashboard",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("adminToken")?.value; // Assuming the token is stored in a cookie

  // If user is not authenticated and trying to access a protected page
  if (protectedPaths.some((path) => pathname.startsWith(path)) && !token) {
    // Redirect to the login page
    const loginUrl = new URL("/", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // If the user is already authenticated and tries to access the login page, redirect them to the dashboard
  if (pathname === "/" && token) {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Allow the request to continue if no conditions are met
  return NextResponse.next();
}
// middleware.ts
export const config = {
  matcher: [
    "/add-cars",
    "/add-location",
    "/add-manufacturer",
    "/add-rentable-cars",
    "/booked-cars",
    "/edit-car",
    "/list-cars",
    "/list-manufacturers",
    "/list-rentable-cars",
    "/",
    "/dashboard",
  ],
};
