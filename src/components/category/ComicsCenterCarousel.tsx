"use client";


import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";


export interface ComicsCenterSlide {
  image: string;
  link?: string;
}


const AUTOPLAY_MS = 1000;
const SWIPE_THRESHOLD_PX = 50;


interface ComicsCenterCarouselProps {
  slides: ComicsCenterSlide[];
  sectionTitle?: string;
  heightVh?: number;
}


/**
 * Figma-style comics slider: full-width, center image zoomed/full size,
 * previous/next smaller with half visible. Images only, no cards.
 */
export default function ComicsCenterCarousel({
  slides,
  sectionTitle,
  heightVh = 26,
}: ComicsCenterCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);


  const n = slides.length;
  const go = useCallback(
    (dir: "prev" | "next") => {
      setIndex((i) => {
        if (dir === "next") return i >= n - 1 ? 0 : i + 1;
        return i <= 0 ? n - 1 : i - 1;
      });
    },
    [n]
  );


  useEffect(() => {
    if (paused || n <= 1) return;
    const t = setInterval(() => go("next"), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, go, n]);


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


  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) >= SWIPE_THRESHOLD_PX) go(diff > 0 ? "next" : "prev");
    setTouchStart(null);
  };


  if (!n) return null;


  const prevIndex = index === 0 ? n - 1 : index - 1;
  const nextIndex = index === n - 1 ? 0 : index + 1;
  const prev = slides[prevIndex];
  const current = slides[index];
  const next = slides[nextIndex];


  return (
    <section
      className="relative w-full overflow-hidden bg-black flex flex-col h-[45vh] sm:h-[50vh] md:h-[55vh] lg:h-[60vh] max-h-[65vh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Title: top-left, white for black theme */}
      {sectionTitle && (
        <div className="w-full px-4 pt-3 md:px-6 lg:px-8 md:pt-4 flex-shrink-0">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            {sectionTitle}
          </h2>
        </div>
      )}


      {/* Slider row: fills container; mobile = single full-width image, md+ = three panels. object-cover, aspect ratio preserved. */}
      <div className="w-full flex-1 min-h-0 flex items-end justify-center gap-3 md:gap-4 px-2 sm:px-4 py-2 md:py-3 box-border">
        {/* Left: hidden on mobile; 28% width md+, only right half visible */}
        <div className="hidden md:block w-[28%] h-full min-w-0 flex-shrink-0 overflow-hidden rounded-[10px]">
          <Link
            href={prev.link ? `/comic/${prev.link}` : "#"}
            className="block w-full h-full relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-[10px] overflow-hidden"
            aria-label="Previous comic"
          >
            <span className="absolute right-0 top-0 w-[200%] h-full">
              <span className="absolute inset-0 scale-75 origin-right">
                <Image
                  src={prev.image}
                  alt=""
                  fill
                  className="object-fill object-right rounded-[10px]"
                  sizes="30vw"
                />
              </span>
            </span>
          </Link>
        </div>


        {/* Center: full-width on mobile (single image), 44% on md+. object-cover, maintain aspect ratio. */}
        <div className="w-full md:w-[44%] h-full min-w-0 flex-shrink-0 overflow-hidden rounded-[12px] z-10 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          <Link
            href={current.link ? `/comic/${current.link}` : "#"}
            className="block w-full h-full relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-[12px] overflow-hidden"
            aria-label="View current comic"
          >
            <Image
              src={current.image}
              alt=""
              fill
              className="object-cover rounded-[12px]"
              sizes="(max-width: 768px) 100vw, 46vw"
              priority
            />
          </Link>
        </div>


        {/* Right: hidden on mobile; 28% width md+, only left half visible */}
        <div className="hidden md:block w-[28%] h-full min-w-0 flex-shrink-0 overflow-hidden rounded-[10px]">
          <Link
            href={next.link ? `/comic/${next.link}` : "#"}
            className="block w-full h-full relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-[10px] overflow-hidden"
            aria-label="Next comic"
          >
            <span className="absolute left-0 top-0 w-[200%] h-full">
              <span className="absolute inset-0 scale-75 origin-left">
                <Image
                  src={next.image}
                  alt=""
                  fill
                  className="object-fill object-left rounded-[10px]"
                  sizes="22vw"
                />
              </span>
            </span>
          </Link>
        </div>
      </div>


      {/* Arrows — visible on black */}
      <button
        type="button"
        onClick={() => go("prev")}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors border border-white/30"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => go("next")}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors border border-white/30"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>


      {/* Dots: active bright, others muted — for black theme */}
      <div className="flex justify-center gap-2 pb-3 flex-shrink-0">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`rounded-full transition-all cursor-pointer ${i === index
                ? "w-3 h-3 bg-amber-400 scale-110"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
              }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}