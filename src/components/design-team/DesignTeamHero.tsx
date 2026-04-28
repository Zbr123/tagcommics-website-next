"use client";

export default function DesignTeamHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-28 sm:px-6 sm:pt-32 lg:px-10 lg:pt-36">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(88,232,193,0.22),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0),rgba(0,0,0,0.65))]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.24)_0,rgba(255,255,255,0.24)_1px,transparent_1px,transparent_3px)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col items-center text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand/95 sm:text-sm">The Architects</p>
        <h1 className="mt-6 text-5xl font-black uppercase tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
          <span className="block">Forging</span>
          <span className="block from-cyan-200 via-brand to-teal-300 text-brand bg-clip-text )]">
            Universes
          </span>
        </h1>
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base lg:text-lg">
          We are the visual storytellers, the digital inkers, and the creative minds behind the next generation of
          comic experiences.
        </p>
      </div>
    </section>
  );
}
