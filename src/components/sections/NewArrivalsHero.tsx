"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface Comic {
  id: number;
  image: string;
  title: string;
}

interface NewArrivalsHeroProps {
  heroComics?: Comic[];
}

const defaultHeroComics: Comic[] = [
  { id: 1, image: "/THE_NEW_GIRL.webp", title: "THE NEW GIRL" },
  { id: 2, image: "/The-LONG_GAME.webp", title: "THE LONG GAME" },
  { id: 3, image: "/I-SURVIVED.webp", title: "I SURVIVED" },
  { id: 4, image: "/THE_WOMEN_OF_RIDGE.webp", title: "THE WOMEN OF RIDGE" },
  { id: 5, image: "/THE _HEART_LOVER.webp", title: "THE HEART LOVER" },
];

export default function NewArrivalsHero({ heroComics = defaultHeroComics }: NewArrivalsHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Create staggered animation for each comic
  const animations = heroComics.map((_, index) => ({
    y: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100]),
    x: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [-50 * (index + 1), 0, 0, 50 * (index + 1)]),
    rotate: useTransform(scrollYProgress, [0, 0.3, 0.5], [-(15 + index * 3), 0, 0]),
    scale: useTransform(scrollYProgress, [0, 0.3, 0.5], [0.5, 1, 1]),
    opacity: useTransform(scrollYProgress, [0, 0.2, 0.3], [0, 0.5, 1]),
  }));

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[70vh] md:min-h-[80vh] overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="w-full h-full"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 35px,
              rgba(250, 204, 21, 0.1) 35px,
              rgba(250, 204, 21, 0.1) 70px
            )`,
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] animate-pulse delay-1000" />

      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center px-4 py-16 md:py-20">
        <div className="max-w-7xl w-full mx-auto">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12 md:mb-16"
          >
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4 tracking-tight"
              style={{
                textShadow: "0 0 40px rgba(250, 204, 21, 0.5), 0 4px 20px rgba(0, 0, 0, 0.8)",
              }}
            >
              NEW ARRIVALS
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl text-yellow-400 font-semibold tracking-wide"
            >
              Fresh Comics • Hot Releases • Limited Editions
            </motion.p>
          </motion.div>

          {/* Diagonal Comic Cascade */}
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full perspective-1000">
            {heroComics.map((comic, index) => {
              const anim = animations[index];
              // Diagonal positioning
              const topPosition = 10 + index * 18; // percentage
              const leftPosition = 5 + index * 15; // percentage

              return (
                <motion.div
                  key={comic.id}
                  style={{
                    y: anim.y,
                    x: anim.x,
                    rotate: anim.rotate,
                    scale: anim.scale,
                    opacity: anim.opacity,
                    top: `${topPosition}%`,
                    left: `${leftPosition}%`,
                    zIndex: heroComics.length - index,
                  }}
                  className="absolute w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] aspect-[2/3]"
                  initial={{ opacity: 0 }}
                  whileHover={{
                    scale: 1.1,
                    rotate: 0,
                    zIndex: 100,
                    transition: { duration: 0.3 },
                  }}
                >
                  <Link href={`/comic/${comic.id}`} className="block w-full h-full">
                    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl border-2 border-yellow-400/30 hover:border-yellow-400 transition-colors">
                      <Image
                        src={comic.image}
                        alt={comic.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, (max-width: 1024px) 180px, 200px"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      {/* Badge */}
                      <div className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                        NEW
                      </div>

                      {/* Title */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white text-sm font-bold truncate drop-shadow-lg">
                          {comic.title}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex justify-center mt-8"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2 text-gray-400"
            >
              <span className="text-sm font-medium">Scroll to explore</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20" />
    </section>
  );
}
