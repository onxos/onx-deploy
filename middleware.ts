import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/pulse", "/registry", "/gaps", "/admin"];
const adminRoutes = ["/registry", "/gaps", "/admin"];

function isRoute(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isRoute(pathname, protectedRoutes)) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isRoute(pathname, adminRoutes)) {
    // Full role verification happens in server components/tRPC after the
    // session is loaded. Middleware keeps unauthenticated users out early.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/pulse/:path*",
    "/registry/:path*",
    "/gaps/:path*",
    "/admin/:path*",
  ],
};
