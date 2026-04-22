"use client";

import { useEffect, useMemo, useState } from "react";
import { CHARACTERS } from "@/src/data/characters";
import type { CharacterRole } from "@/src/data/characters";
import MultiverseHero from "./MultiverseHero";
import CharactersFilterBar, { type SortKey } from "./CharactersFilterBar";
import CharacterGridCard from "./CharacterGridCard";

type RoleFilter = "all" | "heroes" | "villains";

function matchesRole(roleFilter: RoleFilter, role: CharacterRole) {
  if (roleFilter === "all") return true;
  if (roleFilter === "heroes") return role === "HERO";
  if (roleFilter === "villains") return role === "VILLAIN";
  return true;
}

const UNIVERSE_OPTS = ["all", ...Array.from(new Set(CHARACTERS.map((c) => c.universe)))];

/** First paint count; “Load more” adds this many from the filtered list. */
const PAGE_SIZE = 6;

export default function CharactersHub() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [universe, setUniverse] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("featured");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = CHARACTERS.filter((c) => {
      const text = `${c.name} ${c.universe} ${c.tagline}`.toLowerCase();
      const okSearch = !q || text.includes(q);
      const okRole = matchesRole(roleFilter, c.role);
      const okUniverse = universe === "all" || c.universe === universe;
      return okSearch && okRole && okUniverse;
    });

    const copy = [...list];
    const editorial = new Map(CHARACTERS.map((c, i) => [c.slug, i]));
    if (sortKey === "name-asc") copy.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortKey === "name-desc") copy.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortKey === "popularity-desc") copy.sort((a, b) => b.popularity - a.popularity);
    else copy.sort((a, b) => (editorial.get(a.slug) ?? 0) - (editorial.get(b.slug) ?? 0));
    return copy;
  }, [search, roleFilter, universe, sortKey]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, roleFilter, universe, sortKey]);

  const visible = useMemo(
    () => filtered.slice(0, Math.min(visibleCount, filtered.length)),
    [filtered, visibleCount],
  );

  const canLoadMore = visibleCount < filtered.length;

  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <MultiverseHero />

      <section className="relative z-20 mx-auto mb-12 w-full max-w-[1440px] px-6 md:-mt-8">
        <CharactersFilterBar
          search={search}
          onSearchChange={setSearch}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          universe={universe}
          onUniverseChange={setUniverse}
          sortKey={sortKey}
          onSortChange={setSortKey}
          universeOptions={UNIVERSE_OPTS}
        />
      </section>

      <main className="mx-auto max-w-[1440px] px-6 pb-24">
        <div
          id="character-grid"
          className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-7 md:grid-cols-4 md:gap-8 lg:grid-cols-5 lg:gap-8"
        >
          {visible.map((c) => (
            <CharacterGridCard key={c.slug} character={c} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-16 text-center text-zinc-500">No characters match your filters.</p>
        )}

        {filtered.length > 0 && canLoadMore && (
          <div className="mt-14 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((n) => Math.min(n + PAGE_SIZE, filtered.length))}
              className="rounded-xl border border-white/[0.1] bg-zinc-900/90 px-10 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition hover:border-cyan-500/50 hover:text-cyan-50"
            >
              Load more characters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
