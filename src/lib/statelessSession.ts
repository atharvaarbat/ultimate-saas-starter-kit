// lib/auth.ts
import "server-only";
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Extend the JWTPayload interface to include our custom fields
interface SessionPayload extends JWTPayload {
  userId: string;
  expires: number;
}

// Cookie configuration type
interface CookieConfig {
  name: string;
  options: {
    httpOnly: boolean;
    sameSite: "lax" | "strict" | "none";
    secure: boolean;
    path: string;
  };
  duration: number;
}

// Ensure JWT_SECRET_KEY is defined
const secret = process.env.JWT_SECRET_KEY;
if (!secret) {
  throw new Error("JWT_SECRET_KEY must be defined in the environment");
}

// Convert secret to a key
const key = new TextEncoder().encode(secret);

// Cookie configuration
const cookie: CookieConfig = {
  name: "session",
  options: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  },
  duration: 24 * 60 * 60 * 1000, // 24 hours
};

export async function encrypt(payload: { userId: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(key);
}

export async function decrypt(
  session?: string
): Promise<SessionPayload | null> {
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, key);
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: string): Promise<void> {
  const expires = new Date(Date.now() + cookie.duration);
  const session = await encrypt({ userId });

  (await cookies()).set(cookie.name, session, {
    ...cookie.options,
    expires,
  });
  // redirect("/dashboard");
}

export async function verifySession(): Promise<{ userId: string }> {
  const sessionCookie = (await cookies()).get(cookie.name)?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/login");
  }

  return { userId: session.userId };
}

export async function deleteSession(): Promise<void> {
  (await cookies()).delete(cookie.name);
  redirect("/login");
}

export async function getSession(): Promise<string | null> {
  const sessionCookie = (await cookies()).get(cookie.name)?.value;
  const session = await decrypt(sessionCookie);

  return session?.userId ?? null;
}
