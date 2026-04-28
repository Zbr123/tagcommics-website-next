"use client";

import { useState } from "react";
import type { LoreAccordionItem } from "@/src/data/characterDetailProfile";
import DetailSectionHeading from "./DetailSectionHeading";
import DetailSectionShell from "./DetailSectionShell";

export default function CharacterLoreAccordion({ items }: { items: LoreAccordionItem[] }) {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <DetailSectionShell className="py-16 md:py-20 lg:py-24">
      <DetailSectionHeading white="ORIGIN & " brand="LORE" className="mb-8 text-center sm:mb-10 md:mb-12 !text-3xl sm:!text-4xl md:!text-[2.7rem] lg:!text-5xl !tracking-[0.03em]" />
      <div className="mx-auto max-w-4xl space-y-3.5">
        {items.map((item) => {
          const open = openIds.includes(item.id);
          return (
            <div
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/70 to-black/70 shadow-[0_12px_38px_rgba(0,0,0,0.4)] backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-300 hover:border-brand/35 hover:shadow-[0_16px_44px_rgba(0,0,0,0.45),0_0_24px_rgba(88,232,193,0.08)]"
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4.5 text-left sm:px-6 sm:py-5"
                aria-expanded={open}
              >
                <span className="text-[1.05rem] font-black uppercase tracking-[0.08em] text-white transition-colors duration-300 group-hover:text-brand sm:text-lg">
                  {item.title}
                </span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center text-brand transition duration-300 ${
                    open
                      ? "rotate-180"
                      : ""
                  } group-hover:scale-110`}
                  aria-hidden
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div
                className={`overflow-hidden border-white/[0.06] transition-all duration-500 ease-out motion-reduce:transition-none ${
                  open ? "max-h-[32rem] border-t opacity-100" : "max-h-0 border-t border-transparent opacity-0"
                }`}
              >
                <p className="whitespace-pre-line px-5 pb-5 pt-4 text-base font-medium leading-8 text-zinc-300 sm:px-6 sm:pb-6 sm:pt-4.5 sm:text-[1.02rem]">
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
