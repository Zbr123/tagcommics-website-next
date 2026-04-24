import Image from "next/image";
import Link from "next/link";
import type { RelatedEntity } from "@/src/data/characterDetailProfile";
import DetailSectionHeading from "./DetailSectionHeading";
import DetailSectionShell from "./DetailSectionShell";

export default function CharacterRelatedEntities({ entities }: { entities: RelatedEntity[] }) {
  return (
    <DetailSectionShell className="pb-16 md:pb-24 lg:pb-28">
      <DetailSectionHeading white="RELATED " brand="ENTITIES" className="mb-14 md:mb-20 lg:mb-24" />
      <div className="-mx-2 flex gap-8 overflow-x-auto px-2 pb-4 pt-2 md:gap-10 lg:justify-center lg:overflow-visible">
        {entities.map((e) => (
          <Link
            key={e.slug}
            href={`/characters/${e.slug}`}
            className="group flex min-w-[6.5rem] shrink-0 flex-col items-center text-center sm:min-w-[7.5rem]"
          >
            <div className="relative">
              <div
                className="absolute -inset-1 rounded-full opacity-0 blur-md transition duration-500 group-hover:opacity-100"
                style={{
                  background: "radial-gradient(circle, rgba(88,232,193,0.45) 0%, transparent 70%)",
                }}
                aria-hidden
              />
              <div
                className="relative h-[5.5rem] w-[5.5rem] overflow-hidden rounded-full border border-white/[0.1] bg-zinc-900 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.55)] transition duration-500 group-hover:border-brand/50 group-hover:shadow-[0_0_0_2px_rgba(88,232,193,0.35),0_0_40px_rgba(88,232,193,0.2),0_24px_60px_rgba(0,0,0,0.6)] sm:h-28 sm:w-28 md:h-32 md:w-32"
              >
                <Image
                  src={e.image}
                  alt={e.name}
                  fill
                  className="object-cover transition duration-700 ease-out group-hover:scale-110"
                  sizes="128px"
                />
              </div>
            </div>
            <p className="mt-4 max-w-[10rem] truncate text-sm font-bold text-white transition group-hover:text-brand md:text-base">
              {e.name}
            </p>
            <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500 md:text-[11px]">
              {e.relation}
            </p>
          </Link>
        ))}
      </div>
    </DetailSectionShell>
  );
}
