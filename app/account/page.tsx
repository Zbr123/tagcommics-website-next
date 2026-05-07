"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SettingsSectionCard from "@/src/components/account/SettingsSectionCard";
import UniverseHeroCard from "@/src/components/account/UniverseHeroCard";
import { useAuth } from "@/src/hooks/use-auth";
import { fetchLibrary, type LibraryItem } from "@/src/lib/purchase-api";

export default function AccountPage() {
  const router = useRouter();
  const { user, token, isLoaded, logout } = useAuth();
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [libraryError, setLibraryError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace("/login?redirect=" + encodeURIComponent("/account"));
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (!isLoaded || !user || !token) return;
    setLibraryLoading(true);
    setLibraryError(null);
    fetchLibrary(token)
      .then((items) => setLibraryItems(items))
      .catch((error) =>
        setLibraryError(error instanceof Error ? error.message : "Failed to load your library."),
      )
      .finally(() => setLibraryLoading(false));
  }, [isLoaded, user, token]);

  if (!isLoaded || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="rounded-xl border border-white/10 bg-[#090d12] px-6 py-4 text-base font-semibold text-zinc-300">
          Loading your universe...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl space-y-7">
        <section id="universe" className="scroll-mt-28">
          <UniverseHeroCard userName={user.name} userEmail={user.email} />
        </section>

        <SettingsSectionCard id="library" title="Library" subtitle="Your Comic Collection">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-white/10 bg-[#0d131b] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Purchased Items</p>
              <p className="mt-2 text-3xl font-black text-white">{libraryItems.length}</p>
              <p className="mt-3 text-xs text-zinc-400">Synced from your backend library.</p>
            </article>
          </div>
          {libraryLoading ? (
            <p className="mt-4 text-sm text-zinc-400">Loading library...</p>
          ) : libraryError ? (
            <p className="mt-4 text-sm text-red-300">{libraryError}</p>
          ) : libraryItems.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-400">No purchased items found yet.</p>
          ) : (
            <div className="mt-4 space-y-2">
              {libraryItems.map((item) => (
                <article
                  key={`${item.item_type}:${item.id}`}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0d131b] p-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">{item.item_type}</p>
                  </div>
                  <Link
                    href={
                      `/reader/${encodeURIComponent(item.id)}?title=${encodeURIComponent(item.title)}${
                        item.item_type === "character_book" ? "&bookType=character_book" : ""
                      }`
                    }
                    className="rounded-lg border border-white/12 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-zinc-300 transition hover:border-[#58E8C1]/35 hover:text-white"
                  >
                    Open
                  </Link>
                </article>
              ))}
            </div>
          )}
        </SettingsSectionCard>

        <section className="rounded-2xl border border-white/10 bg-[#070b10] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.45)] sm:p-7">
          <header className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#58E8C1]">Session</p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
              Account actions
            </h2>
          </header>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/cart"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/12 bg-[#0d131b] px-5 text-sm font-bold text-zinc-100 transition hover:border-[#58E8C1]/35"
            >
              View cart
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-red-400/35 bg-red-900/10 px-5 text-sm font-bold text-red-300 transition hover:border-red-300/60 hover:text-red-200"
            >
              Log out
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
