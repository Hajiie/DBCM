import type { SupabaseClient } from "@supabase/supabase-js";
import type { Content, Section, Revision, Snapshot } from "../content/model";
import articles from "../content/articles.json";
import members from "../content/members.json";
import about from "../content/about.json";
import { BLOG_IMAGE_BUCKET } from "../content/blog-images";
import { publicClient } from "./supabase";
import { validateSection } from "./validate-content";

const initial = { articles, members, about } as Content;
type ContentRow = { section: string; revision: number; data: unknown };

function sectionData<K extends Section>(section: K, row?: ContentRow | null): Revision<K> {
  return row
    ? { revision: row.revision, data: validateSection(section, row.data) }
    : { revision: 0, data: initial[section] };
}

export async function getSection<K extends Section>(section: K): Promise<Revision<K>> {
  const client = publicClient();
  if (!client) return sectionData(section);

  const { data, error } = await client.from("dbcm_content").select("section, revision, data").eq("section", section).maybeSingle();
  if (error) throw error;
  return sectionData(section, data);
}

export async function getSnapshot(client: SupabaseClient): Promise<Snapshot> {
  const { data, error } = await client.from("dbcm_content").select("section, revision, data");
  if (error) throw error;
  const rows = new Map(data.map((row: ContentRow) => [row.section, row]));
  return {
    articles: sectionData("articles", rows.get("articles")),
    members: sectionData("members", rows.get("members")),
    about: sectionData("about", rows.get("about")),
  };
}

async function removeRetiredBlogImages(client: SupabaseClient) {
  try {
    const { data: paths, error } = await client.rpc("dbcm_pending_blog_image_deletions");
    if (error) throw error;
    if (!paths?.length) return;
    const { error: deleteError } = await client.storage.from(BLOG_IMAGE_BUCKET).remove(paths);
    if (deleteError) throw deleteError;
  } catch (error) {
    // The publish is already committed. Files still in Storage are retried on the next publish.
    console.warn("Could not remove retired blog images", error);
  }
}

export async function saveSection<K extends Section>(section: K, revision: number, data: Content[K], client: SupabaseClient) {
  const { data: published, error } = await client.rpc("dbcm_publish_section", {
    section_name: section,
    expected_revision: revision,
    new_data: data,
  });
  if (error?.code === "42501") return { status: "unauthorized" } as const;
  if (error?.code === "PT422") return { status: "retired-photo" } as const;
  if (error?.code === "22023" || error?.code === "23514") return { status: "invalid" } as const;
  if (error) throw error;
  if (published === null) return { status: "conflict" } as const;
  await removeRetiredBlogImages(client);
  return { status: "saved", saved: { revision: published as number, data } } as const;
}
