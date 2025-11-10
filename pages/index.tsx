/**These are necessary imports / components for the page */
import { PageLayout, Text, LinkTo } from "../src/components";
import { DEFAULT_SEO } from "../BLOG_CONSTANTS/_BLOG_SETUP";
import FeaturedArticleSection from "../src/components/Misc/FeaturedArticleSection";
import HomeNonFeatureArticles from "../src/components/Misc/HomeNonFeatureAricles";

const Home = () => {
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
            <LinkTo href="/pages/members.tsx" passHref className='flex items-center justify-center rounded-md bg-blue-600 px-4 pb-2 text-white hover:text-white shadow-lg hover:shadow-none transition-all mb-3 md:mx-5 mx-2'>
              <span className='text-xl pt-2 block'>Members</span>
            </LinkTo>
            <LinkTo href="/pages/about-us.tsx" passHref className='flex items-center justify-center rounded-md bg-blue-600 px-4 pb-2 text-white hover:text-white shadow-lg hover:shadow-none transition-all mb-3 md:mx-5 mx-2'>
              <span className='text-xl pt-2 block'>About</span>
            </LinkTo>
            <LinkTo href="/blog/?category=Paper" passHref className='flex items-center justify-center rounded-md bg-blue-600 px-4 pb-2 text-white hover:text-white shadow-lg hover:shadow-none transition-all mb-3 md:mx-5 mx-2'>
              <span className='text-xl pt-2 block'>Papers</span>
            </LinkTo>

            <LinkTo href="/pages/contact-us.tsx" passHref className='flex items-center justify-center rounded-md bg-blue-600 px-4 pb-2 text-white hover:text-white shadow-lg hover:shadow-none transition-all mb-3 md:mx-5 mx-2'>
              <span className='text-xl pt-2 block'>Contact Us</span>
            </LinkTo>
          </div>
        </div>
      </section>
      <div className="container mx-auto lg:px-[15px] px-0">
        <div className={'flex flex-wrap'}>
          <FeaturedArticleSection />
          <h1 className='px-3 w-full mb-5 text-xl md:text-3xl font-medium'>Checkout the below articles</h1>
          <hr className='border-1 mb-5 w-[98%] mx-auto' />
          <HomeNonFeatureArticles />
        </div>
      </div>
    </PageLayout>
  )
}

export default Home