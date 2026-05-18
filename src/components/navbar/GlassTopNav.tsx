"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import MultiverseSearchField from "@/src/components/ui/MultiverseSearchField";
import { useCart } from "@/src/hooks/use-cart";

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
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const urlQ = searchParams.get("q") ?? "";
  const isHome = pathname === "/";
  const isSearch = pathname === "/search";
  const isCharacters = pathname.startsWith("/characters");
  const isBooks = pathname === "/bestsellers" || pathname === "/books";
  const isNewReleases = pathname === "/new-releases";
  const isDesignTeam = pathname.startsWith("/design-team");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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

  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
      <nav
        id="global-nav"
        className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-black/95 px-4 py-4 sm:px-6"
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
          {/* Left section: Logo + Desktop Nav */}
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
              <span className="text-lg font-black tracking-tight inline">
                <span className="text-white">Tag</span>
                <span className="text-brand">Comics</span>
              </span>
            </Link>

            {/* Desktop Nav Links - hidden on mobile, shown on lg+ */}
            <div className="hidden lg:flex min-w-0 flex-wrap items-center gap-3 xl:gap-6">
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

          {/* Right section: Search, Cart, Profile, Mobile Menu Button */}
          <div className="flex min-w-0 items-center justify-end gap-3 sm:gap-4 lg:gap-6">
            {/* Desktop Search - shown on md+, hidden on smaller */}
            {showCatalogSearch && (
              <form
                onSubmit={handleCatalogSearch}
                className="hidden md:block min-w-0 max-w-[22rem]"
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
            )}

            {/* Mobile Search Toggle - shown on < md screens */}
            {showCatalogSearch && (
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition hover:border-[#58E8C1]/45 hover:text-brand"
                aria-label="Toggle search"
              >
                <i className="fa-solid fa-magnifying-glass text-sm" aria-hidden />
              </button>
            )}

            <Link
              href="/cart"
              className="relative inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition hover:border-[#58E8C1]/45 hover:text-brand hover:shadow-[0_0_18px_rgba(88,232,193,0.28)]"
              aria-label="Open shopping cart"
            >
              <i className="fa-solid fa-bag-shopping text-sm" aria-hidden />
              {totalItems > 0 ? (
                <span className="absolute -right-1 -top-1 min-w-[1.1rem] rounded-full border border-brand/40 bg-brand px-1.5 text-center text-[10px] font-black leading-[1.1rem] text-brand-foreground">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              ) : null}
            </Link>
            <Link
              href={profileHref}
              className="hidden lg:flex relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-white/10 transition hover:border-[#58E8C1]/45 hover:shadow-[0_0_18px_rgba(88,232,193,0.28)]"
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

            {/* Mobile Menu Button - shown on < lg screens (includes md) */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition hover:border-[#58E8C1]/45 hover:text-brand"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              <FontAwesomeIcon
                icon={mobileMenuOpen ? faXmark : faBars}
                className="h-5 w-5"
                aria-hidden
              />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - shown when toggled on < md screens */}
        {showCatalogSearch && searchOpen && (
          <form
            onSubmit={handleCatalogSearch}
            className="mt-4 md:hidden"
          >
            <MultiverseSearchField
              variant="pill"
              id="nav-catalog-search-mobile"
              name="q"
              value={navQuery}
              onChange={setNavQuery}
              placeholder="Search series, creators, or characters…"
              aria-label="Search catalog"
            />
          </form>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          mobileMenuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Menu Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-[280px] max-w-[80vw] bg-black/95 backdrop-blur-xl border-l border-white/10 transition-transform duration-300 ease-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex flex-col h-full pt-20 px-6 pb-6">
            {/* Close button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition hover:border-[#58E8C1]/45 hover:text-brand"
              aria-label="Close menu"
            >
              <FontAwesomeIcon icon={faXmark} className="h-5 w-5" aria-hidden />
            </button>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={handleNavLinkClick}
                className={`${navItemBase} px-3 py-3 rounded-lg ${
                  isHome ? "bg-[#58E8C1]/10 text-[#58E8C1]" : "text-zinc-300 hover:bg-white/5"
                }`}
              >
                Home
              </Link>
              <Link
                href="/characters"
                onClick={handleNavLinkClick}
                className={`${navItemBase} px-3 py-3 rounded-lg ${
                  isCharacters ? "bg-[#58E8C1]/10 text-[#58E8C1]" : "text-zinc-300 hover:bg-white/5"
                }`}
              >
                Characters
              </Link>
              <Link
                href="/bestsellers"
                onClick={handleNavLinkClick}
                className={`${navItemBase} px-3 py-3 rounded-lg ${
                  isBooks ? "bg-[#58E8C1]/10 text-[#58E8C1]" : "text-zinc-300 hover:bg-white/5"
                }`}
              >
                Books
              </Link>
              <Link
                href="/new-releases"
                onClick={handleNavLinkClick}
                className={`${navItemBase} px-3 py-3 rounded-lg ${
                  isNewReleases ? "bg-[#58E8C1]/10 text-[#58E8C1]" : "text-zinc-300 hover:bg-white/5"
                }`}
              >
                New-releases
              </Link>
              <Link
                href="/design-team"
                onClick={handleNavLinkClick}
                className={`${navItemBase} px-3 py-3 rounded-lg ${
                  isDesignTeam ? "bg-[#58E8C1]/10 text-[#58E8C1]" : "text-zinc-300 hover:bg-white/5"
                }`}
              >
                Design Team
              </Link>
            </nav>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Bottom section with profile link */}
            <div className="border-t border-white/10 pt-6 mt-6">
              <Link
                href={profileHref}
                onClick={handleNavLinkClick}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-zinc-300 hover:bg-white/5 transition-colors"
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10">
                  <Image
                    src="/admin.png"
                    alt={userName ? `${userName} profile photo` : "Profile photo"}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <span className="text-sm font-medium">{userName || "Account"}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
