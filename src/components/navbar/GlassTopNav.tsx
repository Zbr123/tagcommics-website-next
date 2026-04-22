"use client";

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";

export interface GlassTopNavProps {
  pathname: string;
  profileHref: string;
  /** Optional display name for avatar alt / future initials */
  userName?: string | null;
}

/**
 * Minimal fixed top bar: bolt home, Characters + Design Team links, profile avatar.
 * Matches reference layout: `fixed top-0 … glass-panel border-b border-white/5 px-6 py-4`, inner `max-w-[1440px]`.
 */
export default function GlassTopNav({ pathname, profileHref, userName }: GlassTopNavProps) {
  const onCharacters = pathname === "/characters" || pathname.startsWith("/characters/");

  return (
    <nav
      id="global-nav"
      className="fixed top-0 left-0 right-0 z-50 bg-black/95 border-b border-white/5 px-6 py-4"
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-[52px] h-[52px] rounded-xl bg-black/40 border border-[rgba(88,232,193,0.28)] transition-transform hover:scale-105"
            aria-label="Home"
          >
            <FontAwesomeIcon icon={faBolt} style={{ color: "rgb(88,232,193)" }} className="h-5 w-5" aria-hidden />
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link href="/characters" className="text-sm font-semibold text-white">
              Characters
            </Link>
            <span className="cursor-default text-sm font-medium text-zinc-400 hover:text-white">Design Team</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={profileHref}
            className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10 transition-colors hover:border-[rgba(88,232,193,0.35)]"
            aria-label={userName ? `Account (${userName})` : "Account"}
          >
            <Image
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format"
              alt=""
              fill
              className="object-cover"
              sizes="40px"
              priority
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}
