"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SettingsSectionCard from "@/src/components/account/SettingsSectionCard";
import SettingsSidebar from "@/src/components/account/SettingsSidebar";
import UniverseHeroCard from "@/src/components/account/UniverseHeroCard";
import { useAuth } from "@/src/hooks/use-auth";

const SIDEBAR_ITEMS = [
  { href: "#universe", label: "My Universe" },
  { href: "#preferences", label: "Reading Preferences" },
  { href: "#library", label: "Library" },
  { href: "#billing", label: "Billing" },
  { href: "#security", label: "Security" },
];

const LIBRARY_GROUPS = [
  { title: "Purchased Comics", count: 42, action: "View Library" },
  { title: "Downloads", count: 18, action: "Manage Offline" },
];

const PURCHASE_HISTORY = [
  { item: "Cyber Arc Vol. 3", date: "Apr 12, 2026", amount: "$8.99" },
  { item: "Neon Samurai Omnibus", date: "Apr 05, 2026", amount: "$21.00" },
  { item: "Starlight District #14", date: "Mar 28, 2026", amount: "$4.49" },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoaded, logout } = useAuth();
  const [preferences, setPreferences] = useState({
    readingDirection: "Left to Right",
    pageMode: "Single Page",
    darkMode: true,
    autoResume: true,
    zoomMemory: true,
  });

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace("/login?redirect=" + encodeURIComponent("/account"));
    }
  }, [isLoaded, user, router]);

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
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-7 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10">
        <SettingsSidebar items={SIDEBAR_ITEMS} />

        <div className="space-y-7">
          <section id="universe" className="scroll-mt-28">
            <UniverseHeroCard userName={user.name} userEmail={user.email} />
          </section>

          {/* <SettingsSectionCard id="preferences" title="Reading Preferences" subtitle="Optimize Your Reading Flow">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
                Reading Direction
                <select
                  value={preferences.readingDirection}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, readingDirection: e.target.value }))}
                  className="mt-2 h-11 w-full rounded-xl border border-white/12 bg-[#0d131b] px-3 text-sm font-semibold normal-case tracking-normal text-white outline-none transition focus:border-[#58E8C1]/50"
                >
                  <option>Left to Right</option>
                  <option>Right to Left (Manga)</option>
                </select>
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
                Page Mode
                <select
                  value={preferences.pageMode}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, pageMode: e.target.value }))}
                  className="mt-2 h-11 w-full rounded-xl border border-white/12 bg-[#0d131b] px-3 text-sm font-semibold normal-case tracking-normal text-white outline-none transition focus:border-[#58E8C1]/50"
                >
                  <option>Single Page</option>
                  <option>Double Page Spread</option>
                </select>
              </label>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { key: "darkMode", label: "Dark Mode" },
                { key: "autoResume", label: "Auto Resume" },
                { key: "zoomMemory", label: "Zoom Memory" },
              ].map((item) => {
                const prefKey = item.key as keyof typeof preferences;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setPreferences((prev) => ({ ...prev, [prefKey]: !prev[prefKey] }))}
                    className={`rounded-xl border px-4 py-3 text-left text-sm font-bold transition ${
                      preferences[prefKey]
                        ? "border-[#58E8C1]/45 bg-[#0c1a19] text-white"
                        : "border-white/12 bg-[#0d131b] text-zinc-300 hover:border-[#58E8C1]/25"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </SettingsSectionCard> */}

          <SettingsSectionCard id="library" title="Library" subtitle="Your Comic Collection">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {LIBRARY_GROUPS.map((group) => (
                <article key={group.title} className="rounded-xl border border-white/10 bg-[#0d131b] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{group.title}</p>
                  <p className="mt-2 text-3xl font-black text-white">{group.count}</p>
                  <button
                    type="button"
                    className="mt-4 inline-flex rounded-lg border border-white/12 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-zinc-300 transition hover:border-[#58E8C1]/35 hover:text-white"
                  >
                    {group.action}
                  </button>
                </article>
              ))}
            </div>
          </SettingsSectionCard>

          <SettingsSectionCard id="billing" title="Billing" subtitle="Subscriptions & Purchase History">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-white/10 bg-[#0d131b] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Payment Method</p>
                <p className="mt-2 text-lg font-bold text-white">Visa •••• 4242</p>
                <p className="mt-1 text-sm text-zinc-400">Expires 07/29</p>
                <button className="mt-4 rounded-lg border border-white/12 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-zinc-300 transition hover:border-[#58E8C1]/35">
                  Update Card
                </button>
              </article>

              <article className="rounded-xl border border-white/10 bg-[#0d131b] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Purchase History</p>
                <ul className="mt-3 space-y-2">
                  {PURCHASE_HISTORY.map((purchase) => (
                    <li key={purchase.item} className="flex items-center justify-between border-b border-white/8 pb-2 last:border-b-0">
                      <div>
                        <p className="text-sm font-semibold text-white">{purchase.item}</p>
                        <p className="text-xs text-zinc-500">{purchase.date}</p>
                      </div>
                      <span className="text-sm font-bold text-[#58E8C1]">{purchase.amount}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </SettingsSectionCard>

          <SettingsSectionCard id="security" title="Security" subtitle="Protect Your Account">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { title: "Password", body: "Last changed 36 days ago" },
              
                { title: "Two-Factor Auth", body: "Enabled via authenticator app" },
              ].map((item) => (
                <article key={item.title} className="rounded-xl border border-white/10 bg-[#0d131b] p-4">
                  <p className="text-lg font-bold text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-zinc-400">{item.body}</p>
                  <button
                    type="button"
                    className="mt-4 rounded-lg border border-white/12 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-zinc-300 transition hover:border-[#58E8C1]/35 hover:text-white"
                  >
                    Manage
                  </button>
                </article>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href=""
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/12 bg-[#0d131b] px-5 text-sm font-bold text-zinc-100 transition hover:border-[#58E8C1]/35"
              >
                Your Orders
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
          </SettingsSectionCard>
        </div>
      </div>
    </main>
  );
}
