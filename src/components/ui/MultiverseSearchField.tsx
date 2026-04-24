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
  const hasQuery = value.trim().length > 0;

  const wrap = isPill
    ? [
        "group relative w-full rounded-full border bg-black/45 backdrop-blur-md",
        "border-white/12 shadow-sm shadow-black/10",
        "transition-[border-color,box-shadow,background-color] duration-200 ease-out",
        "hover:border-white/32 hover:bg-black/55 hover:shadow-md hover:shadow-black/25",
        "focus-within:border-brand/55 focus-within:bg-black/60 focus-within:shadow-lg focus-within:shadow-black/30",
        "focus-within:ring-2 focus-within:ring-brand/35 focus-within:ring-offset-0",
        hasQuery ? "border-white/26" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")
        .trim()
    : `relative w-full ${className}`.trim();

  const inputClasses = isPill
    ? [
        "w-full rounded-full border-0 bg-transparent py-2.5 pl-10 pr-4",
        "text-sm text-white placeholder:text-zinc-500",
        "font-normal tracking-tight transition-[font-weight,color] duration-150 ease-out",
        hasQuery ? "font-medium" : "",
        "focus:font-semibold focus:text-white focus:outline-none focus:ring-0",
        "placeholder:transition-colors group-hover:placeholder:text-zinc-400",
        "disabled:opacity-50",
        inputClassName,
      ]
        .filter(Boolean)
        .join(" ")
        .trim()
    : `w-full rounded-xl border border-white/10 bg-black/50 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-zinc-500 focus:border-brand/40 focus:outline-none focus:ring-1 focus:ring-brand/30 disabled:opacity-50 ${inputClassName}`.trim();

  return (
    <div className={wrap}>
      <svg
        className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 transition-[color,transform] duration-200 ${
          isPill
            ? "left-3.5 text-zinc-500 group-hover:text-zinc-300 group-focus-within:text-brand group-focus-within:scale-105"
            : "left-3 text-zinc-500"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={isPill ? 2.25 : 2}
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
