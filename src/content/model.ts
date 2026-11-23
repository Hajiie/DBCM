import type { iArticle } from "../shared/interfaces";

export const categories = ["News", "Paper", "Research", "Events"] as const;
export const memberGroups = ["Professor", "Researchers", "Alumni"] as const;
export const sections = ["articles", "members", "about"] as const;

export type Article = {
  route: "blog" | "paper";
  slug: string;
  title: string;
  summary: string;
  body: string;
  author: string;
  category: typeof categories[number];
  tags: string;
  date: string;
  image: string;
  featured: boolean;
};

export type Member = {
  id: string;
  group: typeof memberGroups[number];
  name: string;
  tenure: string;
  image: string;
  bio: string;
};

export type About = {
  title: string;
  subtitle: string;
  body: string;
};

export type Content = { articles: Article[]; members: Member[]; about: About };
export type Section = keyof Content;
export type Revision<K extends Section> = { data: Content[K]; revision: number };
export type Snapshot = { [K in Section]: Revision<K> };

export function articlePath(article: Article) {
  return `/${article.route}/${article.slug}/`;
}

export function articleCard(article: Article): iArticle {
  return {
    path: articlePath(article),
    featureArticle: article.featured,
    preview: {
      author: { name: article.author },
      date: new Intl.DateTimeFormat("en", {
        dateStyle: "long",
        timeZone: "UTC",
      }).format(new Date(article.date)),
      articleTitle: article.title,
      tags: article.tags,
      thumbnail: article.image || "/images/DBCM_logo.png",
      shortIntro: article.summary,
      category: article.category,
    },
  };
}

export function articleCards(articles: Article[]) {
  return [...articles].sort((a, b) => b.date.localeCompare(a.date)).map(articleCard);
}
