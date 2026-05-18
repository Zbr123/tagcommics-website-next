 "use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { CharacterDetailProfile } from "@/src/data/characterDetailProfile";
import type { CharacterRole } from "@/src/data/characters";

function FloatingFact({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="group relative w-full max-w-[20rem] cursor-default overflow-hidden rounded-2xl border border-white/[0.1] border-l-[3px] border-l-brand bg-white/[0.06] py-4 pl-5 pr-4 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-[box-shadow,background-color,border-color] duration-500 ease-out hover:border-white/[0.16] hover:bg-white/[0.09] hover:shadow-[0_20px_56px_rgba(0,0,0,0.55),0_0_32px_rgba(88,232,193,0.12)] lg:max-w-none"
      style={{ WebkitBackdropFilter: "blur(22px)" }}
    >
      <p className="text-[8px] 2xl:text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-500 transition-colors duration-500 group-hover:text-zinc-400">
        {label}
      </p>
      <p className="mt-2 text-[13px] 2xl:text-[15px] font-semibold leading-snug tracking-tight text-base">{value}</p>
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(88,232,193,0.14)",
        }}
        aria-hidden
      />
    </div>
  );
}

function roleBadge(role: CharacterRole, label: string) {
  if (role === "HERO") {
    return (
      <span className="rounded-md bg-brand px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.32em] text-brand-foreground shadow-[0_0_24px_rgba(88,232,193,0.35)]">
        {label}
      </span>
    );
  }
  return (
    <span className="rounded-md border border-white/15 bg-black/45 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.32em] text-zinc-100 backdrop-blur-md">
      {label}
    </span>
  );
}

function IconBookmark({ className = "h-5 w-5", filled = false }: { className?: string; filled?: boolean }) {
  return (
    <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
      />
    </svg>
  );
}

export default function CharacterHeroSpotlight({ profile }: { profile: CharacterDetailProfile }) {
  const { character, universeBadge, titleLine1, titleLine2, spotlightBody, firstAppearance, creator, alignment } =
    profile;
  const roleLabel = character.role.replaceAll("_", "-");
  const [isSaved, setIsSaved] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const is2xl = windowWidth >= 1536;
  const wordLimit = is2xl ? 45 : 35;
  const displayText = spotlightBody.split(" ").slice(0, wordLimit).join(" ") + (spotlightBody.split(" ").length > wordLimit ? "..." : "");

  return (
    <section className="relative h-[min(100dvh,680px)] w-full overflow-hidden bg-black sm:h-[100vh] sm:min-h-[100vh]">
      {/* Immersive background */}
      <div className="absolute inset-0 z-0 scale-[1.02] max-sm:scale-[0.92] max-sm:origin-[38%_24%]">
        <Image
          src={character.image}
          alt={character.name}
          fill
          priority
          className="object-cover object-[38%_22%] sm:object-[36%_18%] lg:object-[32%_12%]"
          sizes="100vw"
        />
      </div>

      {/* Left cinematic grade */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.97)_12%,rgba(0,0,0,0.82)_28%,rgba(0,0,0,0.45)_48%,rgba(0,0,0,0.12)_68%,transparent_92%)]"
        aria-hidden
      />
      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(0deg,#000_0%,rgba(0,0,0,0.92)_18%,rgba(0,0,0,0.55)_42%,rgba(0,0,0,0.18)_68%,transparent_88%)]"
        aria-hidden
      />
      {/* Ambient teal */}
      <div
        className="pointer-events-none absolute -left-[20%] bottom-[-10%] z-[3] h-[70%] w-[85%] rounded-full bg-brand/[0.12] blur-[140px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[-15%] top-[5%] z-[3] h-[45%] w-[50%] rounded-full bg-brand/[0.06] blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[4] shadow-[inset_0_0_120px_rgba(0,0,0,0.45)]"
        aria-hidden
      />

      <div className="relative z-20 mx-auto flex h-full min-h-0 w-full max-w-[1600px] flex-col px-4 pb-24 pt-12 sm:px-8 sm:pb-8 sm:pt-12 md:px-10 md:pb-12 md:pt-12 lg:px-12 lg:pb-16 lg:pt-32 xl:px-14 xl:pb-20 xl:pt-36">
        <div className="flex min-h-0 flex-1 flex-col gap-12 lg:flex-row lg:items-stretch lg:gap-0 lg:pb-2">
          {/* Bottom-left narrative */}
          <div className="flex flex-1 flex-col justify-end max-sm:absolute max-sm:inset-x-0 max-sm:bottom-24 max-sm:z-20 max-sm:w-full max-sm:box-border max-sm:px-4 max-sm:-translate-y-14 max-sm:mb-10 sm:relative sm:inset-auto sm:bottom-auto sm:z-auto sm:w-auto sm:translate-y-0 sm:px-0 sm:mb-0 sm:flex-1 sm:pt-16 md:-mt-20 lg:max-w-[52%] lg:justify-end lg:pr-10 xl:max-w-[48%]">
            <div className="mb-5 flex flex-wrap items-center gap-2.5 sm:mb-7">
              {roleBadge(character.role, roleLabel)}
              <span className="rounded-md border border-white/[0.12] bg-white/[0.06] px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.32em] text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md">
                {universeBadge}
              </span>
            </div>

            <h1 className="select-none uppercase">
              <span
                className="block text-[clamp(3rem,8vw,7.5rem)] font-black leading-[0.82] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-7xl xl:text-7xl 2xl:text-9xl"
                style={{
                  textShadow: "0 4px 48px rgba(0,0,0,0.95), 0 2px 16px rgba(0,0,0,0.8)",
                }}
              >
                {titleLine1}
              </span>
              <span
                className="mt-1 block text-[clamp(3rem,8vw,7.5rem)] font-black leading-[0.82] tracking-[-0.04em] text-brand sm:text-6xl md:text-7xl lg:text-7xl xl:text-7xl 2xl:text-9xl"
                style={{
                  textShadow:
                    "0 0 48px rgba(88,232,193,0.45), 0 0 80px rgba(88,232,193,0.2), 0 8px 40px rgba(0,0,0,0.75)",
                }}
              >
                {titleLine2}
              </span>
            </h1>

            <p className="mt-4 max-w-[85%] text-[15px] font-normal leading-[1.65] text-zinc-200 sm:mt-6 sm:text-sm sm:leading-relaxed sm:max-w-[75%] sm:pt-1 md:mt-8 md:text-base md:max-w-lg lg:text-[17px] lg:leading-[1.75]">
              {displayText}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8 md:mt-11 md:gap-4">
              <button
                type="button"
                onClick={() => setIsSaved((prev) => !prev)}
                aria-pressed={isSaved}
                className={`inline-flex min-h-[44px] min-w-[10rem] items-center justify-center gap-2 rounded-full px-6 md:px-8 md:min-h-[52px] md:min-w-[12rem] text-xs md:text-sm font-black uppercase tracking-[0.1em] shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_16px_40px_rgba(0,0,0,0.5)] transition duration-300 active:scale-[0.99] ${
                  isSaved
                    ? "border border-brand/60 bg-brand text-brand-foreground hover:scale-[1.02] hover:bg-[#63f3cf] hover:shadow-[0_0_60px_rgba(88,232,193,0.4)]"
                    : "bg-white text-black hover:scale-[1.02] hover:bg-zinc-100 hover:shadow-[0_0_60px_rgba(255,255,255,0.18)]"
                }`}
              >
                <IconBookmark className="h-5 w-5 shrink-0" filled={isSaved} />
                Save Character
              </button>
            </div>
          </div>

          {/* Center-right floating facts - hidden on mobile, shown on lg+ */}
          <div className="hidden lg:flex shrink-0 flex-col justify-center gap-3 lg:gap-4 lg:ml-auto lg:w-[min(100%,18rem)] lg:pl-4 xl:w-[22rem] xl:pl-6">
            <FloatingFact label="First Appearance" value={firstAppearance} />
            <FloatingFact label="Creator" value={creator} />
            <FloatingFact label="Alignment" value={alignment} />
          </div>
        </div>
      </div>
    </section>
  );
}
