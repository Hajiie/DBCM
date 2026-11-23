import type { NextApiRequest, NextApiResponse } from "next";
import { appOrigin } from "./origin";

export function allowMethod(req: NextApiRequest, res: NextApiResponse, method: string) {
  if (req.method === method) return true;
  res.setHeader("Allow", method);
  res.status(405).json({ error: "Method not allowed." });
  return false;
}

export function mutationOrigin(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (!allowMethod(req, res, "POST")) return null;
  const origin = appOrigin(req);
  if (!origin) {
    res.status(503).json({ error: "The member portal needs its public URL configured." });
    return null;
  }
  if (req.headers.origin !== origin.origin) {
    res.status(403).json({ error: "Open the member portal on its configured site address." });
    return null;
  }
  if (req.headers["content-type"]?.split(";")[0] !== "application/json") {
    res.status(415).json({ error: "Expected a JSON request." });
    return null;
  }
  return origin;
}
