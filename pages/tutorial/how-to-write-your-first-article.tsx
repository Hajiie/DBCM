import { PageLayout, LinkTo } from "../../src/components";

export default function WritingGuide() {
  return (
    <PageLayout PAGE_SEO={{ title: "How to publish an article" }}>
      <main className="mx-auto max-w-3xl px-4 pb-14 pt-28 md:pt-12">
        <h1 className="mb-5 text-3xl font-semibold">How to publish an article</h1>
        <ol className="list-decimal space-y-3 pl-6 text-base">
          <li>Open <a className="underline" href="/editor/">Member portal</a> and sign in with your DBCM account.</li>
          <li>Open Blog and choose New article or select an existing article.</li>
          <li>Enter the title, summary and body. Use Markdown for headings, links and images.</li>
          <li>Choose Publish changes and open the <LinkTo href="/blog/" className="underline">public blog</LinkTo> to review your article.</li>
        </ol>
      </main>
    </PageLayout>
  );
}
