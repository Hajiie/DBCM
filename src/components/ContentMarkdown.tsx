import Markdown, { defaultUrlTransform, type UrlTransform } from "react-markdown";

const safeUrl: UrlTransform = (url, key) => {
  if (/^[\\/]{2}|\\/.test(url)) return "";
  if (key === "src") return /^(https:\/\/|\/images\/)/i.test(url) ? url : "";
  return /^tel:\+[\d-]+$|^tel:[\d-]+$/.test(url) ? url : defaultUrlTransform(url);
};

export default function ContentMarkdown({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={`prose prose-slate max-w-none break-words dark:prose-invert prose-img:rounded-xl ${className}`}>
      <Markdown
        skipHtml
        urlTransform={safeUrl}
        components={{
          img: ({ src, alt, title }) => src
            ? <img src={src} alt={alt ?? ""} title={title} loading="lazy" referrerPolicy="no-referrer" />
            : null,
        }}
      >
        {children}
      </Markdown>
    </div>
  );
}
