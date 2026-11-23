import type { GetServerSideProps } from "next";
import { useState, type FormEvent } from "react";
import { PageLayout } from "../../src/components";
import { primaryButton, TextField } from "../../src/components/Editor/Fields";
import { postJson, requestError } from "../../src/components/Editor/request";
import { sessionClient } from "../../src/server/supabase";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  const client = sessionClient(req, res);
  if (!client || !(await client.auth.getUser()).data.user) {
    return { redirect: { destination: "/login/", permanent: false } };
  }
  return { props: {} };
};

export default function Password() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirm) {
      setError("The passwords must match.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const response = await postJson("/api/session/password/", { password });
      if (response.ok) {
        window.location.replace("/editor/");
        return;
      }
      setError(await requestError(response, "The password could not be saved."));
    } catch {
      setError("The server could not be reached. Please try again.");
    }
    setPending(false);
  }

  return (
    <PageLayout PAGE_SEO={{ title: "Set password" }}>
      <main className="mx-auto w-full max-w-md px-4 pb-16 pt-28 md:pt-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          <h1 className="mb-2 text-3xl font-semibold tracking-tight">Set your password</h1>
          <p className="mb-5 text-base">Use at least 12 characters.</p>
          <form method="post" className="space-y-4" onSubmit={submit}>
            <TextField label="New password" type="password" autoComplete="new-password" value={password} onChange={setPassword} required />
            <TextField label="Confirm password" type="password" autoComplete="new-password" value={confirm} onChange={setConfirm} required />
            {error && <p role="alert" className="text-base text-red-700 dark:text-red-300">{error}</p>}
            <button type="submit" className={primaryButton} disabled={pending || password.length < 12 || !confirm}>
              {pending ? "Saving…" : "Save password"}
            </button>
          </form>
        </div>
      </main>
    </PageLayout>
  );
}
