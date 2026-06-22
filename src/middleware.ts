import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefixes = [
  "/home",
  "/vocational-test",
  "/labor-market",
  "/career-plan",
  "/profile",
];
// Pages a logged-in user should not see (landing + auth flow).
const publicOnlyPages = ["/login", "/register", "/forgot-password"];

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const isAuthenticated = !!token;
  const { pathname } = req.nextUrl;

  const isProtected = protectedPrefixes.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  const isLanding = pathname === "/";
  const isPublicOnly =
    isLanding ||
    publicOnlyPages.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );

  // Not logged in trying to reach a protected page → send to the landing page.
  if (isProtected && !isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Already logged in trying to reach the landing or an auth page → send home.
  if (isPublicOnly && isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/home";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home",
    "/home/:path*",
    "/vocational-test",
    "/vocational-test/:path*",
    "/labor-market",
    "/labor-market/:path*",
    "/career-plan",
    "/career-plan/:path*",
    "/profile",
    "/profile/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
