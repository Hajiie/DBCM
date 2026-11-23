import type { GetServerSideProps } from "next";
import { PageLayout } from "../src/components";
import ContentMarkdown from "../src/components/ContentMarkdown";
import { memberGroups, type Member } from "../src/content/model";
import { getSection } from "../src/server/content";

type Props = { members: Member[] };

export const getServerSideProps: GetServerSideProps<Props> = async () => ({
  props: { members: (await getSection("members")).data },
});

export default function Members({ members }: Props) {
  return (
    <PageLayout PAGE_SEO={{ title: "Members", description: "Meet the members of the DBCM Lab at Hongik University." }}>
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-28 md:pt-14">
        <h1 className="mb-8 text-4xl font-semibold tracking-tight">Members</h1>
        {members.length === 0 && <p>No member profiles have been published.</p>}
        {memberGroups.map((group) => {
          const entries = members.filter((member) => member.group === group);
          if (!entries.length) return null;
          return (
            <section key={group} className="mb-9">
              <h2 className="mb-4 text-2xl font-semibold text-sky-800 dark:text-sky-300">{group}</h2>
              <div className="space-y-4">
                {entries.map((member) => (
                  <article key={member.id} className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:items-start">
                    {member.image && <img className="h-32 w-28 shrink-0 rounded-lg object-cover object-top sm:h-40 sm:w-32" src={member.image} alt={member.name} loading="lazy" referrerPolicy="no-referrer" />}
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-xl font-semibold">{member.name}</h3>
                      {member.tenure && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{member.tenure}</p>}
                      {member.bio && <ContentMarkdown className="mt-3 break-keep">{member.bio}</ContentMarkdown>}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </PageLayout>
  );
}
