import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefixes = [
  "/home",
  "/vocational-test",
  "/labor-market",
  "/career-plan",
];
const authPages = ["/login", "/register", "/forgot-password"];

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
  const isAuthPage = authPages.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Not logged in trying to reach a protected page → send to login.
  if (isProtected && !isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Already logged in trying to reach an auth page → send to home.
  if (isAuthPage && isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/home";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home",
    "/home/:path*",
    "/vocational-test",
    "/vocational-test/:path*",
    "/labor-market",
    "/labor-market/:path*",
    "/career-plan",
    "/career-plan/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
