import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const blockedRoutes = ["/", "/setup"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (blockedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/usage", request.url));
  }

  if (pathname.startsWith("/dashboard")) {
    const sessionToken = request.cookies.get("better-auth.session_token");
    if (!sessionToken) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/setup", "/dashboard/:path*"],
};
