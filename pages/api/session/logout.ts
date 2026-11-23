import type { NextApiRequest, NextApiResponse } from "next";
import { mutationOrigin } from "../../../src/server/http";
import { sessionClient } from "../../../src/server/supabase";

export const config = { api: { bodyParser: { sizeLimit: "1kb" } } };

export default async function logout(req: NextApiRequest, res: NextApiResponse) {
  if (!mutationOrigin(req, res)) return;
  const client = sessionClient(req, res);
  if (!client) return res.status(503).json({ error: "The member portal is being configured." });

  const { error } = await client.auth.signOut({ scope: "local" });
  if (error && error.name !== "AuthSessionMissingError") {
    return res.status(502).json({ error: "Sign-out is temporarily unavailable." });
  }
  return res.status(204).end();
}
