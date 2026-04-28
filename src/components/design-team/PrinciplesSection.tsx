"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFingerprint } from "@fortawesome/free-solid-svg-icons";

interface Principle {
  title: string;
  body: string;
  icon: "eye" | "fingerprint";
}

const PRINCIPLES: Principle[] = [
  {
    title: "Cinematic Clarity",
    body: "Every screen is treated as a master shot. We remove clutter to let the artwork breathe, using negative space as a primary design tool.",
    icon: "eye",
  },
  {
    title: "Tactile Digital",
    body: "Interactions should feel grounded. We use subtle blurs, deep shadows, and precise haptics to give digital elements physical weight.",
    icon: "fingerprint",
  },
];

export default function PrinciplesSection() {
  return (
    <div>
      <h2 className="text-[42px] font-black uppercase leading-[0.95] tracking-tight text-white md:text-4xl">
        Our <span className="text-[#58E8C1]">Principles</span>
      </h2>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">The Rules of Engagement</p>

      <div className="mt-10 grid grid-cols-1 gap-6">
        {PRINCIPLES.map((item) => (
          <article
            key={item.title}
            className="group min-h-[182px] rounded-3xl border border-white/10 bg-[#05070b] p-6 transition-all duration-300 hover:-translate-y-[6px] hover:border-brand/30  md:p-7"
          >
            <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#58E8C1]/25 bg-black/35 text-[#58E8C1]">
              <FontAwesomeIcon icon={item.icon === "eye" ? faEye : faFingerprint} className="h-[15px] w-[15px]" />
            </div>
            <h3 className="text-[34px] font-bold leading-none text-white md:text-4xl">{item.title}</h3>
            <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-zinc-400">{item.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
