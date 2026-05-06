"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchLibrary, readStoredAuthToken, type LibraryItem } from "@/src/lib/purchase-api";

export default function PaymentSuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSessionId(params.get("session_id"));

    const token = readStoredAuthToken();
    if (!token) {
      setLoading(false);
      setError("Log in to view your purchased library.");
      return;
    }
    fetchLibrary(token)
      .then((items) => setLibraryItems(items))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load library."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-2xl px-4 text-center">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-black text-white mb-4">Payment Successful</h1>
        <p className="text-gray-400 mb-2">Your payment is being verified by the backend and your library is updated via webhook.</p>
        {sessionId ? <p className="text-xs text-zinc-500 mb-8">Session: {sessionId}</p> : <div className="mb-8" />}

        <div className="rounded-xl border border-white/10 bg-[#0d131b] p-5 text-left">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Your Library</p>
          {loading ? (
            <p className="mt-3 text-sm text-zinc-400">Loading purchased items...</p>
          ) : error ? (
            <p className="mt-3 text-sm text-red-300">{error}</p>
          ) : libraryItems.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-400">No purchased items found yet. It may take a moment after payment.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {libraryItems.slice(0, 6).map((item) => (
                <div key={`${item.item_type}:${item.id}`} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 p-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">{item.item_type}</p>
                  </div>
                  <Link href={`/reader/${encodeURIComponent(item.id)}?title=${encodeURIComponent(item.title)}${item.item_type === "character_book" ? "&bookType=character_book" : ""}`} className="text-xs font-bold uppercase tracking-[0.08em] text-brand hover:text-brand/80">
                    Open
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-3 px-8 rounded-lg transition-all">
            Continue Shopping
          </Link>
          <Link href="/account#library" className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg border border-gray-700 transition-all">
            View Library
          </Link>
        </div>
      </div>
    </div>
  );
}
