import type { Ref } from "react";

const control = "mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100";

export const primaryButton = "rounded-lg bg-sky-700 px-4 py-2 text-base font-semibold text-white hover:bg-sky-800 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-50";
export const secondaryButton = "rounded-lg border border-slate-300 px-4 py-2 text-base font-medium hover:bg-slate-100 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:hover:bg-slate-800";

type TextProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  type?: "text" | "date" | "email" | "password";
  autoComplete?: string;
  rows?: number;
  textareaRef?: Ref<HTMLTextAreaElement>;
};

export function TextField({ label, value, onChange, rows, textareaRef, type = "text", ...attributes }: TextProps) {
  const shared = { className: control, value, ...attributes };
  return (
    <label className="block text-sm font-semibold">
      {label}
      {rows
        ? <textarea {...shared} ref={textareaRef} rows={rows} onChange={(event) => onChange(event.currentTarget.value)} />
        : <input {...shared} type={type} onChange={(event) => onChange(event.currentTarget.value)} />}
    </label>
  );
}

export function SelectField<T extends string>({ label, value, options, onChange }: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <select className={control} value={value} onChange={(event) => onChange(event.currentTarget.value as T)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}
