import { categories, memberGroups, type Content, type Section } from "../content/model";

export class ContentError extends Error {}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ContentError("Invalid content.");
  return value as Record<string, unknown>;
}

function list(value: unknown, max: number): unknown[] {
  if (!Array.isArray(value) || value.length > max) throw new ContentError(`Enter up to ${max} items.`);
  return value;
}

function field(value: unknown, label: string, max: number, required = true) {
  if (typeof value !== "string" || value.length > max || (required && !value.trim())) {
    throw new ContentError(`Check ${label}. The maximum is ${max} characters.`);
  }
  return value.trim();
}

function choice<T extends string>(value: unknown, options: readonly T[], label: string): T {
  const match = options.find((option) => option === value);
  if (!match) throw new ContentError(`Choose a valid ${label}.`);
  return match;
}

function image(value: unknown) {
  const url = field(value, "image URL", 500, false);
  if (!url || /^\/images\/(?!\/)[^\\\u0000-\u001f]+$/.test(url)) return url;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" && !parsed.username && !parsed.password) return url;
  } catch {
    // Other inputs are handled by the validation error below.
  }
  throw new ContentError("Use an HTTPS image URL or a path starting with /images/.");
}

function distinct(ids: string[]) {
  if (new Set(ids).size !== ids.length) throw new ContentError("Each entry must have a unique ID or article URL.");
}

const validators: { [K in Section]: (value: unknown) => Content[K] } = {
  articles(value) {
    const articles = list(value, 250).map((entry) => {
      const data = record(entry);
      const route = choice(data.route, ["blog", "paper"] as const, "article route");
      const slug = field(data.slug, "URL slug", 80);
      if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(slug) || ["index", "your-first-article"].includes(slug.toLowerCase())) {
        throw new ContentError("Use letters, numbers, hyphens or underscores in the URL slug. Choose a unique slug.");
      }
      const date = field(data.date, "publication date", 10);
      const parsed = new Date(date);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
        throw new ContentError("Enter a valid publication date.");
      }
      if (typeof data.featured !== "boolean") throw new ContentError("Invalid featured setting.");
      return {
        route, slug, date,
        title: field(data.title, "article title", 240),
        summary: field(data.summary, "summary", 600),
        body: field(data.body, "article body", 40_000),
        author: field(data.author, "author", 120),
        category: choice(data.category, categories, "category"),
        tags: field(data.tags, "tags", 240, false),
        image: image(data.image),
        featured: data.featured,
      };
    });
    distinct(articles.map(({ route, slug }) => `${route}/${slug.toLowerCase()}`));
    return articles;
  },
  members(value) {
    const members = list(value, 120).map((entry) => {
      const data = record(entry);
      const id = field(data.id, "member ID", 80);
      if (!/^[a-zA-Z0-9_-]+$/.test(id)) throw new ContentError("Invalid member ID.");
      return {
        id,
        group: choice(data.group, memberGroups, "member group"),
        name: field(data.name, "member name", 160),
        tenure: field(data.tenure, "tenure", 120, false),
        image: image(data.image),
        bio: field(data.bio, "member bio", 4000, false),
      };
    });
    distinct(members.map(({ id }) => id));
    return members;
  },
  about(value) {
    const data = record(value);
    return {
      title: field(data.title, "page title", 160),
      subtitle: field(data.subtitle, "subtitle", 300, false),
      body: field(data.body, "page body", 40_000),
    };
  },
};

export function validateSection<K extends Section>(section: K, value: unknown): Content[K] {
  return validators[section](value);
}
