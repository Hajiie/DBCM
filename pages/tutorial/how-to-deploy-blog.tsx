import { PageLayout } from "../../src/components";

export default function DeploymentGuide() {
  return (
    <PageLayout PAGE_SEO={{ title: "Deploy DBCM Lab" }}>
      <main className="mx-auto max-w-3xl px-4 pb-14 pt-28 md:pt-12">
        <h1 className="mb-5 text-3xl font-semibold">Deploy DBCM Lab</h1>
        <ol className="list-decimal space-y-3 pl-6 text-base">
          <li>Run the DBCM SQL migration in your Supabase project.</li>
          <li>Add the Supabase project URL and publishable key to the Vercel project environment variables.</li>
          <li>Create a Supabase Auth user and register the user ID in the DBCM editor permissions table.</li>
          <li>Verify sign-in and publishing on a preview deployment before merging to the production branch.</li>
        </ol>
      </main>
    </PageLayout>
  );
}
