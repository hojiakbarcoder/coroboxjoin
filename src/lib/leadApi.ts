import { ConvexHttpClient } from "convex/browser";
import { ConvexError } from "convex/values";
import { createHash } from "node:crypto";

/**
 * Server-side helpers for the contact form API routes. The routes are the
 * only callers of the Convex lead/upload functions: they attach the client's
 * IP (hashed, so raw IPs are never stored) and the shared LEAD_API_SECRET.
 */

export function getServerConfig() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  const secret = process.env.LEAD_API_SECRET;
  if (!url || !secret) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL and LEAD_API_SECRET must be set.");
  }
  return { client: new ConvexHttpClient(url), secret };
}

/**
 * On Vercel, x-forwarded-for is set by the platform (client-supplied values
 * are overwritten), and its first entry is the client IP.
 */
export function clientKey(request: Request, secret: string): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`${secret}:${ip}`).digest("hex").slice(0, 32);
}

/** Maps Convex errors to an HTTP response with a stable error code. */
export function errorResponse(err: unknown): Response {
  if (err instanceof ConvexError) {
    const code = String(err.data);
    const status = code === "rate_limited" ? 429 : code === "forbidden" ? 403 : code === "server_misconfigured" ? 500 : 400;
    return Response.json({ error: code }, { status });
  }
  console.error(err);
  return Response.json({ error: "server_error" }, { status: 500 });
}
