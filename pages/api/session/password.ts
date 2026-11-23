import type { NextApiRequest, NextApiResponse } from "next";
import { mutationOrigin } from "../../../src/server/http";
import { sessionClient } from "../../../src/server/supabase";

export const config = { api: { bodyParser: { sizeLimit: "2kb" } } };

export default async function password(req: NextApiRequest, res: NextApiResponse) {
  if (!mutationOrigin(req, res)) return;
  const client = sessionClient(req, res);
  if (!client) return res.status(503).json({ error: "The member portal is being configured." });

  const { data } = await client.auth.getUser();
  if (!data.user) return res.status(401).json({ error: "Open a new link from your account email." });
  const value = req.body?.password;
  if (typeof value !== "string" || value.length < 12 || Buffer.byteLength(value) > 72) {
    return res.status(400).json({ error: "Use at least 12 characters and no more than 72 UTF-8 bytes." });
  }
  const { error } = await client.auth.updateUser({ password: value });
  if (error?.code === "weak_password" || error?.code === "same_password") {
    return res.status(400).json({ error: "Choose a stronger password that differs from your current password." });
  }
  if (error) return res.status(502).json({ error: "The password could not be saved. Please try again." });
  return res.status(204).end();
}
