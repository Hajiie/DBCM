import type { GetServerSideProps } from "next";
import { PageLayout } from "../src/components";
import ContentMarkdown from "../src/components/ContentMarkdown";
import type { About } from "../src/content/model";
import { getSection } from "../src/server/content";

type Props = { about: About };

export const getServerSideProps: GetServerSideProps<Props> = async () => ({
  props: { about: (await getSection("about")).data },
});

export default function AboutUs({ about }: Props) {
  return (
    <PageLayout PAGE_SEO={{ title: about.title, description: about.subtitle }}>
      <main className="mx-auto max-w-4xl px-4 pb-16 pt-28 md:pt-14">
        <div className="mb-8 flex flex-wrap items-center gap-5 border-b border-slate-200 pb-8 dark:border-slate-700">
          <img className="h-20 w-20 rounded-xl bg-white object-contain" src="/images/DBCM_logo.png" alt="DBCM Lab" />
          <div className="min-w-0 flex-1">
            <h1 className="break-words text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{about.title}</h1>
            {about.subtitle && <p className="mt-3 break-keep text-base font-medium text-sky-800 dark:text-sky-300 sm:text-lg">{about.subtitle}</p>}
          </div>
        </div>
        <ContentMarkdown className="break-keep">{about.body}</ContentMarkdown>
      </main>
    </PageLayout>
  );
}
