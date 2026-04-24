"use client";

import MultiverseSearchField from "@/src/components/ui/MultiverseSearchField";

type RoleFilter = "all" | "heroes" | "villains";

export type SortKey = "featured" | "name-asc" | "name-desc" | "popularity-desc";

export interface CharactersFilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  roleFilter: RoleFilter;
  onRoleFilterChange: (v: RoleFilter) => void;
  universe: string;
  onUniverseChange: (v: string) => void;
  sortKey: SortKey;
  onSortChange: (v: SortKey) => void;
  universeOptions: string[];
}

const roles: { id: RoleFilter; label: string }[] = [
  { id: "all", label: "All Roles" },
  { id: "heroes", label: "Heroes" },
  { id: "villains", label: "Villains" },
];

const filterSelectClass =
  "min-w-[10.5rem] cursor-pointer appearance-none rounded-xl border border-white/15 bg-zinc-900/90 py-2.5 pl-3 pr-9 text-xs font-semibold text-zinc-100 shadow-sm transition duration-200 ease-out hover:border-brand/40 hover:bg-zinc-800/95 hover:text-brand hover:shadow-md focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/45 focus:ring-offset-2 focus:ring-offset-zinc-950 md:min-w-[12rem] md:text-sm";

export default function CharactersFilterBar({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  universe,
  onUniverseChange,
  sortKey,
  onSortChange,
  universeOptions,
}: CharactersFilterBarProps) {
  return (
    <div
      id="search-filters"
      className="glass-panel relative z-20 flex w-full flex-col gap-4 rounded-2xl border border-white/10 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.5)] md:flex-row md:items-center md:justify-between"
    >
      <div className="w-full md:w-1/3">
        <MultiverseSearchField
          id="characters-search"
          value={search}
          onChange={onSearchChange}
          placeholder="Search characters..."
          aria-label="Search characters"
        />
      </div>

      <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:flex-wrap md:items-center md:justify-end md:gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onRoleFilterChange(r.id)}
              className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 md:text-sm ${
                roleFilter === r.id
                  ? "bg-white text-black shadow-md hover:bg-zinc-100 hover:shadow-lg hover:brightness-[1.02]"
                  : "border border-white/15 bg-zinc-900/80 text-zinc-100 hover:scale-[1.02] hover:border-brand/40 hover:bg-zinc-800/95 hover:text-brand active:scale-[0.98]"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="group relative">
            <select
              value={universe}
              onChange={(e) => onUniverseChange(e.target.value)}
              className={filterSelectClass}
              aria-label="Filter by universe"
            >
              {universeOptions.map((u) => (
                <option key={u} value={u}>
                  {u === "all" ? "All Universes" : u}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400 transition-colors duration-200 group-hover:text-brand"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>

          <div className="group relative">
            <select
              value={sortKey}
              onChange={(e) => onSortChange(e.target.value as SortKey)}
              className={filterSelectClass}
              aria-label="Sort order"
            >
              <option value="featured">Popularity</option>
              <option value="popularity-desc">Popularity: high → low</option>
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
            </select>
            <svg
              className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400 transition-colors duration-200 group-hover:text-brand"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
