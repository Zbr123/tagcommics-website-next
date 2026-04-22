import Link from "next/link";
import Image from "next/image";
import type { Character, CharacterRole } from "@/src/data/characters";

const roleBadgeLabel: Record<CharacterRole, string> = {
  HERO: "HERO",
  VILLAIN: "VILLAIN",
  ANTI_HERO: "ANTI-HERO",
  ENTITY: "ENTITY",
};

const roleBadgeClass: Record<CharacterRole, string> = {
  HERO:
    "bg-brand/12 border border-brand/25 text-brand",

  VILLAIN:
    "bg-red-500/12 border border-red-400/25 text-red-300",

  ANTI_HERO:
    "bg-teal-500/12 border border-teal-400/25 text-teal-300",

  ENTITY:
    "bg-zinc-500/12 border border-zinc-300/15 text-zinc-300",
};

export default function CharacterGridCard({ character }: { character: Character }) {
  const badge = roleBadgeClass[character.role];
  const label = roleBadgeLabel[character.role];

  return (
    <Link
      href={`/characters/${character.slug}`}
      className="group relative aspect-[2/3] rounded-2xl overflow-hidden glass-card block"
    >
      {/* Image */}
      <Image
        src={character.image}
        alt={character.name}
        fill
        className="w-full h-full object-cover transition-all duration-700 ease-out 
                   group-hover:scale-110 opacity-80 group-hover:opacity-100"
      />
  
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t 
                   from-dark-900 via-dark-900/40 to-transparent 
                   opacity-90 group-hover:opacity-100 
                   transition-opacity duration-500"
      />
  
      {/* Content */}
      <div
        className="absolute bottom-0 left-0 right-0 p-5 
                   transform translate-y-2 group-hover:translate-y-0 
                   transition-transform duration-500"
      >
    <span
  className={`rounded-lg px-3 py-1 text-[11px] font-bold tracking-wider backdrop-blur-sm ${badge}`}
>
  {label}
</span>
  
        <h3 className="text-lg md:text-xl font-bold text-white leading-tight mt-2">
          {character.name}
        </h3>
  
        <p className="text-sm text-zinc-400">
          {character.universe}
        </p>
      </div>
    </Link>
  );
}
