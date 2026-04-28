"use client";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionHeading({ eyebrow, title, subtitle, align = "left" }: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <header className={`mb-10 flex flex-col gap-3 ${alignClass}`}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand/90 sm:text-sm">{eyebrow}</p>
      ) : null}
      <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
      {subtitle ? <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">{subtitle}</p> : null}
    </header>
  );
}
