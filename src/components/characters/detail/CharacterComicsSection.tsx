import Image from "next/image";
import Link from "next/link";
import type { CharacterComic } from "@/src/data/characterDetailProfile";
import DetailSectionHeading from "./DetailSectionHeading";
import DetailSectionShell from "./DetailSectionShell";

function ComicCard({ comic }: { comic: CharacterComic }) {
  const readHref = `/reader/${comic.catalogComicId ?? comic.id}`;

  const cover = (
    <>
      <Image
        src={comic.image}
        alt={comic.title}
        fill
        className="object-cover opacity-85 transition-all duration-700 ease-out group-hover/card:scale-[1.06] group-hover/card:opacity-100"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent opacity-90 transition-opacity duration-500 group-hover/card:opacity-100"
        aria-hidden
      />
      <span className="absolute right-3 top-3 z-10 rounded-lg border border-white/15 bg-black/55 px-2.5 py-1 text-[11px] font-bold tabular-nums tracking-wide text-white backdrop-blur-sm">
        {comic.issue}
      </span>
    </>
  );

  const coverBlock = (
    <Link
      href={readHref}
      className="relative block aspect-[2/3] overflow-hidden rounded-2xl glass-card focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
    >
      <span className="sr-only">{comic.title} — open reader</span>
      {cover}
    </Link>
  );

  return (
    <article className="group/card flex flex-col">
      <div className="relative transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform [transition-property:transform,box-shadow] group-hover/card:-translate-y-1 group-hover/card:shadow-[0_24px_56px_rgba(0,0,0,0.55),0_0_40px_rgba(88,232,193,0.12)]">
        {coverBlock}
      </div>

      <div className="mt-4 translate-y-1 px-0.5 transition-transform duration-500 group-hover/card:translate-y-0">
        <Link
          href={readHref}
          className="block text-base font-bold leading-snug text-white transition-colors hover:text-brand md:text-lg"
        >
          {comic.title}
        </Link>
        <p className="mt-1.5 text-sm text-zinc-400 transition-colors duration-500 group-hover/card:text-zinc-300">
          {comic.genre}
          <span className="text-zinc-600"> • </span>
          {comic.status}
        </p>
        <Link
          href={readHref}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-brand/45 bg-brand/10 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] text-brand transition hover:border-brand hover:bg-brand hover:text-brand-foreground hover:shadow-[0_0_28px_rgba(88,232,193,0.35)] active:scale-[0.99]"
        >
          Read Now
        </Link>
      </div>
    </article>
  );
}

export default function CharacterComicsSection({ comics }: { comics: CharacterComic[] }) {
  return (
    <DetailSectionShell>
      <div className="mb-10 md:mb-14 lg:mb-16">
        <DetailSectionHeading white="FEATURED " brand="COMICS" align="left" className="!tracking-tight" />
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-500 md:text-base">
          Issues and volumes spotlighting this character in the catalog.
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-black via-zinc-950 to-black p-6 md:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {comics.map((comic) => (
            <ComicCard key={comic.id} comic={comic} />
          ))}
        </div>
      </div>
    </DetailSectionShell>
  );
}
