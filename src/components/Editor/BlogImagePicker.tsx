import { useState, type ChangeEvent } from "react";
import {
  BLOG_IMAGE_BUCKET, blogImageAccept, blogPhotoName, imageExtension, MAX_BLOG_IMAGE_BYTES, type BlogPhoto,
} from "../../content/blog-images";
import { postJson, requestError } from "./request";

async function uploadBlogImage(file: File): Promise<BlogPhoto> {
  const origin = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!origin || !key) throw new Error("Blog image storage is being configured.");
  if (!imageExtension(file.type)) throw new Error("Choose a JPEG, PNG, WebP, GIF or AVIF image.");
  if (file.size < 1 || file.size > MAX_BLOG_IMAGE_BYTES) throw new Error("Choose a non-empty image no larger than 6 MB.");

  const response = await postJson("/api/editor/blog-image-upload/", { type: file.type, size: file.size });
  if (!response.ok) throw new Error(await requestError(response, "The upload could not be prepared."));
  const { path, token } = await response.json();
  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(origin, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await client.storage.from(BLOG_IMAGE_BUCKET).uploadToSignedUrl(path, token, file, { contentType: file.type });
  if (error) throw new Error("The photo could not be uploaded. Please try again.");
  return { path, name: blogPhotoName(file.name) };
}

export default function BlogImagePicker({ label, remaining, multiple = false, beforeUpload, onUploaded, onBusy }: {
  label: string;
  remaining: number;
  multiple?: boolean;
  beforeUpload?: (files: File[]) => string | undefined;
  onUploaded: (photos: BlogPhoto[]) => void;
  onBusy: (busy: boolean) => void;
}) {
  const [progress, setProgress] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  async function choose(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";
    if (!files.length) return;
    setErrors([]);
    if (files.length > remaining) {
      setErrors([`You can add ${remaining} more ${remaining === 1 ? "photo" : "photos"}.`]);
      return;
    }

    const selectionError = beforeUpload?.(files);
    if (selectionError) {
      setErrors([selectionError]);
      return;
    }

    onBusy(true);
    const uploaded: BlogPhoto[] = [];
    const failed: string[] = [];
    try {
      for (const [index, file] of files.entries()) {
        setProgress(`Uploading photo ${index + 1} of ${files.length}…`);
        try {
          uploaded.push(await uploadBlogImage(file));
        } catch (error) {
          const message = error instanceof Error ? error.message : "The photo could not be uploaded.";
          failed.push(`${file.name} — ${message}`);
        }
      }
      if (uploaded.length) onUploaded(uploaded);
      setErrors(failed);
    } finally {
      setProgress("");
      onBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold">
        {label}
        <input
          type="file"
          accept={blogImageAccept}
          multiple={multiple}
          disabled={remaining < 1}
          onChange={choose}
          className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2 text-sm text-slate-800 file:mr-3 file:rounded-md file:border-0 file:bg-sky-100 file:px-3 file:py-2 file:font-medium file:text-sky-900 hover:file:bg-sky-200 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
      </label>
      <p className="text-sm text-slate-600 dark:text-slate-300">JPEG, PNG, WebP, GIF or AVIF. Up to 6 MB per file.</p>
      {progress && <p role="status" className="text-sm font-medium">{progress}</p>}
      {errors.length > 0 && (
        <ul role="alert" className="list-inside list-disc break-words text-sm text-red-700 dark:text-red-300">
          {errors.map((message, index) => <li key={index}>{message}</li>)}
        </ul>
      )}
    </div>
  );
}
