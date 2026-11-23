import type { IncomingMessage } from "node:http";

const localHosts = ["localhost", "127.0.0.1", "[::1]"];

export function appOrigin(req: IncomingMessage): URL | null {
  const vercelHost = process.env.VERCEL_ENV === "preview"
    ? process.env.VERCEL_URL
    : process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const configured = process.env.VERCEL_ENV === "preview" && vercelHost
    ? `https://${vercelHost}`
    : process.env.DBCM_ORIGIN || (vercelHost && `https://${vercelHost}`);
  try {
    if (configured) {
      const url = new URL(configured);
      const allowed = url.protocol === "https:" || (url.protocol === "http:" && localHosts.includes(url.hostname));
      return allowed && [url.origin, url.origin + "/"].includes(configured) ? url : null;
    }
    if (process.env.NODE_ENV === "production") return null;
    const url = new URL(`http://${req.headers.host}`);
    return localHosts.includes(url.hostname) && url.host === req.headers.host ? url : null;
  } catch {
    return null;
  }
}
