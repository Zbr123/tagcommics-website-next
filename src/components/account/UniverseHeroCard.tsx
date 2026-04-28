"use client";

import Image from "next/image";

interface UniverseHeroCardProps {
  userName: string;
  userEmail: string;
}

const HERO_STATS = [
  { label: "Downloads", value: "37" },
  { label: "Favorites", value: "54" },
];

export default function UniverseHeroCard({ userName, userEmail }: UniverseHeroCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(88,232,193,0.12),transparent_45%),#070b10] p-6 shadow-[0_18px_46px_rgba(0,0,0,0.45)] sm:p-8">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full border border-white/15 ring-2 ring-[#58E8C1]/30">
          <Image src="/admin.png" alt="Profile avatar" fill className="object-cover" sizes="64px" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#58E8C1]">Premium Member</p>
          <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">{userName}</h1>
          <p className="text-sm text-zinc-400">{userEmail}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {HERO_STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/10 bg-[#0e141d] px-4 py-4 transition hover:border-[#58E8C1]/30 hover:shadow-[0_0_20px_rgba(88,232,193,0.16)]"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
