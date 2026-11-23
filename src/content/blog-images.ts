export const BLOG_IMAGE_BUCKET = "dbcm-blog-images";
export const MAX_BLOG_PHOTOS = 12;
export const MAX_BLOG_IMAGE_BYTES = 6 * 1024 * 1024;

const imageExtensions = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/avif", "avif"],
]);

export const blogImageAccept = [...imageExtensions.keys()].join(",");
export const blogImagePath = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp|gif|avif)$/;

export type BlogPhoto = { path: string; name: string };

export function imageExtension(type: unknown) {
  return typeof type === "string" ? imageExtensions.get(type) : undefined;
}

export function blogPhotoName(filename: string) {
  return Array.from(filename.trim()).slice(0, 80).join("") || "Photo";
}

export function blogImageUrl(path: string) {
  const origin = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");
  return origin ? `${origin}/storage/v1/object/public/${BLOG_IMAGE_BUCKET}/${path}` : undefined;
}

export const BLOG_INLINE_IMAGE_PREFIX = "/blog-images/";

export function insertBlogPhotos(body: string, cursor: number, photos: BlogPhoto[]) {
  if (!photos.length) return { body, cursor };

  const before = body.slice(0, cursor);
  const after = body.slice(cursor);
  const images = photos.map(({ name, path }) => {
    const alt = name.replace(/\s+/g, " ").replace(/[\\[\]]/g, "\\$&");
    return `![${alt}](${BLOG_INLINE_IMAGE_PREFIX}${path})`;
  }).join("\n\n");
  const opening = !before || before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
  const closing = after.startsWith("\n\n") ? "" : after.startsWith("\n") ? "\n" : "\n\n";
  const start = before + opening + images;
  return { body: start + closing + after, cursor: start.length + 2 };
}
