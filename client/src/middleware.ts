import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const blockedRoutes = ["/", "/setup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (blockedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/usage", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/setup"],
};
