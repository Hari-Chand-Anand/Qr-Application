import { NextResponse } from "next/server";
import {
  createSessionToken,
  getAdminCookieName,
  verifyAdminCredentials,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();
  const username = String(form.get("username") ?? "");
  const password = String(form.get("password") ?? "");

  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const token = await createSessionToken();

  const res = NextResponse.json({ ok: true });
  res.cookies.set(getAdminCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
