import Head from "next/head";
import type { GetServerSideProps } from "next";
import { useState, type FormEvent } from "react";
import { PageLayout } from "../src/components";
import { primaryButton, TextField } from "../src/components/Editor/Fields";
import { postJson, requestError } from "../src/components/Editor/request";
import { editorUser, sessionClient } from "../src/server/supabase";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  res.setHeader("Cache-Control", "private, no-store");
  const client = sessionClient(req, res);
  return client && await editorUser(client)
    ? { redirect: { destination: "/editor/", permanent: false } }
    : { props: {} };
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const response = await postJson("/api/session/login/", { email, password });
      if (response.ok) {
        window.location.replace("/editor/");
        return;
      }
      setError(await requestError(response, "Sign-in failed. Please try again."));
    } catch {
      setError("The server could not be reached. Please try again.");
    }
    setPending(false);
  }

  return (
    <PageLayout PAGE_SEO={{ title: "Member sign-in" }}>
      <Head><meta name="robots" content="noindex, nofollow" /></Head>
      <main className="mx-auto w-full max-w-md px-4 pb-16 pt-28 md:pt-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          <h1 className="mb-2 text-3xl font-semibold tracking-tight">Member sign-in</h1>
          <p className="mb-6 text-base text-slate-600 dark:text-slate-300">Use your DBCM Lab account to edit the site.</p>
          <form method="post" onSubmit={submit} className="space-y-4">
            <TextField label="Email" type="email" autoComplete="username" value={email} onChange={setEmail} maxLength={254} required />
            <TextField label="Password" type="password" autoComplete="current-password" value={password} onChange={setPassword} maxLength={256} required />
            {error && <p role="alert" className="text-base font-medium text-red-700 dark:text-red-300">{error}</p>}
            <button type="submit" disabled={pending} className={`${primaryButton} w-full`}>
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </main>
    </PageLayout>
  );
}
