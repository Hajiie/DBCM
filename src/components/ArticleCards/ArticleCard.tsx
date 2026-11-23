import type { IArticleHeaderData } from "../../shared/interfaces";
import { transformImagePaths } from "../../utils/utils";
import LinkTo from "../LinkTo";
import ArticleCardCategory from "../Misc/ArticleCardCategory";
import ArticleTags from "../Misc/ArticleTags";
import Avatar from "../Misc/Avatar";
import classes from "./ArticleCard.module.scss";

export default function ArticleCard({ article, path }: { article: IArticleHeaderData; path: string }) {
  return (
    <div className="mb-7 w-full px-2 md:w-1/2 md:px-4 lg:w-1/3">
      <article className={`${classes.article_card} flex h-full flex-col justify-between border-b-[5px] border-blue-500 dark:bg-slate-800 dark:text-white`}>
        <div>
          <LinkTo href={path} className="block">
            <img src={transformImagePaths(article.thumbnail)} alt="" className="h-[200px] w-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
            <div className="px-4 pt-3">
              <p className="mb-1 text-sm text-slate-600 dark:text-slate-300">{article.date}</p>
              <h2 className="break-words text-xl font-semibold">{article.articleTitle}</h2>
            </div>
          </LinkTo>
          <div className="px-4">
            <p className="line-clamp mt-2 break-words text-sm">{article.shortIntro}</p>
            <ArticleTags tags={article.tags} />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <LinkTo href={"/blog?author=" + encodeURIComponent(article.author.name)} className="flex items-center text-sm font-medium">
            <Avatar author={article.author} className="mr-2 h-8 w-8 text-base" />
            {article.author.name}
          </LinkTo>
          <ArticleCardCategory category={article.category} />
        </div>
      </article>
    </div>
  );
}
