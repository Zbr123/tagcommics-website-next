"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export interface MangaHeroItem {
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  link?: string;
}

const AUTOPLAY_MS = 6000;
const TRANSITION_MS = 0.5;
/** Current slide takes 80vw, next slide peeks 20vw */
const SLIDE_WIDTH_VW = 80;

/** Badge color by label: START/STAFF PICK=green, HOT=red, NEW=blue */
function getBadgeStyle(badge: string) {
  const b = badge.toUpperCase();
  if (b === "START" || b === "STAFF PICK") return { backgroundColor: "#28a745", color: "#fff" };
  if (b === "HOT" || b === "ORIGINALS") return { backgroundColor: "#dc3545", color: "#fff" };
  if (b === "NEW") return { backgroundColor: "#1E90FF", color: "#fff" };
  return { backgroundColor: "#28a745", color: "#fff" };
}

interface HeroCarouselProps {
  items: MangaHeroItem[];
}

export default function HeroCarousel({ items }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: "prev" | "next") => {
      setIndex((i) => {
        if (dir === "next") return i >= items.length - 1 ? 0 : i + 1;
        return i <= 0 ? items.length - 1 : i - 1;
      });
    },
    [items.length]
  );

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const t = setInterval(() => go("next"), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, go, items.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go("prev");
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go("next");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (!items.length) return null;

  return (
    <section
      className="relative h-[70vh] min-h-[360px] w-full overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="h-full w-full overflow-hidden">
        <motion.div
          className="flex h-full"
          style={{ width: `${items.length * SLIDE_WIDTH_VW}vw` }}
          animate={{ x: `-${index * SLIDE_WIDTH_VW}vw` }}
          transition={{ type: "tween", duration: TRANSITION_MS, ease: "easeInOut" }}
        >
          {items.map((slide, i) => (
            <div
              key={i}
              className="flex h-full flex-col md:flex-row shrink-0"
              style={{ width: `${SLIDE_WIDTH_VW}vw`, minWidth: `${SLIDE_WIDTH_VW}vw` }}
            >
              {/* LEFT 60%: text stack (desktop) | mobile: order-2 so image is below */}
              <div className="w-full md:w-[60%] flex-shrink-0 order-2 md:order-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-8 md:py-0 text-center md:text-left">
                <h2 className="font-bold text-5xl md:text-6xl text-white tracking-tight mb-3 md:mb-4">
                  {slide.title}
                </h2>
                <p className="text-2xl md:text-3xl text-white/90 font-light mb-6 md:mb-8">
                  {slide.subtitle}
                </p>
                <Link
                  href={slide.link ? `/comic/${slide.link}` : "/manga"}
                  className="inline-flex w-fit bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Read More
                </Link>
              </div>

              {/* RIGHT 40%: cover image full height + badge top-right */}
              <div className="w-full md:w-[40%] flex-shrink-0 order-1 md:order-2 flex items-center justify-center md:justify-start pl-4 pr-4 md:pl-6 md:pr-0 pb-4 md:pb-0">
                <div className="relative w-full max-w-md aspect-[3/4] md:aspect-auto md:h-full md:max-h-full rounded-xl md:rounded-2xl overflow-hidden bg-white/5 shadow-2xl">
                  <span
                    className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-white text-sm font-medium"
                    style={getBadgeStyle(slide.badge)}
                  >
                    {slide.badge}
                  </span>
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority={i === 0}
                  />
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Subtle arrows */}
      <button
        type="button"
        onClick={() => go("prev")}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => go("next")}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Bottom: dots (clickable) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
              i === index ? "bg-orange-500 scale-125" : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
