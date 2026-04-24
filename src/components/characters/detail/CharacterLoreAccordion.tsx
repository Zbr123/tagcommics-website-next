"use client";

import { useState } from "react";
import type { LoreAccordionItem } from "@/src/data/characterDetailProfile";
import DetailSectionHeading from "./DetailSectionHeading";
import DetailSectionShell from "./DetailSectionShell";

export default function CharacterLoreAccordion({ items }: { items: LoreAccordionItem[] }) {
  const [openId, setOpenId] = useState(items[0]?.id ?? "");

  return (
    <DetailSectionShell>
      <DetailSectionHeading white="ORIGIN & " brand="LORE" className="mb-16 md:mb-20 lg:mb-24" />
      <div className="mx-auto max-w-5xl space-y-4 lg:max-w-6xl lg:space-y-5">
        {items.map((item) => {
          const open = openId === item.id;
          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-zinc-950/95 via-black/80 to-zinc-950/90 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl transition hover:border-white/[0.1]"
              style={{ WebkitBackdropFilter: "blur(24px)" }}
            >
              <button
                type="button"
                onClick={() => setOpenId(item.id)}
                className="flex w-full items-center justify-between gap-6 px-8 py-7 text-left md:px-10 md:py-8 lg:px-12 lg:py-9"
                aria-expanded={open}
              >
                <span className="text-base font-black uppercase tracking-[0.2em] text-white md:text-lg">
                  {item.title}
                </span>
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-brand transition duration-300 ${
                    open
                      ? "rotate-180 border-brand/40 bg-brand/15 shadow-[0_0_24px_rgba(88,232,193,0.2)]"
                      : "border-white/10 bg-black/30"
                  }`}
                  aria-hidden
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div
                className={`overflow-hidden border-white/[0.06] transition-all duration-500 ease-out motion-reduce:transition-none ${
                  open ? "max-h-[32rem] border-t opacity-100" : "max-h-0 border-t border-transparent opacity-0"
                }`}
              >
                <p className="px-8 pb-9 pt-6 text-base font-normal leading-relaxed text-zinc-400 md:px-10 md:pb-10 md:pt-7 md:text-lg lg:px-12 lg:pb-12 lg:text-[1.05rem] lg:leading-relaxed">
                  {item.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </DetailSectionShell>
  );
}
