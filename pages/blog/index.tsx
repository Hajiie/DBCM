import type { GetServerSideProps } from "next";
import Link from "next/link";
import { PageLayout } from "../../src/components";
import ArticleCard from "../../src/components/ArticleCards/ArticleCard";
import { articleCards, categories } from "../../src/content/model";
import { getSection } from "../../src/server/content";
import type { iArticle } from "../../src/shared/interfaces";

type Props = { items: iArticle[]; category: string; author: string; page: number; totalPages: number };
const articlesPerPage = 6;

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const category = typeof query.category === "string" ? query.category : "";
  const author = typeof query.author === "string" ? query.author : "";
  const articles = (await getSection("articles")).data.filter((article) =>
    (!category || article.category === category) && (!author || article.author === author));
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const requested = typeof query.page === "string" && /^\d+$/.test(query.page) ? Number(query.page) : 1;
  const page = Math.max(1, Math.min(requested, totalPages));
  const start = (page - 1) * articlesPerPage;
  return { props: { items: articleCards(articles).slice(start, start + articlesPerPage), category, author, page, totalPages } };
};

export default function Blog({ items, category, author, page, totalPages }: Props) {
  const filterLink = (value: string, page?: number) => ({
    pathname: "/blog",
    query: { ...(value && { category: value }), ...(author && { author }), ...(page && { page }) },
  });
  return (
    <PageLayout PAGE_SEO={{ title: category || "Blog", description: "News and publications from DBCM Lab." }}>
      <main className="container mx-auto px-3 pb-14 pt-28 md:pt-14">
        <h1 className="mb-5 px-2 text-4xl font-semibold tracking-tight">{category || "Blog"}</h1>
        {author && (
          <p className="mb-4 px-2">
            Articles by {author} <Link href={{ pathname: "/blog", query: category ? { category } : {} }} className="ml-2 text-sm text-sky-700 underline dark:text-sky-300">Clear author filter</Link>
          </p>
        )}
        <nav aria-label="Blog categories" className="mb-7 flex flex-wrap gap-2 px-2">
          {["", ...categories].map((value) => (
            <Link key={value} href={filterLink(value)} aria-current={category === value ? "page" : undefined}
              className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium aria-[current=page]:border-sky-700 aria-[current=page]:bg-sky-700 aria-[current=page]:text-white dark:border-slate-600">
              {value || "All articles"}
            </Link>
          ))}
        </nav>
        {items.length ? (
          <div className="flex flex-wrap">{items.map((item) => <ArticleCard key={item.path} article={item.preview} path={item.path} />)}</div>
        ) : <p className="px-2">No articles found.</p>}
        {totalPages > 1 && (
          <nav aria-label="Blog pages" className="flex flex-wrap items-center justify-center gap-4 text-base">
            {page > 1 && <Link className="font-semibold text-sky-700 dark:text-sky-300" href={filterLink(category, page - 1)}>Previous</Link>}
            <span>Page {page} of {totalPages}</span>
            {page < totalPages && <Link className="font-semibold text-sky-700 dark:text-sky-300" href={filterLink(category, page + 1)}>Next</Link>}
          </nav>
        )}
      </main>
    </PageLayout>
  );
}
