"use client";

import Image from "next/image";

/** Cinematic hero for /characters — layers: scaled dimmed image, gradient, centered copy. */
export default function MultiverseHero() {
  return (
    <section className="relative flex min-h-[85vh] w-full max-h-[920px] flex-col overflow-hidden bg-black md:min-h-[88vh]">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/homepageimage.png"
          alt=""
          fill
          priority
          className="scale-105 object-cover opacity-50"
          sizes="100vw"
        />
        <div className="hero-gradient absolute inset-0" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-center px-6 pb-28 pt-16 text-center md:pb-0 md:pt-40">
        <span
          className="mb-4 inline-block rounded-full border border-cyan-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-transparent"
          style={{ color: "rgb(93, 214, 182)" }}
        >
          The Multiverse Hub
        </span>
        <h1 className="text-glow mb-6 max-w-4xl text-5xl font-black leading-tight tracking-tighter text-white md:text-7xl">
  Discover Legendary
  <br />
  <span className="bg-gradient-to-r from-[#22E6D6] via-[#6EF3E7] to-[#EAFDFC] bg-clip-text text-transparent">
    Characters
  </span>
</h1>
        <p className="max-w-2xl text-lg font-medium text-gray-400 md:text-xl">
          Explore the vast universe of heroes, villains, and cosmic entities. Find your next favorite story.
        </p>
      </div>
    </section>
  );
}
