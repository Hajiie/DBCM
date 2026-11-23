import type { NextApiRequest, NextApiResponse } from "next";
import { articleCards } from "../../src/content/model";
import { getSection } from "../../src/server/content";
import { allowMethod } from "../../src/server/http";

export default async function search(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethod(req, res, "GET")) return;
  res.setHeader("Cache-Control", "no-store");
  const query = typeof req.query.q === "string" ? req.query.q.trim().toLowerCase().slice(0, 160) : "";
  if (!query) return res.status(200).json([]);
  const matched = (await getSection("articles")).data.filter(({ title, summary, tags, category, author }) =>
    [title, summary, tags, category, author].some((value) => value.toLowerCase().includes(query)));
  return res.status(200).json(articleCards(matched).slice(0, 30));
}
