import type { NextApiRequest, NextApiResponse } from "next";
import { mutationOrigin } from "../../../src/server/http";
import { isEditor, sessionClient } from "../../../src/server/supabase";

export const config = { api: { bodyParser: { sizeLimit: "4kb" } } };

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (!mutationOrigin(req, res)) return;
  const client = sessionClient(req, res);
  if (!client) return res.status(503).json({ error: "The member portal is being configured." });

  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = req.body?.password;
  if (!email || email.length > 254 || typeof password !== "string" || !password || Buffer.byteLength(password) > 256) {
    return res.status(401).json({ error: "Check your email and password." });
  }

  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error?.status === 429) return res.status(429).json({ error: "Too many attempts. Please try again later." });
  if (error && (!error.status || error.status >= 500)) {
    return res.status(502).json({ error: "Sign-in is temporarily unavailable." });
  }
  if (error) return res.status(401).json({ error: "Check your email and password." });

  if (!await isEditor(client)) {
    await client.auth.signOut({ scope: "local" });
    return res.status(403).json({ error: "This account has not been approved to edit DBCM Lab." });
  }
  return res.status(204).end();
}
