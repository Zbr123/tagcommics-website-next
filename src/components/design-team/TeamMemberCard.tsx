"use client";

import Image from "next/image";

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  portrait: string;
}

interface TeamMemberCardProps {
  member: TeamMember;
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <article className="group h-[500px] overflow-hidden rounded-3xl border border-white/10 bg-[#070b0f] shadow-[0_20px_44px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-[6px] hover:border-brand-300/40">
      <div className="relative h-[280px] w-full overflow-hidden md:h-[300px]">
        <Image
          src={member.portrait}
          alt={`${member.name} portrait`}
          fill
          className="object-cover grayscale brightness-75 transition duration-500 ease-out group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100"
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 40vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="flex h-[calc(100%-280px)] flex-col justify-start bg-[#070b0f] p-6 md:h-[calc(100%-300px)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#58E8C1]">{member.role}</p>
        <h3 className="mt-3 text-2xl font-black leading-tight text-white md:text-3xl">{member.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400 md:text-base">{member.bio}</p>
      </div>
    </article>
  );
}
