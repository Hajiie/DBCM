import type { GetServerSideProps } from "next";
import { useState, type FormEvent } from "react";
import { PageLayout } from "../../src/components";
import { primaryButton } from "../../src/components/Editor/Fields";
import { postJson, requestError } from "../../src/components/Editor/request";

type Props = { tokenHash: string; type: "invite" | "recovery" | null };

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, res }) => {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  const type = query.type === "invite" || query.type === "recovery" ? query.type : null;
  const tokenHash = typeof query.token_hash === "string" && /^[a-zA-Z0-9_-]{1,512}$/.test(query.token_hash) ? query.token_hash : "";
  return { props: { tokenHash, type } };
};

export default function Confirm({ tokenHash, type }: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await postJson("/api/session/confirm/", { tokenHash, type });
      if (response.ok) {
        window.location.replace("/account/password/");
        return;
      }
      setError(await requestError(response, "The account link could not be verified."));
    } catch {
      setError("The server could not be reached. Please try again.");
    }
    setPending(false);
  }

  return (
    <PageLayout PAGE_SEO={{ title: "Confirm DBCM account" }}>
      <main className="mx-auto w-full max-w-md px-4 pb-16 pt-28 md:pt-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          <h1 className="mb-4 text-3xl font-semibold tracking-tight">Confirm your account</h1>
          {type && tokenHash ? (
            <form method="post" onSubmit={confirm} className="space-y-4">
              <p className="text-base">Confirm the link to set your DBCM Lab account password.</p>
              {error && <p role="alert" className="text-base text-red-700 dark:text-red-300">{error}</p>}
              <button type="submit" className={primaryButton} disabled={pending}>{pending ? "Confirming…" : "Continue"}</button>
            </form>
          ) : <p className="text-base">Open the link from your DBCM Lab account email.</p>}
        </div>
      </main>
    </PageLayout>
  );
}
