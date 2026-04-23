"use client";

import type { FocusEventHandler } from "react";

export interface MultiverseSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  "aria-label"?: string;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  autoComplete?: string;
  /** Capsule style for compact nav / headers */
  variant?: "default" | "pill";
}

/**
 * Dark glass search input (matches /characters filter search styling).
 * Reusable for Characters hub, home hero, and other Multiverse-themed surfaces.
 */
export default function MultiverseSearchField({
  value,
  onChange,
  placeholder = "Search…",
  id = "multiverse-search",
  name,
  disabled = false,
  className = "",
  inputClassName = "",
  "aria-label": ariaLabel,
  onFocus,
  onBlur,
  autoComplete = "off",
  variant = "default",
}: MultiverseSearchFieldProps) {
  const isPill = variant === "pill";
  const wrap = isPill
    ? `relative w-full rounded-full border border-white/10 bg-black/45 backdrop-blur-md ${className}`.trim()
    : `relative w-full ${className}`.trim();
  const inputClasses = isPill
    ? `w-full rounded-full border-0 bg-transparent py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-0 focus:outline-none focus:ring-2 focus:ring-brand/25 disabled:opacity-50 ${inputClassName}`.trim()
    : `w-full rounded-xl border border-white/10 bg-black/50 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-zinc-500 focus:border-brand/40 focus:outline-none focus:ring-1 focus:ring-brand/30 disabled:opacity-50 ${inputClassName}`.trim();

  return (
    <div className={wrap}>
      <svg
        className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 ${isPill ? "left-3.5" : "left-3"}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        id={id}
        name={name}
        type="search"
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel ?? placeholder}
        className={inputClasses}
      />
    </div>
  );
}
