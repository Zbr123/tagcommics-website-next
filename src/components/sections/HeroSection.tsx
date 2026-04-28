"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buildReaderHref } from "@/src/lib/readerHref";

/** Hero backgrounds — same URLs and order as before (slider data unchanged). */
const slides = [
  "/homepageimage2.png",
  "/genis-vell.jpg",
];

/** Copy keyed by slide index — presentation only; does not replace slide URLs. */
const featuredBySlide = [
  {
    id: 1,
    exclusive: true,
    genre: "Sci-Fi",
    title1: "Neon Horizon:",
    title2: "The Awakening",
    description:
      "In a cyberpunk metropolis where memories are currency, a rogue detective uncovers a conspiracy that threatens the very fabric of reality.",
    coverImage: "/homepageimage2.png",
    cta: "Read Issue #1",
  },
  {
    id: 2,
    exclusive: true,
    genre: "Cosmic",
    title1: "Genis-Vell:",
    title2: "Legacy in Orbit",
    description:
      "When stellar empires collide, one pilot holds the key to peace—or total annihilation across the outer rim.",
    coverImage: "/genis-vell.jpg",
    cta: "Read Issue #1",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 2000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem("tagcomics-favorites");
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const numericIds = parsed.map((item) => Number(item)).filter((item) => Number.isFinite(item));
        setFavoriteIds(numericIds as number[]);
      }
    } catch {
      // Ignore malformed local storage payloads.
    }
  }, []);

  const copy = featuredBySlide[currentSlide] ?? featuredBySlide[0];
  const isFavorite = favoriteIds.includes(copy.id);
  const readerHref = buildReaderHref({
    id: copy.id,
    coverImage: copy.coverImage,
    title: `${copy.title1} ${copy.title2}`,
  });

  const toggleFavorite = () => {
    const next = isFavorite ? favoriteIds.filter((id) => id !== copy.id) : [...favoriteIds, copy.id];
    setFavoriteIds(next);
    try {
      window.localStorage.setItem("tagcomics-favorites", JSON.stringify(next));
    } catch {
      // Silently fail if storage is unavailable.
    }
  };

  return (
    <section className="bg-black px-4 pb-6 pt-4 sm:px-6 md:pb-8 md:pt-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="relative max-h-[min(72vh,560px)] min-h-[320px] w-full overflow-hidden rounded-[28px] shadow-[0_16px_48px_rgba(0,0,0,0.28)] md:h-[520px] md:max-h-none">
        {/* Slides — crossfade only (no zoom) for a stable frame like the reference */}
        <div className="absolute inset-0 z-0">
          {slides.map((slide, index) => {
            const active = index === currentSlide;
            return (
              <div
                key={slide}
                className={`absolute inset-0 will-change-[opacity] transition-[opacity] duration-[900ms] ease-in-out motion-reduce:transition-none ${
                  active ? "z-[1] opacity-100" : "z-0 opacity-0 pointer-events-none"
                }`}
              >
                <Image
                  src={slide}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 1440px"
                  className="object-cover object-[45%_top]"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>

        {/* Subtle brand glow (premium accent) */}
        <div
          className="pointer-events-none absolute -right-24 top-1/2 z-[2] h-[85%] w-[42%] -translate-y-1/2 rounded-full bg-brand/[0.12] blur-[100px]"
          aria-hidden
        />

        {/* Left readability gradient */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[3] w-[72%] bg-gradient-to-r from-black/85 via-black/45 to-transparent md:w-[58%]"
          aria-hidden
        />

        {/* Vignette — light; heavy inset + bottom scrim was reading as a “crop” line */}
        <div
          className="pointer-events-none absolute inset-0 z-[4] shadow-[inset_0_0_100px_rgba(0,0,0,0.28)] md:shadow-[inset_0_0_120px_rgba(0,0,0,0.32)]"
          aria-hidden
        />

        {/* Single bottom scrim: melt image into page black (reference — smooth linear only, no blur stack) */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[8] h-[72%] bg-[linear-gradient(to_top,#000000_0%,rgba(0,0,0,0.94)_10%,rgba(0,0,0,0.78)_22%,rgba(0,0,0,0.52)_38%,rgba(0,0,0,0.28)_55%,rgba(0,0,0,0.12)_72%,rgba(0,0,0,0.04)_88%,transparent_100%)]"
          aria-hidden
        />

        {/* Featured copy — bottom-left */}
        <div className="pointer-events-none absolute inset-0 z-[20] flex flex-col justify-end p-8 md:p-12">
          <div className="pointer-events-auto max-w-lg md:max-w-xl">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {copy.exclusive ? (
                <span className="rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-foreground shadow-sm">
                  Exclusive
                </span>
              ) : null}
              <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-200 backdrop-blur-md">
                {copy.genre}
              </span>
            </div>

            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[3.35rem]">
              {copy.title1}
              <br />
              {copy.title2}
            </h1>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400 md:max-w-lg md:text-base">
              {copy.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={readerHref}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-black shadow-[0_0_36px_rgba(255,255,255,0.18)] transition hover:bg-zinc-100 hover:shadow-[0_0_48px_rgba(255,255,255,0.22)]"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                {copy.cta}
              </Link>
              <button
                type="button"
                onClick={toggleFavorite}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                className={`inline-flex h-[52px] w-[52px] items-center justify-center rounded-full border backdrop-blur-md transition ${
                  isFavorite
                    ? "border-brand/60 bg-brand/20 text-brand shadow-[0_0_24px_rgba(88,232,193,0.28)]"
                    : "border-white/20 bg-white/10 text-white hover:border-brand/40 hover:bg-white/15"
                }`}
              >
                <svg
                  className="h-5 w-5"
                  fill={isFavorite ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 z-[30] flex -translate-x-1/2 gap-2.5 md:bottom-6">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className="h-2 cursor-pointer rounded-full border border-white/10 bg-black/30 backdrop-blur-sm transition-all duration-300 hover:bg-white/20  "
              style={{
                width: idx === currentSlide ? "32px" : "10px",
                backgroundColor: idx === currentSlide ? "var(--brand)" : "rgba(255,255,255,0.35)",
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
