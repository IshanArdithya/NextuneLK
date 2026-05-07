import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const blockedRoutes = ["/"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (blockedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/usage", request.url));
  }

  const secretPath = process.env.NEXT_PUBLIC_ADMIN_URI_PATH || "admin";
  const pathSegments = pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0];

  // block fake admin paths
  if (firstSegment && firstSegment !== secretPath && firstSegment !== "usage") {
    if (pathSegments[1] === "admin") {
      return NextResponse.redirect(new URL("/usage", request.url));
    }
  }

  // secret uri protection
  if (pathname.startsWith(`/${secretPath}/admin`)) {
    const sessionToken = request.cookies.get("better-auth.session_token") || 
                         request.cookies.get("__Secure-better-auth.session_token");

    // login redirect
    if (pathname === `/${secretPath}/admin/login` || pathname === `/${secretPath}/login`) {
      // already authed
      if (sessionToken) {
        return NextResponse.redirect(new URL(`/${secretPath}/admin`, request.url));
      }
      return NextResponse.next();
    }

    // protect admin pages
    if (!sessionToken) {
      const url = request.nextUrl.clone();
      url.pathname = `/${secretPath}/admin/login`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/setup", "/:path*"],
};
