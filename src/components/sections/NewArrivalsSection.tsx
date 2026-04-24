import Link from "next/link";
import Image from "next/image";

export interface LatestRelease {
  id: number;
  title: string;
  image: string;
  /** e.g. "#42" */
  issue: string;
  genre: string;
  /** e.g. "Ongoing", "New Issue", "Completed" */
  status: string;
}

interface NewArrivalsSectionProps {
  releases: LatestRelease[];
}

/**
 * Homepage “Latest Releases” — one row grid; cover hover matches CharacterGridCard (glass, scale, gradient).
 */
export default function NewArrivalsSection({ releases }: NewArrivalsSectionProps) {
  return (
    <section className="bg-black py-12 md:py-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between md:mb-12">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl md:text-4xl">
              <span className="text-white">Latest</span>{" "}
              <span className="text-brand">Releases</span>
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400 md:text-base">
              Fresh off the digital press this week.
            </p>
          </div>
          <Link
            href="/new-releases"
            className="group inline-flex shrink-0 items-center gap-1 text-sm font-bold text-brand transition-colors hover:text-white sm:text-base"
          >
            View All
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-black via-zinc-950 to-black p-6 md:p-8 lg:p-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-4 lg:gap-8">
            {releases.map((item) => (
              <Link
                key={item.id}
                href={`/reader/${item.id}`}
                className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-2xl glass-card">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-all duration-700 ease-out opacity-80 group-hover:scale-110 group-hover:opacity-100"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                    aria-hidden
                  />
                  <span className="absolute right-3 top-3 z-10 rounded-lg border border-white/15 bg-black/55 px-2.5 py-1 text-[11px] font-bold tabular-nums tracking-wide text-white backdrop-blur-sm">
                    {item.issue}
                  </span>
                </div>

                <div className="mt-4 translate-y-1 px-0.5 transition-transform duration-500 group-hover:translate-y-0">
                  <h3 className="text-base font-bold leading-snug text-white md:text-lg">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-zinc-400 transition-colors duration-500 group-hover:text-zinc-300">
                    {item.genre}
                    <span className="text-zinc-600"> • </span>
                    {item.status}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
