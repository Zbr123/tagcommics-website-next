"use client";

export type CategoryColorScheme = "comics" | "manga" | "bestsellers";

const schemes: Record<
  CategoryColorScheme,
  { bg: string; overlay: string; titleClass: string; subtitleClass?: string }
> = {
  comics: {
    bg: "bg-black",
    overlay: "bg-gradient-to-b from-[#DC143C]/80 via-[#1E90FF]/40 to-black",
    titleClass: "text-white drop-shadow-[0_0_20px_rgba(30,144,255,0.8)]",
  },
  manga: {
 
    bg: "bg-black",
    overlay: "bg-gradient-to-b from-[#FF69B4]/70 via-black/60 to-black",
    titleClass: "text-white drop-shadow-[0_0_16px_rgba(255,105,180,0.9)]",
  },
  bestsellers: {
    bg: "bg-black",


    overlay: "bg-gradient-to-b from-black/70 via-transparent to-black",
    titleClass: "text-[#FFD700] drop-shadow-[0_0_24px_rgba(255,215,0,0.6)]",
  },
};

interface CategoryHeroProps {
  title: string;
  subtitle?: string;
  bgImage?: string;
  colorScheme: CategoryColorScheme;
  heightVh?: number;
  children?: React.ReactNode;
}

export default function CategoryHero({
  title,
  subtitle,
  bgImage,
  colorScheme,
  heightVh = 50,
  children,
}: CategoryHeroProps) {
  const s = schemes[colorScheme];
  return (
    <section
      className={`relative w-full ${s.bg}`}
      style={{ minHeight: `${heightVh}vh` }}
    >
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      <div className={`absolute inset-0 ${s.overlay}`} />
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-16 sm:py-20 text-center" style={{ minHeight: `${heightVh}vh` }}>
        <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight ${s.titleClass}`}>
          {title}
                  
        </h1>
        {subtitle && (
          <p className={`mt-2 sm:mt-3 text-lg sm:text-xl ${s.subtitleClass || "text-white/90"}`}>
            {subtitle}
          </p>
          
        )}
        {children}
      </div>
    </section>
  );
}