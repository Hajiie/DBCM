import type { NextApiRequest, NextApiResponse } from "next";
import { sections } from "../../../src/content/model";
import { saveSection } from "../../../src/server/content";
import { mutationOrigin } from "../../../src/server/http";
import { editorUser, sessionClient } from "../../../src/server/supabase";
import { ContentError, validateSection } from "../../../src/server/validate-content";

export const config = { api: { bodyParser: { sizeLimit: "1mb" } } };

export default async function save(req: NextApiRequest, res: NextApiResponse) {
  if (!mutationOrigin(req, res)) return;
  const client = sessionClient(req, res);
  if (!client) return res.status(503).json({ error: "The member portal is being configured." });
  if (!await editorUser(client)) return res.status(401).json({ error: "Sign in to publish changes." });
  const section = sections.find((value) => value === req.query.section);
  if (!section) return res.status(404).json({ error: "Section not found." });
  const revision = req.body?.revision;
  if (!Number.isSafeInteger(revision) || revision < 0 || revision >= 2_147_483_647) {
    return res.status(400).json({ error: "Invalid content revision." });
  }

  try {
    const data = validateSection(section, req.body.data);
    const result = await saveSection(section, revision, data, client);
    if (result.status === "invalid") return res.status(400).json({ error: "Check the section content." });
    if (result.status === "unauthorized") return res.status(401).json({ error: "Sign in to publish changes." });
    if (result.status === "retired-photo") {
      return res.status(422).json({ error: "This content uses a photo that was deleted. Remove its reference or upload the photo again." });
    }
    if (result.status === "conflict") {
      return res.status(409).json({ error: "Someone has published changes to this section. Open the editor in a new tab to review the latest version." });
    }
    return res.status(200).json(result.saved);
  } catch (error) {
    if (error instanceof ContentError) return res.status(400).json({ error: error.message });
    throw error;
  }
}
