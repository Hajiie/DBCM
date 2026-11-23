import type { NextApiRequest, NextApiResponse } from "next";
import { mutationOrigin } from "../../../src/server/http";
import { sessionClient } from "../../../src/server/supabase";

export const config = { api: { bodyParser: { sizeLimit: "2kb" } } };

export default async function confirm(req: NextApiRequest, res: NextApiResponse) {
  if (!mutationOrigin(req, res)) return;
  const client = sessionClient(req, res);
  if (!client) return res.status(503).json({ error: "The member portal is being configured." });

  const { tokenHash, type } = req.body ?? {};
  if (typeof tokenHash !== "string" || !/^[a-zA-Z0-9_-]{1,512}$/.test(tokenHash) || (type !== "invite" && type !== "recovery")) {
    return res.status(400).json({ error: "Open the link from your account email." });
  }
  const { error } = await client.auth.verifyOtp({ token_hash: tokenHash, type });
  if (error) return res.status(400).json({ error: "This link has expired or already been used. Ask the site administrator for a new link." });
  return res.status(204).end();
}
