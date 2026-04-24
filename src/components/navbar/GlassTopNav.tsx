"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";
import MultiverseSearchField from "@/src/components/ui/MultiverseSearchField";

export interface GlassTopNavProps {
  pathname: string;
  profileHref: string;
  /** Optional display name for avatar alt / future initials */
  userName?: string | null;
}

/**
 * Minimal fixed top bar: bolt home, Characters, Books, New-releases, profile avatar (not a link).
 * Catalog search on `/` and `/search`: pill → `/search?q=…` (single source of truth in URL).
 */
export default function GlassTopNav({ pathname, profileHref: _profileHref, userName }: GlassTopNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQ = searchParams.get("q") ?? "";
  const isHome = pathname === "/";
  const isSearch = pathname === "/search";
  const isCharacters = pathname.startsWith("/characters");
  const isBooks = pathname === "/bestsellers" || pathname === "/books";
  const isNewReleases = pathname === "/new-releases";
  
  const showCatalogSearch = isHome || isSearch;
  const [navQuery, setNavQuery] = useState(() => (pathname === "/search" ? urlQ : ""));

  useEffect(() => {
    if (isSearch) {
      setNavQuery(urlQ);
    }
  }, [isSearch, urlQ]);

  const handleCatalogSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = navQuery.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <nav
      id="global-nav"
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-black/95 px-4 py-4 sm:px-6"
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
        <div className="flex min-w-0 flex-shrink-0 items-center gap-6 md:gap-8">
          <Link
            href="/"
            className="inline-flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-xl border border-[rgba(88,232,193,0.28)] bg-black/40 transition-transform hover:scale-105"
            aria-label="Home"
          >
            <FontAwesomeIcon icon={faBolt} style={{ color: "rgb(88,232,193)" }} className="h-5 w-5" aria-hidden />
          </Link>

          <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-6 md:gap-8">
            <Link
              href="/characters"
              className={`whitespace-nowrap text-xs font-semibold transition-colors sm:text-sm ${
                isCharacters ? "text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              Characters
            </Link>
            <Link
              href="/bestsellers"
              className={`whitespace-nowrap text-xs font-semibold transition-colors sm:text-sm ${
                isBooks ? "text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              Books
            </Link>
            <Link
              href="/new-releases"
              className={`whitespace-nowrap text-xs font-semibold transition-colors sm:text-sm ${
                isNewReleases ? "text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              New-releases
            </Link>
            <span className="cursor-default text-sm font-medium text-zinc-400 hover:text-white">Design Team</span>
          </div>
        </div>

        <div className="flex min-w-0 items-center justify-end gap-3 sm:gap-8">
          {showCatalogSearch ? (
            <form
              onSubmit={handleCatalogSearch}
              className="min-w-0 max-w-[10rem] flex-1 sm:max-w-[14rem] md:max-w-[18rem] lg:max-w-[22rem]"
            >
              <MultiverseSearchField
                variant="pill"
                id="nav-catalog-search"
                name="q"
                value={navQuery}
                onChange={setNavQuery}
                placeholder="Search series, creators, or characters…"
                aria-label="Search catalog"
              />
            </form>
          ) : null}
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-white/10">
            <Image
              src="/admin.png"
              alt={userName ? `${userName} profile photo` : "Profile photo"}
              fill
              className="object-cover"
              sizes="40px"
              priority
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
