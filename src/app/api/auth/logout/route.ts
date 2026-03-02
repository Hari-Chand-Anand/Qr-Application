import { NextResponse } from "next/server";
import { getAdminCookieName } from "@/lib/auth";


export const runtime = "nodejs";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const res = NextResponse.redirect(new URL("/admin/login", url.origin));

  res.cookies.set(getAdminCookieName(), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}
