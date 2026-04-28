import Image from "next/image";
import Link from "next/link";
import type { RelatedEntity } from "@/src/data/characterDetailProfile";
import DetailSectionShell from "./DetailSectionShell";

export default function CharacterRelatedEntities({ entities }: { entities: RelatedEntity[] }) {
  const relationTone = (relation: string) => {
    const key = relation.trim().toUpperCase();
    if (key === "ALLY") return "text-[#58E8C1]";
    if (key === "NEMESIS") return "text-red-400";
    if (key === "COMPANION") return "text-brand";
    if (key === "MENTOR") return "text-zinc-400";
    return "text-zinc-500";
  };

  return (
    <DetailSectionShell className="pb-16 md:pb-20 lg:pb-24">
      <div className="mb-10 border-t border-white/10 pt-9 md:mb-11 md:pt-10">
        <h2 className="text-left text-[2rem] font-black uppercase tracking-[0.02em] text-white sm:text-[2.15rem]">
          <span className="text-white">Related </span>
          <span className="text-brand">Entities</span>
        </h2>
      </div>
      <div className="-mx-1 flex items-start gap-8 overflow-x-auto px-1 pb-2 md:gap-9">
        {entities.map((e) => (
          <Link
            key={e.slug}
            href={`/characters/${e.slug}`}
            className="group flex w-[5.4rem] shrink-0 flex-col items-center text-center"
          >
            <div className="relative">
              <div
                className="absolute -inset-1 rounded-full opacity-0 blur-md transition duration-500 group-hover:opacity-100"
                style={{
                  background: "radial-gradient(circle, rgba(88,232,193,0.45) 0%, transparent 70%)",
                }}
                aria-hidden
              />
              <div className="relative h-[5.3rem] w-[5.3rem] overflow-hidden rounded-full border border-white/[0.12] bg-zinc-900 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_14px_30px_rgba(0,0,0,0.45)] transition duration-500 group-hover:border-brand/45 group-hover:shadow-[0_0_0_2px_rgba(88,232,193,0.22),0_0_28px_rgba(88,232,193,0.12),0_18px_36px_rgba(0,0,0,0.52)]">
                <Image
                  src={e.image}
                  alt={e.name}
                  fill
                  className="object-cover transition duration-700 ease-out group-hover:scale-110"
                  sizes="128px"
                />
              </div>
            </div>
            <p className="mt-3 w-full truncate text-[1.03rem] font-bold leading-tight text-white transition group-hover:text-brand">
              {e.name}
            </p>
            <p className={`mt-1.5 text-[10px] font-bold uppercase tracking-[0.2em] ${relationTone(e.relation)}`}>
              {e.relation}
            </p>
          </Link>
        ))}
      </div>
    </DetailSectionShell>
  );
}
