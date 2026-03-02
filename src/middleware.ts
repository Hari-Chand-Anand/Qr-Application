import { NextResponse, type NextRequest } from "next/server";
import { getAdminCookieName, verifySessionToken } from "./lib/auth";

const ADMIN_PREFIX = "/admin";
const LOGIN_PATH = "/admin/login";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith(ADMIN_PREFIX)) return NextResponse.next();
  if (pathname === LOGIN_PATH) return NextResponse.next();

  const token = req.cookies.get(getAdminCookieName())?.value;
  if (!token) return NextResponse.redirect(new URL(LOGIN_PATH, req.url));

  try {
    await verifySessionToken(token);
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL(LOGIN_PATH, req.url));
    res.cookies.set(getAdminCookieName(), "", { maxAge: 0, path: "/" });
    return res;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
