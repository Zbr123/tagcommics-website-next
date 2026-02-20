"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export interface MangaHeroSlide {
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  link?: string;
}

const AUTOPLAY_MS = 1500;
const TRANSITION_MS = 0.5;
const SWIPE_THRESHOLD_PX = 70;

/** Text 1/5, Slider 4/5. Main card ~68%, next half visible. Margin 12px, inner padding 8px. */
const TEXT_WIDTH_PERCENT = 20;
const SLIDER_WIDTH_PERCENT = 80;
const CARD_WIDTH_PERCENT = 68;
const CARD_MARGIN_PX = 12;
const CARD_PADDING_PX = 8;

function getBadgeClass(badge: string): string {
  const b = badge.toUpperCase();
  if (b === "START" || b === "STAFF PICK") return "bg-emerald-500";
  if (b === "HOT" || b === "ORIGINALS") return "bg-red-500";
  if (b === "NEW" || b === "BAZE") return "bg-blue-500";
  return "bg-emerald-500";
}

interface HeroMangaCarouselProps {
  slides: MangaHeroSlide[];
}

export default function HeroMangaCarousel({ slides }: HeroMangaCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (dir: "prev" | "next") => {
      setIndex((i) => {
        if (dir === "next") return i >= slides.length - 1 ? 0 : i + 1;
        return i <= 0 ? slides.length - 1 : i - 1;
      });
    },
    [slides.length]
  );

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const t = setInterval(() => go("next"), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, go, slides.length]);

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

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSliderWidth(el.offsetWidth));
    ro.observe(el);
    setSliderWidth(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) >= SWIPE_THRESHOLD_PX) go(diff > 0 ? "next" : "prev");
    setTouchStart(null);
  };

  if (!slides.length) return null;

  const current = slides[index];
  const n = slides.length;
  const cardWidthPx = sliderWidth * (CARD_WIDTH_PERCENT / 100);
  const slotPx = cardWidthPx + CARD_MARGIN_PX;
  const trackWidthPx = n * cardWidthPx + (n - 1) * CARD_MARGIN_PX;
  const translateXPx = index * slotPx;

  return (
    <section
      ref={containerRef}
      className="relative h-[50vh] min-h-[260px] w-full overflow-hidden bg-gradient-to-br from-black via-slate-900/90 to-gray-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* DESKTOP: 1/5 text left, 4/5 image slider right — images slide R→L, text swaps with slide */}
      <div className="hidden md:flex absolute inset-0">
        {/* LEFT: 1/5 — text only; transitions when slide changes */}
        <div
          className="flex-shrink-0 flex flex-col justify-center pl-6 lg:pl-10 pr-4"
          style={{ width: `${TEXT_WIDTH_PERCENT}%` }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              className="flex flex-col"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: TRANSITION_MS * 0.6, ease: "easeInOut" }}
            >
              <h2 className="text-2xl lg:text-3xl xl:text-4xl font-black text-white leading-tight">
                {current.title}
              </h2>
              <p className="mt-3 text-base lg:text-lg xl:text-xl font-light text-white/85 leading-snug">
                {current.subtitle}
              </p>
              <Link
                href={current.link ? `/comic/${current.link}` : "/manga"}
                className="mt-6 w-fit bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform text-sm lg:text-base"
              >
                Learn More
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT: 4/5 — image slider; 12px margin between cards, 8px padding inside each */}
        <div
          ref={sliderRef}
          className="flex-1 overflow-hidden relative"
          style={{ width: `${SLIDER_WIDTH_PERCENT}%` }}
        >
          <motion.div
            className="flex h-full absolute inset-y-0"
            style={{
              width: sliderWidth ? `${trackWidthPx}px` : `calc(${n * CARD_WIDTH_PERCENT}% + ${(n - 1) * CARD_MARGIN_PX}px)`,
            }}
            animate={{
              x: sliderWidth ? -translateXPx : `-${index * (100 / n)}%`,
            }}
            transition={{ type: "tween", duration: TRANSITION_MS, ease: "easeInOut" }}
          >
            {slides.map((slide, i) => (
              <Link
                key={i}
                href={slide.link ? `/comic/${slide.link}` : "/manga"}
                className="relative flex-shrink-0 h-full rounded-xl overflow-hidden shadow-2xl box-border block cursor-pointer"
                style={{
                  width: sliderWidth ? `${cardWidthPx}px` : `${CARD_WIDTH_PERCENT}%`,
                  marginRight: i < n - 1 ? CARD_MARGIN_PX : 0,
                }}
              >
                <span
                  className={`absolute top-3 left-3 z-10 px-3 py-1.5 rounded-full text-white text-xs font-semibold shadow-lg ${getBadgeClass(slide.badge)}`}
                >
                  {slide.badge}
                </span>
                <div
                  className="absolute inset-0 box-border"
                  style={{ padding: CARD_PADDING_PX }}
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1200px) 50vw, 45vw"
                      priority={i === 0}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>

      {/* MOBILE: vertical stack — text then image, both transition with slide */}
      <div className="md:hidden flex flex-col h-full w-full px-4 pt-8 pb-24">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            className="flex flex-col flex-1 items-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: TRANSITION_MS, ease: "easeInOut" }}
          >
            <h2 className="text-2xl font-black text-white leading-tight w-[90%]">
              {current.title}
            </h2>
            <p className="mt-3 text-lg font-light text-white/85">
              {current.subtitle}
            </p>
            <Link
              href={current.link ? `/comic/${current.link}` : "/manga"}
              className="mt-5 w-full max-w-xs mx-auto bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform block text-center"
            >
              Learn More
            </Link>
            <div className="relative mt-6 w-full flex-1 min-h-[200px] max-w-sm mx-auto">
              <Link
                href={current.link ? `/comic/${current.link}` : "/manga"}
                className="block relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-2xl box-border cursor-pointer"
              >
                <span
                  className={`absolute top-3 left-3 z-10 px-3 py-1.5 rounded-full text-white text-sm font-semibold shadow-lg ${getBadgeClass(current.badge)}`}
                >
                  {current.badge}
                </span>
                <div
                  className="absolute inset-0 box-border"
                  style={{ padding: CARD_PADDING_PX }}
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <Image
                      src={current.image}
                      alt={current.title}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      priority={index === 0}
                    />
                  </div>
                </div>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={() => go("prev")}
        className="absolute bottom-10 left-4 md:left-6 p-2.5 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/40 transition-colors z-20"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => go("next")}
        className="absolute bottom-10 right-4 md:right-6 p-2.5 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/40 transition-colors z-20"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 flex gap-2 -translate-x-1/2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`rounded-full transition-all cursor-pointer ${
              i === index
                ? "w-3 h-3 bg-orange-500 scale-125"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
