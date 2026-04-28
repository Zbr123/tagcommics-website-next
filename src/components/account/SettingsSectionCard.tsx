"use client";

import type { ReactNode } from "react";

interface SettingsSectionCardProps {
  id: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function SettingsSectionCard({ id, title, subtitle, children }: SettingsSectionCardProps) {
  return (
    <section id={id} className="scroll-mt-28 rounded-2xl border border-white/10 bg-[#070b10] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.45)] sm:p-7">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#58E8C1]">{title}</p>
        <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">{subtitle}</h2>
      </header>
      {children}
    </section>
  );
}
