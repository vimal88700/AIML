import { SignJWT, jwtVerify } from "jose";
import { parse } from "cookie";

export const ADMIN_COOKIE_NAME = "cybercore-admin-session";
const secret = () => new TextEncoder().encode(process.env.JWT_SECRET || "change-this-jwt-secret");

export async function createAdminToken() {
  return new SignJWT({ role: "admin", name: "Owner" }).setProtectedHeader({ alg: "HS256" }).setSubject("admin").setIssuedAt().setExpirationTime("30d").sign(secret());
}

export async function isAdminRequest(req: { headers: { cookie?: string } }) {
  const value = req.headers.cookie ? parse(req.headers.cookie)[ADMIN_COOKIE_NAME] : undefined;
  if (!value) return false;
  try { const verified = await jwtVerify(value, secret()); return verified.payload.sub === "admin" && verified.payload.role === "admin"; } catch { return false; }
}

export function passwordsMatch(provided: string) {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured || !provided) return false;
  return provided === configured;
}
