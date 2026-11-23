import { articleCard, type Article } from "../content/model";
import PageLayout from "../layouts/PageLayouts";
import ArticleHeader from "./ArticleHeader";
import ContentMarkdown from "./ContentMarkdown";
import LinkTo from "./LinkTo";

export default function PublishedArticle({ article }: { article: Article }) {
  const card = articleCard(article);
  return (
    <PageLayout PAGE_SEO={{ title: article.title, description: article.summary, ogImage: card.preview.thumbnail, author: article.author, keywords: article.tags }}>
      <main className="mx-auto max-w-4xl px-4 pb-16 pt-28 md:pt-12">
        <LinkTo href="/blog/" className="mb-4 inline-block text-sm font-semibold text-sky-700 dark:text-sky-300">All articles</LinkTo>
        <article className="rounded-xl border border-slate-200 bg-white px-5 py-6 dark:border-slate-700 dark:bg-slate-800 sm:px-10">
          <ArticleHeader ARTICLE_DETAILS={card} centered />
          <ContentMarkdown className="break-keep">{article.body}</ContentMarkdown>
        </article>
      </main>
    </PageLayout>
  );
}
