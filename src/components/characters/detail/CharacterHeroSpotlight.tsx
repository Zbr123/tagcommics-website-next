import Image from "next/image";
import type { CharacterDetailProfile } from "@/src/data/characterDetailProfile";
import type { CharacterRole } from "@/src/data/characters";

function FloatingFact({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="group relative w-full max-w-[20rem] cursor-default overflow-hidden rounded-2xl border border-white/[0.1] border-l-[3px] border-l-brand bg-white/[0.06] py-5 pl-6 pr-5 shadow-[0_20px_56px_rgba(0,0,0,0.5)] backdrop-blur-xl transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform [transition-property:transform,box-shadow,background-color,border-color] hover:-translate-y-2 hover:border-white/[0.14] hover:bg-white/[0.09] hover:shadow-[0_28px_72px_rgba(0,0,0,0.55),0_0_48px_rgba(88,232,193,0.1)] lg:max-w-none"
      style={{ WebkitBackdropFilter: "blur(22px)" }}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-500 transition-colors duration-500 group-hover:text-zinc-400">
        {label}
      </p>
      <p className="mt-2.5 text-[15px] font-semibold leading-snug tracking-tight text-white md:text-base">{value}</p>
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

function IconBookmark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
      />
    </svg>
  );
}

function IconShare({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      />
    </svg>
  );
}

export default function CharacterHeroSpotlight({ profile }: { profile: CharacterDetailProfile }) {
  const { character, universeBadge, titleLine1, titleLine2, spotlightBody, firstAppearance, creator, alignment } =
    profile;
  const roleLabel = character.role.replaceAll("_", "-");

  return (
    <section className="relative h-[100vh] min-h-[100vh] w-full overflow-hidden bg-black">
      {/* Immersive background */}
      <div className="absolute inset-0 z-0 scale-[1.02]">
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

      <div className="relative z-20 mx-auto flex h-full min-h-0 w-full max-w-[1600px] flex-col px-6 pb-10 pt-28 sm:px-10 sm:pb-14 sm:pt-32 lg:px-14 lg:pb-20 lg:pt-36">
        <div className="flex min-h-0 flex-1 flex-col gap-12 lg:flex-row lg:items-stretch lg:gap-0 lg:pb-2">
          {/* Bottom-left narrative */}
          <div className="flex flex-1 flex-col justify-end lg:max-w-[52%] lg:justify-end lg:pr-10 xl:max-w-[48%]">
            <div className="mb-7 flex flex-wrap items-center gap-2.5">
              {roleBadge(character.role, roleLabel)}
              <span className="rounded-md border border-white/[0.12] bg-white/[0.06] px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.32em] text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md">
                {universeBadge}
              </span>
            </div>

            <h1 className="select-none uppercase">
              <span
                className="block text-[clamp(3.25rem,11vw,7.5rem)] font-black leading-[0.82] tracking-[-0.04em] text-white sm:text-8xl md:text-9xl"
                style={{
                  textShadow: "0 4px 48px rgba(0,0,0,0.95), 0 2px 16px rgba(0,0,0,0.8)",
                }}
              >
                {titleLine1}
              </span>
              <span
                className="mt-1 block text-[clamp(3.25rem,11vw,7.5rem)] font-black leading-[0.82] tracking-[-0.04em] text-brand sm:text-8xl md:text-9xl"
                style={{
                  textShadow:
                    "0 0 48px rgba(88,232,193,0.45), 0 0 80px rgba(88,232,193,0.2), 0 8px 40px rgba(0,0,0,0.75)",
                }}
              >
                {titleLine2}
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-[15px] font-normal leading-relaxed text-zinc-200 sm:text-base md:max-w-lg md:text-[17px] md:leading-[1.75]">
              {spotlightBody}
            </p>

            <div className="mt-11 flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="inline-flex min-h-[52px] min-w-[12rem] items-center justify-center gap-2.5 rounded-full bg-white px-10 text-sm font-black uppercase tracking-[0.1em] text-black shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_20px_50px_rgba(0,0,0,0.5)] transition duration-300 hover:scale-[1.02] hover:bg-zinc-100 hover:shadow-[0_0_60px_rgba(255,255,255,0.18)] active:scale-[0.99]"
              >
                <IconBookmark className="h-5 w-5 shrink-0" />
                Save Character
              </button>
              <button
                type="button"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/[0.18] bg-black/40 px-8 text-sm font-black uppercase tracking-[0.1em] text-white shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl transition duration-300 hover:border-white/30 hover:bg-black/55 hover:shadow-[0_20px_56px_rgba(0,0,0,0.55)] active:scale-[0.99]"
                style={{ WebkitBackdropFilter: "blur(18px)" }}
              >
                <IconShare className="h-[18px] w-[18px] shrink-0 opacity-90" />
                Share
              </button>
            </div>
          </div>

          {/* Center-right floating facts */}
          <div className="flex shrink-0 flex-col justify-center gap-4 lg:ml-auto lg:w-[min(100%,22rem)] lg:pl-6 xl:w-[24rem]">
            <FloatingFact label="First Appearance" value={firstAppearance} />
            <FloatingFact label="Creator" value={creator} />
            <FloatingFact label="Alignment" value={alignment} />
          </div>
        </div>
      </div>
    </section>
  );
}
