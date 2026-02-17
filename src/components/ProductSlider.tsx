"use client";

import { useRef, useState, useEffect, ReactNode } from "react";

interface ProductSliderProps {
  children: ReactNode;
  className?: string;
}

export default function ProductSlider({ children, className = "" }: ProductSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScroll();
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [children]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      const newScrollLeft =
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Left Navigation Button */}
      <button
        onClick={() => scroll("left")}
        className={`absolute -left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/80 backdrop-blur-sm border border-white/20 text-white hover:bg-yellow-400 hover:text-black transition-all cursor-pointer ${
          canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll left"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide"
      >
        <div className="flex gap-4">
          {children}
        </div>
      </div>

      {/* Right Navigation Button */}
      <button
        onClick={() => scroll("right")}
        className={`absolute -right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/80 backdrop-blur-sm border border-white/20 text-white hover:bg-yellow-400 hover:text-black transition-all cursor-pointer ${
          canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll right"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
