import type { ReactNode } from "react";

export default function DetailSectionShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`border-t border-white/[0.05] bg-black py-24 md:py-32 lg:py-40 ${className}`.trim()}
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-14">{children}</div>
    </section>
  );
}
