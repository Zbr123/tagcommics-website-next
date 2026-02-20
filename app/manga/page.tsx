"use client";

import { useState } from "react";
import Link from "next/link";
import HeroMangaCarousel from "@/src/components/category/HeroMangaCarousel";
import ProductCard from "@/src/components/ProductCard";

/** Hero banner carousel slides (badge, title, subtitle, image, link to detail page) */
const MANGA_HERO_SLIDES = [
  { badge: "START", title: "Fragrant Blooms for Dignity", subtitle: "Two rival schools next door", image: "/comic_slider7.png", link: "7" },
  { badge: "HOT", title: "Infini Force", subtitle: "All began with mysterious pencil", image: "/comic_slider8.png", link: "8" },
  { badge: "NEW", title: "Inactive - Not so ordinary", subtitle: "A new arrival", image: "/comic_slider9.png", link: "9" },
  { badge: "START", title: "Best Manga Series", subtitle: "Discover your next favorite", image: "/comic_slider10.png", link: "10" },
];

// Manga database
const allManga = [
  { id: 1, title: "One Piece Vol.1", author: "Eiichiro Oda", price: 7.99, originalPrice: 15.99, discount: 50, rating: 4.9, sold: "5.1k", image: "/comic-slide4.png", category: "Manga", tag: "BESTSELLER" },
  { id: 2, title: "Naruto Vol.1", author: "Masashi Kishimoto", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, sold: "4.5k", image: "/comic-slider1.png", category: "Manga", tag: "BESTSELLER" },
  { id: 3, title: "My Hero Academia Vol.1", author: "Kohei Horikoshi", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, sold: "3.4k", image: "/comic-slide4.png", category: "Manga", tag: "BESTSELLER" },
  { id: 4, title: "Dragon Ball Z", author: "Akira Toriyama", price: 8.99, originalPrice: 13.99, discount: 36, rating: 4.8, sold: "3.8k", image: "/comic-slider5.png", category: "Manga", tag: "CLASSIC" },
  { id: 5, title: "Attack on Titan", author: "Hajime Isayama", price: 8.99, originalPrice: 14.99, discount: 40, rating: 4.8, sold: "3.2k", image: "/comic-slider3.png", category: "Manga", tag: "HOT" },
  { id: 6, title: "Demon Slayer Vol.1", author: "Koyoharu Gotouge", price: 8.99, originalPrice: 13.99, discount: 36, rating: 4.8, sold: "2.8k", image: "/comic-slider1.png", category: "Manga", tag: "HOT" },
  { id: 7, title: "Jujutsu Kaisen Vol.1", author: "Gege Akutami", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, sold: "3.1k", image: "/comic-slider3.png", category: "Manga", tag: "HOT" },
  { id: 8, title: "Chainsaw Man Vol.1", author: "Tatsuki Fujimoto", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.8, sold: "2.9k", image: "/comic-slide4.png", category: "Manga", tag: "HOT" },
  { id: 9, title: "Tokyo Revengers Vol.1", author: "Ken Wakui", price: 8.99, originalPrice: 13.99, discount: 36, rating: 4.7, sold: "2.5k", image: "/comic-slider5.png", category: "Manga", tag: "NEW" },
  { id: 10, title: "Spy x Family Vol.1", author: "Tatsuya Endo", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, sold: "3.6k", image: "/comic-slider1.png", category: "Manga", tag: "BESTSELLER" },
  { id: 11, title: "Bleach Vol.1", author: "Tite Kubo", price: 8.49, originalPrice: 14.99, discount: 43, rating: 4.7, sold: "2.7k", image: "/comic-slider5.png", category: "Manga", tag: "CLASSIC" },
  { id: 12, title: "Death Note Vol.1", author: "Tsugumi Ohba", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, sold: "4.2k", image: "/comic-slider3.png", category: "Manga", tag: "CLASSIC" },
  { id: 13, title: "Fullmetal Alchemist Vol.1", author: "Hiromu Arakawa", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, sold: "3.8k", image: "/comic-slide4.png", category: "Manga", tag: "CLASSIC" },
  { id: 14, title: "One Punch Man Vol.1", author: "ONE", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.8, sold: "3.3k", image: "/comic-slider1.png", category: "Manga", tag: "BESTSELLER" },
  { id: 15, title: "Hunter x Hunter Vol.1", author: "Yoshihiro Togashi", price: 8.99, originalPrice: 13.99, discount: 36, rating: 4.9, sold: "3.0k", image: "/comic-slider3.png", category: "Manga", tag: "CLASSIC" },
  { id: 16, title: "Blue Lock Vol.1", author: "Muneyuki Kaneshiro", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.7, sold: "2.4k", image: "/comic-slider5.png", category: "Manga", tag: "HOT" },
  { id: 17, title: "Mushoku Tensei Vol.1", author: "Rifujin na Magonote", price: 11.99, originalPrice: 16.99, discount: 29, rating: 4.8, sold: "2.1k", image: "/comic-slider1.png", category: "Manga", tag: "NEW" },
  { id: 18, title: "Solo Leveling Vol.1", author: "Chugong", price: 12.99, originalPrice: 18.99, discount: 32, rating: 4.8, sold: "2.6k", image: "/comic-slide4.png", category: "Manga", tag: "HOT" },
  { id: 19, title: "Vinland Saga Vol.1", author: "Makoto Yukimura", price: 10.99, originalPrice: 15.99, discount: 31, rating: 4.8, sold: "2.2k", image: "/comic-slider3.png", category: "Manga", tag: "NEW" },
  { id: 20, title: "Berserk Vol.1", author: "Kentaro Miura", price: 12.99, originalPrice: 18.99, discount: 32, rating: 4.9, sold: "2.8k", image: "/comic-slider5.png", category: "Manga", tag: "CLASSIC" },
];

const ITEMS_PER_PAGE = 12;

export default function MangaPage() {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  // Filter by genre
  const filteredManga = allManga.filter(
    (manga) => selectedGenre === "All" || manga.tag === selectedGenre.toUpperCase()
  );

  // Get displayed items
  const displayedManga = filteredManga.slice(0, displayCount);
  const hasMore = displayCount < filteredManga.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredManga.length));
  };

  const genres = ["All", "Bestseller", "New", "Hot", "Classic"];

  return (
    <div className="min-h-screen bg-black">
      {/* Banner hero section - sliding manga covers + text */}
      <HeroMangaCarousel slides={MANGA_HERO_SLIDES} />

      <div className="mx-auto max-w-12xl px-4 sm:px-6 lg:px-20 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl sm:text-3xl font-black text-white">Manga</h1>
            </div>

            {/* Genre Dropdown */}
            <div className="flex items-center gap-3">
              <label className="text-gray-400 text-sm font-medium">Filter by Genre:</label>
              <select
                value={selectedGenre}
                onChange={(e) => {
                  setSelectedGenre(e.target.value);
                  setDisplayCount(ITEMS_PER_PAGE);
                }}
                className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-yellow-400 min-w-[150px]"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Showing {displayedManga.length} of {filteredManga.length} manga
              {selectedGenre !== "All" && ` in ${selectedGenre}`}
            </p>
            <Link
              href="/"
              className="text-yellow-400 hover:text-yellow-300 font-bold text-sm flex items-center gap-1"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        {displayedManga.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">No manga found in this genre.</p>
            <button
              onClick={() => setSelectedGenre("All")}
              className="text-yellow-400 hover:text-yellow-300 font-bold cursor-pointer"
            >
              View All Genres
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 mb-8 mx-auto">
              {displayedManga.map((manga) => (
                <ProductCard key={manga.id} comic={manga} showSold={true} cardWidth="w-full" />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="border-2 border-yellow-400 hover:bg-yellow-400 text-yellow-400 hover:text-black font-bold px-6 py-2.5 rounded-lg transition-all cursor-pointer"
                >
                  Load More Manga 
                </button>
              </div>
            )}

            {/* Show all loaded message */}
            {!hasMore && displayedManga.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">
                  You've viewed all {filteredManga.length} manga
                  {selectedGenre !== "All" && ` in ${selectedGenre}`}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}