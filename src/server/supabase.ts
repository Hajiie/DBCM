import { createServerClient, serializeCookieHeader } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { IncomingMessage, ServerResponse } from "node:http";
import { appOrigin } from "./origin";

type Request = IncomingMessage & { cookies: Partial<Record<string, string>> };

function credentials() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return url && key ? { url, key } : null;
}

export function publicClient() {
  const config = credentials();
  return config ? createClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  }) : null;
}

export function sessionClient(req: Request, res: ServerResponse) {
  const config = credentials();
  const origin = appOrigin(req);
  if (!config || !origin) return null;
  const cookies = new Map(Object.entries(req.cookies).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
  const headers = new Map<string, string>();
  return createServerClient(config.url, config.key, {
    cookieOptions: { path: "/", httpOnly: true, sameSite: "lax", secure: origin.protocol === "https:" },
    cookies: {
      getAll: () => Array.from(cookies, ([name, value]) => ({ name, value })),
      setAll: (values) => {
        for (const { name, value, options } of values) {
          if (options.maxAge === 0) cookies.delete(name);
          else cookies.set(name, value);
          headers.set(name, serializeCookieHeader(name, value, options));
        }
        res.setHeader("Set-Cookie", [...headers.values()]);
        res.setHeader("Cache-Control", "private, no-store");
      },
    },
  });
}

export async function isEditor(client: SupabaseClient) {
  const { data, error } = await client.rpc("dbcm_is_editor");
  if (error) throw error;
  return data === true;
}

export async function editorUser(client: SupabaseClient) {
  const { data: { user }, error } = await client.auth.getUser();
  if (error && error.name !== "AuthSessionMissingError" && ![400, 401, 403].includes(error.status ?? 0)) {
    throw error;
  }
  return user?.email && await isEditor(client) ? { email: user.email } : null;
}
