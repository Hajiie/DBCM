import { useState, type ReactNode } from "react";
import { articlePath, categories, memberGroups, type About, type Article, type Member } from "../../content/model";
import ContentMarkdown from "../ContentMarkdown";
import { primaryButton, secondaryButton, SelectField, TextField } from "./Fields";

function CollectionEditor<T extends string | number>({ entries, selected, onSelect, label, onAdd, children }: {
  entries: { id: T; title: string; meta: string }[];
  selected: T | undefined;
  onSelect: (id: T) => void;
  label: string;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <div>
        <button type="button" className={`${secondaryButton} mb-3 w-full`} onClick={onAdd}>{label}</button>
        <ul className="max-h-72 space-y-2 overflow-y-auto md:max-h-[36rem]">
          {entries.map(({ id, title, meta }) => (
            <li key={id}>
              <button
                type="button"
                aria-pressed={id === selected}
                onClick={() => onSelect(id)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-left hover:border-sky-500 aria-pressed:border-sky-600 aria-pressed:bg-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:aria-pressed:bg-slate-700"
              >
                <span className="block break-words text-base font-semibold">{title}</span>
                <span className="block text-sm text-slate-600 dark:text-slate-300">{meta}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
        {children}
      </div>
    </div>
  );
}

function MarkdownField({ label, value, onChange, maxLength, required }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  required?: boolean;
}) {
  return (
    <div>
      <TextField label={label} value={value} onChange={onChange} rows={10} maxLength={maxLength} required={required} />
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Markdown supports headings, lists, links and images.</p>
      {value && (
        <details className="mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-600">
          <summary className="cursor-pointer text-sm font-semibold">Preview</summary>
          <ContentMarkdown className="mt-3">{value}</ContentMarkdown>
        </details>
      )}
    </div>
  );
}

export function ArticlesEditor({ data, published, onChange }: {
  data: Article[];
  published: Article[];
  onChange: (value: Article[]) => void;
}) {
  const [selected, select] = useState(0);
  const article = data[selected];
  const original = article && published.find((entry) => articlePath(entry) === articlePath(article));
  const update = (patch: Partial<Article>) => onChange(data.map((entry, index) => index === selected ? { ...entry, ...patch } : entry));

  function add() {
    const today = new Date();
    const date = new Date(today.getTime() - today.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
    onChange([...data, {
      route: "blog", slug: "post-" + crypto.randomUUID().slice(0, 12), title: "", summary: "", body: "",
      author: "DBCM Lab", category: "News", tags: "", date, image: "", featured: false,
    }]);
    select(data.length);
  }

  return (
    <CollectionEditor
      entries={data.map((entry, id) => ({ id, title: entry.title || "Untitled article", meta: `${entry.category} · ${entry.date}` }))}
      selected={selected}
      onSelect={select}
      label="New article"
      onAdd={add}
    >
      {article ? (
        <div className="space-y-4">
          <TextField label="Title" value={article.title} onChange={(title) => update({ title })} maxLength={240} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Category" value={article.category} options={categories} onChange={(category) => update({ category })} />
            <TextField label="Publication date" type="date" value={article.date} onChange={(date) => update({ date })} required />
            <TextField label="Author" value={article.author} onChange={(author) => update({ author })} maxLength={120} required />
            <TextField label="URL slug" value={article.slug} onChange={(slug) => update({ slug })} maxLength={80} required readOnly={Boolean(original)} />
          </div>
          {original && <a className="block text-sm text-sky-700 underline dark:text-sky-300" href={articlePath(original)} target="_blank" rel="noreferrer">View published article</a>}
          <TextField label="Summary" value={article.summary} onChange={(summary) => update({ summary })} maxLength={600} rows={3} required />
          <TextField label="Cover image URL" value={article.image} onChange={(image) => update({ image })} maxLength={500} placeholder="/images/example.jpg or https://…" />
          <TextField label="Tags" value={article.tags} onChange={(tags) => update({ tags })} maxLength={240} placeholder="Use commas between tags" />
          <label className="flex items-center gap-2 text-base">
            <input type="checkbox" checked={article.featured} onChange={(event) => update({ featured: event.currentTarget.checked })} />
            Feature on the homepage
          </label>
          <MarkdownField label="Article body" value={article.body} onChange={(body) => update({ body })} maxLength={40000} required />
          <button type="button" className="text-sm font-medium text-red-700 underline dark:text-red-300" onClick={() => {
            onChange(data.filter((_, index) => index !== selected));
            select(Math.max(0, selected - 1));
          }}>Remove article</button>
        </div>
      ) : <p>Select or create an article to start editing.</p>}
    </CollectionEditor>
  );
}

export function MembersEditor({ data, onChange }: { data: Member[]; onChange: (value: Member[]) => void }) {
  const [selected, select] = useState<string | undefined>(data[0]?.id);
  const member = data.find((entry) => entry.id === selected);
  const update = (patch: Partial<Member>) => onChange(data.map((entry) => entry.id === selected ? { ...entry, ...patch } : entry));

  function add() {
    const id = crypto.randomUUID();
    onChange([...data, { id, group: "Researchers", name: "", tenure: "", image: "", bio: "" }]);
    select(id);
  }

  return (
    <CollectionEditor
      entries={data.map((entry) => ({ id: entry.id, title: entry.name || "Unnamed member", meta: entry.group }))}
      selected={selected}
      onSelect={select}
      label="New member"
      onAdd={add}
    >
      {member ? (
        <div className="space-y-4">
          <TextField label="Name" value={member.name} onChange={(name) => update({ name })} maxLength={160} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Group" value={member.group} options={memberGroups} onChange={(group) => update({ group })} />
            <TextField label="Tenure" value={member.tenure} onChange={(tenure) => update({ tenure })} maxLength={120} />
          </div>
          <TextField label="Photo URL" value={member.image} onChange={(image) => update({ image })} maxLength={500} placeholder="/images/members_img/example.png or https://…" />
          <MarkdownField label="Biography and contact details" value={member.bio} onChange={(bio) => update({ bio })} maxLength={4000} />
          <button type="button" className="text-sm font-medium text-red-700 underline dark:text-red-300" onClick={() => {
            const remaining = data.filter((entry) => entry.id !== selected);
            onChange(remaining);
            select(remaining[0]?.id);
          }}>Remove member</button>
        </div>
      ) : <p>Select or add a member to start editing.</p>}
    </CollectionEditor>
  );
}

export function AboutEditor({ data, onChange }: { data: About; onChange: (value: About) => void }) {
  return (
    <div className="max-w-3xl space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
      <TextField label="Page title" value={data.title} onChange={(title) => onChange({ ...data, title })} maxLength={160} required />
      <TextField label="Subtitle" value={data.subtitle} onChange={(subtitle) => onChange({ ...data, subtitle })} maxLength={300} />
      <MarkdownField label="About Us body" value={data.body} onChange={(body) => onChange({ ...data, body })} maxLength={40000} required />
    </div>
  );
}
