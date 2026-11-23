import type { GetServerSideProps } from "next";
import { articleCards } from "../src/content/model";
import { getSection } from "../src/server/content";
import type { iArticle } from "../src/shared/interfaces";
import { PageLayout, Text, LinkTo } from "../src/components";
import { DEFAULT_SEO } from "../BLOG_CONSTANTS/_BLOG_SETUP";
import FeaturedArticleSection from "../src/components/Misc/FeaturedArticleSection";
import HomeNonFeatureArticles from "../src/components/Misc/HomeNonFeatureAricles";

export const getServerSideProps: GetServerSideProps<{ articles: iArticle[] }> = async () => ({
  props: { articles: articleCards((await getSection("articles")).data) },
});

const Home = ({ articles }: { articles: iArticle[] }) => {
  return (
    <PageLayout PAGE_SEO={DEFAULT_SEO}>
      <section className='w-full md:pt-[100px] md:pb-[70px] pt-[130px] pb-20 mb-10 dark:bg-slate-800 bg-slate-200'>
        <div className="container text-center px-3">
          <Text title className='text-3xl'>
            DBCM Lab
          </Text>

          <Text p className="mt-3 text-sm">
            Graph DB-based Construction Data Analysis<br />
            AI-based Construction Management & Safety<br />
            Full Lifecycle Optimization for Projects<br />
            Data Science-driven Risk Prediction<br />
            Digital Transformation for Construction<br />
          </Text>
          <div className='flex justify-center mt-5 flex-wrap '>
            <a href="https://huggingface.co/DBCMLAB" target="_blank" rel="noopener noreferrer" className='flex items-center justify-center rounded-md bg-blue-600 px-4 pb-2 text-white hover:text-white shadow-lg hover:shadow-none transition-all mb-3 md:mx-5 mx-2'>
              <span className='text-xl pt-2 block'>Huggingface</span>
            </a>
            <LinkTo href="/members/" passHref className='flex items-center justify-center rounded-md bg-blue-600 px-4 pb-2 text-white hover:text-white shadow-lg hover:shadow-none transition-all mb-3 md:mx-5 mx-2'>
              <span className='text-xl pt-2 block'>Members</span>
            </LinkTo>
            <LinkTo href="/about-us/" passHref className='flex items-center justify-center rounded-md bg-blue-600 px-4 pb-2 text-white hover:text-white shadow-lg hover:shadow-none transition-all mb-3 md:mx-5 mx-2'>
              <span className='text-xl pt-2 block'>About</span>
            </LinkTo>
            <LinkTo href="/blog/?category=Paper" passHref className='flex items-center justify-center rounded-md bg-blue-600 px-4 pb-2 text-white hover:text-white shadow-lg hover:shadow-none transition-all mb-3 md:mx-5 mx-2'>
              <span className='text-xl pt-2 block'>Papers</span>
            </LinkTo>

            <LinkTo href="/contact-us/" passHref className='flex items-center justify-center rounded-md bg-blue-600 px-4 pb-2 text-white hover:text-white shadow-lg hover:shadow-none transition-all mb-3 md:mx-5 mx-2'>
              <span className='text-xl pt-2 block'>Contact Us</span>
            </LinkTo>
          </div>
        </div>
      </section>
      <div className="container mx-auto lg:px-[15px] px-0">
        <div className={'flex flex-wrap'}>
          <FeaturedArticleSection articles={articles} />
          {articles.some((article) => !article.featureArticle) && (
            <>
              <h2 className='px-3 w-full mb-5 text-xl md:text-3xl font-medium'>Latest articles</h2>
              <hr className='border-1 mb-5 w-[98%] mx-auto' />
              <HomeNonFeatureArticles articles={articles} />
            </>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

export default Home