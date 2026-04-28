"use client";

import TeamMemberCard, { type TeamMember } from "./TeamMemberCard";

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Alex Chen",
    role: "Lead Designer",
    bio: "Shapes visual systems that blend classic comic language with modern product clarity.",
    portrait: "/alex-pic.jpg",
  },
  {
    name: "Sarah Jenkins",
    role: "Art Director",
    bio: "Guides palettes, composition, and storytelling tone across every launch.",
    portrait: "/team-girl.jpg",
  },
  {
    name: "Marcus Cole",
    role: "UX Architect",
    bio: "Builds frictionless journeys that keep readers immersed from first click to final panel.",
    portrait: "/Marcus.jpg",
  },
  {
    name: "Elena Rostova",
    role: "Motion Designer",
    bio: "Adds cinematic timing and interaction polish to every interface transition.",
    portrait: "/Alena-team.jpg",
  },
];

export default function TeamRoster() {
  return (
    <section className="px-6 pb-12 pt-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <header className="mb-12">
          <h2 className="text-[2.6rem] font-black uppercase leading-[0.95] tracking-tight text-white sm:text-6xl md:text-4xl">
            THE <span className="text-[#58E8C1]">ROSTER</span>
          </h2>
          <p className="mt-4 text-lg font-medium uppercase tracking-[0.08em] text-zinc-300 sm:text-xl md:text-base">
            MEET THE MINDS BEHIND THE INK
          </p>
        </header>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
          {TEAM_MEMBERS.map((member) => (
            <TeamMemberCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
