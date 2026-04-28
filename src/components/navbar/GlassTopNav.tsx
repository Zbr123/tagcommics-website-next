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
 * Minimal fixed top bar: bolt home, Characters, Books, New-releases, Design Team, profile avatar.
 * Catalog search on `/` and `/search`: pill → `/search?q=…` (single source of truth in URL).
 */
export default function GlassTopNav({ pathname, profileHref, userName }: GlassTopNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQ = searchParams.get("q") ?? "";
  const isHome = pathname === "/";
  const isSearch = pathname === "/search";
  const isCharacters = pathname.startsWith("/characters");
  const isBooks = pathname === "/bestsellers" || pathname === "/books";
  const isNewReleases = pathname === "/new-releases";
  const isDesignTeam = pathname.startsWith("/design-team");
  
  const showCatalogSearch = isHome || isSearch;
  const [navQuery, setNavQuery] = useState(() => (pathname === "/search" ? urlQ : ""));
  const navItemBase =
    "whitespace-nowrap text-xs font-semibold tracking-[0.01em] transition-colors sm:text-sm";
  const navItemActive = "text-[#58E8C1] drop-shadow-[0_0_10px_rgba(88,232,193,0.35)]";
  const navItemInactive = "text-zinc-400 hover:text-[#58E8C1]";

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

  const handleHomeClick = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
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
            onClick={handleHomeClick}
            className="group inline-flex items-center gap-3"
            aria-label="TagComics home"
          >
            <span className="inline-flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-xl border border-[rgba(88,232,193,0.28)] bg-black/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:border-[rgba(88,232,193,0.6)] group-hover:bg-[rgba(88,232,193,0.08)] group-hover:shadow-[0_0_24px_rgba(88,232,193,0.3)]">
              <FontAwesomeIcon
                icon={faBolt}
                style={{ color: "rgb(88,232,193)" }}
                className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(88,232,193,0.7)]"
                aria-hidden
              />
            </span>
            <span className="hidden text-lg font-black tracking-tight sm:inline">
              <span className="text-white">Tag</span>
              <span className="text-brand">Comics</span>
            </span>
          </Link>

          <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-6 md:gap-8">
            <Link
              href="/characters"
              className={`${navItemBase} ${
                isCharacters ? navItemActive : navItemInactive
              }`}
            >
              Characters
            </Link>
            <Link
              href="/bestsellers"
              className={`${navItemBase} ${
                isBooks ? navItemActive : navItemInactive
              }`}
            >
              Books
            </Link>
            <Link
              href="/new-releases"
              className={`${navItemBase} ${
                isNewReleases ? navItemActive : navItemInactive
              }`}
            >
              New-releases
            </Link>
            <Link
              href="/design-team"
              className={`${navItemBase} ${
                isDesignTeam ? navItemActive : navItemInactive
              }`}
            >
              Design Team
            </Link>
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
          <Link
            href={profileHref}
            className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-white/10 transition hover:border-[#58E8C1]/45 hover:shadow-[0_0_18px_rgba(88,232,193,0.28)]"
            aria-label="Open profile and settings"
          >
            <Image
              src="/admin.png"
              alt={userName ? `${userName} profile photo` : "Profile photo"}
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
