import { useState, type FormEvent } from "react";
import { MdOutlineClose } from "react-icons/md";
import type { iArticle } from "../../shared/interfaces";
import { combineClasses } from "../../utils/utils";
import ArticleCard from "../ArticleCards/ArticleCard";
import classes from "./Search.module.scss";

export default function Search({ closeSearch }: { closeSearch: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<iArticle[] | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim() || pending) return;
    setPending(true);
    setError("");
    setResults(null);
    try {
      const response = await fetch("/api/articles/?q=" + encodeURIComponent(query.trim()));
      if (!response.ok) throw new Error();
      setResults(await response.json());
    } catch {
      setError("Search is temporarily unavailable. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div role="dialog" aria-modal="true" aria-label="Search articles" className={combineClasses("bg-slate-100 text-black dark:bg-slate-900 dark:text-white", classes.search_container)}>
      <div className="container mx-auto px-3">
        <div className="flex items-center justify-between pt-5 md:pt-10">
          <h2 className="text-3xl font-semibold">Search articles</h2>
          <button aria-label="Close search" type="button" className={classes.search_close_icon} onClick={closeSearch}>
            <MdOutlineClose className="text-4xl text-slate-800 dark:text-white" />
          </button>
        </div>
        <form className="mb-8 mt-4 flex flex-wrap gap-2" onSubmit={search}>
          <input type="search" aria-label="Search terms" autoFocus maxLength={160}
            className="min-w-0 flex-1 rounded-md border border-slate-400 bg-transparent p-2 text-base"
            placeholder="Search titles, authors or tags" value={query} onChange={(event) => setQuery(event.currentTarget.value)} />
          <button type="submit" className="rounded-md bg-sky-700 px-4 py-2 text-base text-white disabled:opacity-50" disabled={pending || !query.trim()}>
            {pending ? "Searching…" : "Search"}
          </button>
        </form>
        {error && <p role="alert">{error}</p>}
        {results?.length === 0 && <p role="status">No articles found.</p>}
        {results && <div className="flex flex-wrap">{results.map(({ path, preview }) => <ArticleCard key={path} article={preview} path={path} />)}</div>}
      </div>
    </div>
  );
}
