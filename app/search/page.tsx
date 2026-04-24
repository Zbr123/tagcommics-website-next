"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useMemo, Suspense } from "react";

const allComics = [
  { id: 1, title: "Spider-Man #1", author: "Stan Lee", price: 4.99, originalPrice: 9.99, discount: 50, rating: 4.9, sold: "2.5k", image: "/comic-slider1.png", category: "Comics", tag: "BESTSELLER" },
  { id: 2, title: "Batman Annual", author: "Bob Kane", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.7, sold: "1.8k", image: "/comic-slider5.png", category: "Comics", tag: "NEW" },
  { id: 3, title: "Attack on Titan", author: "Hajime Isayama", price: 8.99, originalPrice: 14.99, discount: 40, rating: 4.8, sold: "3.2k", image: "/comic-slider3.png", category: "Manga", tag: "HOT" },
  { id: 4, title: "One Piece Vol.1", author: "Eiichiro Oda", price: 7.99, originalPrice: 15.99, discount: 50, rating: 4.9, sold: "5.1k", image: "/comic-slide4.png", category: "Manga", tag: "BESTSELLER" },
  { id: 5, title: "Deadpool #1", author: "Fabian Nicieza", price: 5.99, originalPrice: 11.99, discount: 50, rating: 4.6, sold: "900", image: "/comic-slider1.png", category: "Comics", tag: "NEW" },
  { id: 6, title: "Wonder Woman", author: "William Moulton Marston", price: 6.49, originalPrice: 12.99, discount: 50, rating: 4.8, sold: "1.2k", image: "/comic-slider5.png", category: "Comics", tag: "CLASSIC" },
  { id: 7, title: "X-Men #1", author: "Stan Lee", price: 5.99, originalPrice: 11.99, discount: 51, rating: 4.9, sold: "2.1k", image: "/comic-slider3.png", category: "Comics", tag: "BESTSELLER" },
  { id: 8, title: "Superman Returns", author: "Jerry Siegel", price: 7.49, originalPrice: 14.99, discount: 50, rating: 4.7, sold: "1.5k", image: "/comic-slide4.png", category: "Comics", tag: "CLASSIC" },
  { id: 9, title: "Marvel Masterworks", author: "Stan Lee", price: 19.99, rating: 4.9, sold: "2.5k", image: "/comic-slider1.png", category: "Graphic Novels", tag: "BESTSELLER" },
  { id: 10, title: "DC Black Label", author: "Various", price: 16.99, rating: 4.7, sold: "1.8k", image: "/comic-slider5.png", category: "Graphic Novels", tag: "NEW" },
  { id: 11, title: "Manga Classics Box Set", author: "Various", price: 44.99, rating: 4.8, sold: "3.2k", image: "/comic-slider3.png", category: "Manga", tag: "BESTSELLER" },
  { id: 12, title: "The Walking Dead Vol.1", author: "Robert Kirkman", price: 12.99, rating: 4.8, image: "/comic-slider1.png", category: "Graphic Novels", tag: "NEW" },
  { id: 13, title: "Saga Deluxe Edition", author: "Brian K. Vaughan", price: 24.99, rating: 4.9, image: "/comic-slider5.png", category: "Graphic Novels", tag: "HOT" },
  { id: 14, title: "Invincible Compendium", author: "Robert Kirkman", price: 39.99, rating: 4.7, image: "/comic-slider3.png", category: "Graphic Novels", tag: "NEW" },
  { id: 15, title: "Watchmen Absolute", author: "Alan Moore", price: 29.99, rating: 5.0, image: "/comic-slide4.png", category: "Graphic Novels", tag: "CLASSIC" },
  { id: 16, title: "Naruto Vol.1", author: "Masashi Kishimoto", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, sold: "4.5k", image: "/comic-slider1.png", category: "Manga", tag: "BESTSELLER" },
  { id: 17, title: "Dragon Ball Z", author: "Akira Toriyama", price: 8.99, originalPrice: 13.99, discount: 36, rating: 4.8, sold: "3.8k", image: "/comic-slider5.png", category: "Manga", tag: "CLASSIC" },
  { id: 18, title: "The Avengers", author: "Stan Lee", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.9, sold: "2.3k", image: "/comic-slider3.png", category: "Comics", tag: "BESTSELLER" },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();

  const filteredComics = useMemo(() => {
    if (!query) return allComics;
    const q = query.toLowerCase();
    return allComics.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.author.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-black pb-16 pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="sr-only">Catalog search results</h1>
          {query ? (
            <p className="text-sm text-zinc-500">
              Results for <span className="font-semibold text-zinc-300">&quot;{query}&quot;</span>
            </p>
          ) : (
            <p className="text-sm text-zinc-500">Browse the full catalog — use the search field in the header to filter.</p>
          )}
        </header>

        <div className="mx-auto max-w-7xl">
          {filteredComics.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-zinc-400">No comics match that search.</p>
              <p className="mt-2 text-sm text-zinc-600">Try another title or name in the bar above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredComics.map((comic) => (
                <Link
                  key={comic.id}
                  href={`/reader/${comic.id}`}
                  className="group overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-zinc-950 to-zinc-900 transition hover:border-brand/40 hover:shadow-lg hover:shadow-brand/5"
                >
                  <div className="relative">
                    <div className="relative aspect-[3/4] overflow-hidden bg-black/40">
                      <Image
                        src={comic.image}
                        alt={comic.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {comic.discount ? (
                        <div className="absolute left-2 top-2 z-10 rounded-full bg-red-500 px-2.5 py-1 text-xs font-black text-white shadow-lg">
                          -{comic.discount}%
                        </div>
                      ) : null}
                      {comic.tag ? (
                        <div
                          className={`absolute z-10 rounded-full px-2.5 py-1 text-xs font-black shadow-lg ${
                            comic.discount ? "right-2 top-2" : "left-2 top-2"
                          } ${
                            comic.tag === "NEW"
                              ? "bg-emerald-600 text-white"
                              : comic.tag === "HOT"
                                ? "bg-red-600 text-white"
                                : comic.tag === "CLASSIC"
                                  ? "bg-violet-600 text-white"
                                  : comic.tag === "BESTSELLER"
                                    ? "bg-brand/90 text-brand-foreground"
                                    : "bg-sky-600 text-white"
                          }`}
                        >
                          {comic.tag}
                        </div>
                      ) : null}
                    </div>
                    <div className="p-4">
                      <h3 className="mb-1.5 line-clamp-2 min-h-[2.5rem] text-sm font-bold text-white transition group-hover:text-brand">
                        {comic.title}
                      </h3>
                      <p className="mb-2 truncate text-xs text-zinc-400">{comic.author}</p>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-black text-brand">${comic.price}</span>
                          {"originalPrice" in comic && comic.originalPrice != null ? (
                            <span className="text-xs text-zinc-500 line-through">${comic.originalPrice}</span>
                          ) : null}
                        </div>
                        {comic.rating != null ? (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-brand">★</span>
                            <span className="text-xs text-zinc-300">{comic.rating}</span>
                          </div>
                        ) : null}
                      </div>
                      {"sold" in comic && comic.sold ? (
                        <p className="text-xs text-zinc-500">{comic.sold} sold</p>
                      ) : null}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black">
          <p className="text-lg text-brand">Loading…</p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
