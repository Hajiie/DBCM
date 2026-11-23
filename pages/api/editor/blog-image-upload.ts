import { randomUUID } from "node:crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { BLOG_IMAGE_BUCKET, imageExtension, MAX_BLOG_IMAGE_BYTES } from "../../../src/content/blog-images";
import { mutationOrigin } from "../../../src/server/http";
import { editorUser, sessionClient } from "../../../src/server/supabase";

export const config = { api: { bodyParser: { sizeLimit: "2kb" } } };

export default async function signImageUpload(req: NextApiRequest, res: NextApiResponse) {
  if (!mutationOrigin(req, res)) return;
  const client = sessionClient(req, res);
  if (!client) return res.status(503).json({ error: "The member portal is being configured." });
  if (!await editorUser(client)) return res.status(401).json({ error: "Sign in again to upload photos." });

  const extension = imageExtension(req.body?.type);
  const size = req.body?.size;
  if (!extension) return res.status(400).json({ error: "Choose a JPEG, PNG, WebP, GIF or AVIF image." });
  if (!Number.isSafeInteger(size) || size < 1 || size > MAX_BLOG_IMAGE_BYTES) {
    return res.status(400).json({ error: "Choose a non-empty image no larger than 6 MB." });
  }

  const bucket = client.storage.from(BLOG_IMAGE_BUCKET);
  const path = `${randomUUID()}.${extension}`;
  const { data, error } = await bucket.createSignedUploadUrl(path);
  if (error || !data) {
    const missingBucket = error?.message.toLowerCase().includes("bucket not found");
    return res.status(503).json({ error: missingBucket
      ? "Blog image storage has not been set up. Ask the site administrator to apply the image storage migration."
      : "The upload could not be prepared. Please try again." });
  }
  return res.status(200).json({ path, token: data.token });
}
