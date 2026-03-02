import { SignJWT, jwtVerify } from "jose";

const cookieName = "qr_admin";
const encoder = new TextEncoder();

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET missing");
  return encoder.encode(secret);
}

export function getAdminCookieName() {
  return cookieName;
}

export async function createSessionToken() {
  const secret = getSecret();
  return await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  const secret = getSecret();
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

export function verifyAdminCredentials(user: string, pass: string) {
  const u = process.env.ADMIN_USER ?? "";
  const p = process.env.ADMIN_PASS ?? "";
  return user === u && pass === p;
}
