import type { GetServerSideProps } from "next";
import PublishedArticle from "../../src/components/PublishedArticle";
import type { Article } from "../../src/content/model";
import { getSection } from "../../src/server/content";

export const getServerSideProps: GetServerSideProps<{ article: Article }> = async ({ params }) => {
  const article = (await getSection("articles")).data.find((entry) => entry.route === "paper" && entry.slug === params?.slug);
  return article ? { props: { article } } : { notFound: true };
};

export default PublishedArticle;
