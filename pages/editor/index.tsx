import Head from "next/head";
import type { GetServerSideProps } from "next";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { PageLayout } from "../../src/components";
import { AboutEditor, ArticlesEditor, MembersEditor } from "../../src/components/Editor/SectionEditors";
import { primaryButton, secondaryButton } from "../../src/components/Editor/Fields";
import { postJson, requestError } from "../../src/components/Editor/request";
import { sections, type Content, type Revision, type Section, type Snapshot } from "../../src/content/model";
import { getSnapshot } from "../../src/server/content";
import { editorUser, sessionClient } from "../../src/server/supabase";

type Props = { email: string; initial: Snapshot };
type Notice = { text: string; status?: number };

const labels: Record<Section, string> = { articles: "Blog", members: "Members", about: "About Us" };
const publicPaths: Record<Section, string> = { articles: "/blog/", members: "/members/", about: "/about-us/" };

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  res.setHeader("Cache-Control", "private, no-store");
  const client = sessionClient(req, res);
  const editor = client && await editorUser(client);
  if (!client || !editor) return { redirect: { destination: "/login/", permanent: false } };
  return { props: { email: editor.email, initial: await getSnapshot(client) } };
};

export default function Editor({ email, initial }: Props) {
  const [section, setSection] = useState<Section>("articles");
  const [published, setPublished] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [pending, setPending] = useState<"publish" | "logout" | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const signedOut = useRef(false);

  const dirty = (key: Section) => draft[key].data !== published[key].data;
  const hasUnsavedChanges = sections.some(dirty);

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const warn = (event: BeforeUnloadEvent) => {
      if (signedOut.current) return;
      event.preventDefault();
      event.returnValue = true;
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [hasUnsavedChanges]);

  function update<K extends Section>(key: K, data: Content[K]) {
    setDraft((previous) => ({ ...previous, [key]: { ...previous[key], data } }));
    setNotice(null);
  }

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !dirty(section)) return;
    setPending("publish");
    setNotice(null);
    try {
      const response = await postJson(`/api/editor/${section}/`, draft[section]);
      if (!response.ok) {
        setNotice({ text: await requestError(response, "Publishing failed. Please try again."), status: response.status });
      } else {
        const saved: Revision<Section> = await response.json();
        setPublished((previous) => ({ ...previous, [section]: saved }));
        setDraft((previous) => ({ ...previous, [section]: saved }));
        setNotice({ text: `${labels[section]} was published.` });
      }
    } catch {
      setNotice({ text: "The server could not be reached. Please try again.", status: 500 });
    } finally {
      setPending(null);
    }
  }

  async function logout() {
    if (pending || (hasUnsavedChanges && !window.confirm("Sign out and discard your unpublished changes?"))) return;
    setPending("logout");
    setNotice(null);
    try {
      const response = await postJson("/api/session/logout/", {});
      if (response.ok) {
        signedOut.current = true;
        window.location.replace("/login/");
        return;
      }
      setNotice({ text: await requestError(response, "Sign-out failed. Please try again."), status: response.status });
    } catch {
      setNotice({ text: "The server could not be reached. Please try again.", status: 500 });
    }
    setPending(null);
  }

  return (
    <PageLayout PAGE_SEO={{ title: "Content editor" }}>
      <Head><meta name="robots" content="noindex, nofollow" /></Head>
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-28 md:pt-12">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Content editor</h1>
            <p className="mt-1 break-all text-sm text-slate-600 dark:text-slate-300">{email}</p>
          </div>
          <button type="button" className={secondaryButton} disabled={Boolean(pending)} onClick={logout}>
            {pending === "logout" ? "Signing out…" : "Sign out"}
          </button>
        </header>
        <nav className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3 dark:border-slate-700" aria-label="Content sections">
          {sections.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={section === key}
              disabled={Boolean(pending)}
              className="rounded-lg px-3 py-2 text-base font-medium hover:bg-slate-200 aria-pressed:bg-sky-700 aria-pressed:text-white dark:hover:bg-slate-700 dark:aria-pressed:bg-sky-700"
              onClick={() => {
                setSection(key);
                setNotice(null);
              }}
            >
              {labels[key]}{dirty(key) && <span className="text-sm"> (unsaved)</span>}
            </button>
          ))}
        </nav>
        <form method="post" onSubmit={publish}>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <h2 className="mr-auto text-2xl font-semibold">{labels[section]}</h2>
            <a className="px-1 text-sm font-medium text-sky-700 underline dark:text-sky-300" href={publicPaths[section]} target="_blank" rel="noreferrer">View public page</a>
            {dirty(section) && (
              <button type="button" disabled={Boolean(pending)} className={secondaryButton} onClick={() => {
                if (!window.confirm(`Discard your changes to ${labels[section]}?`)) return;
                setDraft((previous) => ({ ...previous, [section]: published[section] }));
                setResetKey((key) => key + 1);
                setNotice(null);
              }}>Discard changes</button>
            )}
            <button type="submit" className={primaryButton} disabled={Boolean(pending) || !dirty(section)}>
              {pending === "publish" ? "Publishing…" : "Publish changes"}
            </button>
          </div>
          {notice && (
            <p role={notice.status ? "alert" : "status"} className={`mb-4 rounded-lg px-4 py-3 text-base ${notice.status
              ? "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"
              : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"}`}>
              {notice.text}{" "}
              {notice.status === 401 && <a href="/login/" target="_blank" rel="noreferrer" className="underline">Sign in in a new tab</a>}
              {notice.status === 409 && <a href="/editor/" target="_blank" rel="noreferrer" className="underline">Open the latest editor</a>}
            </p>
          )}
          <fieldset key={resetKey} disabled={Boolean(pending)} className="min-w-0">
            {section === "articles" && <ArticlesEditor data={draft.articles.data} published={published.articles.data} onChange={(data) => update("articles", data)} />}
            {section === "members" && <MembersEditor data={draft.members.data} onChange={(data) => update("members", data)} />}
            {section === "about" && <AboutEditor data={draft.about.data} onChange={(data) => update("about", data)} />}
          </fieldset>
        </form>
      </main>
    </PageLayout>
  );
}
