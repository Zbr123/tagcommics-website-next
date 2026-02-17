"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard from "@/src/components/ProductCard";

// Comics database
const allComics = [
  { id: 1, title: "Spider-Man #1", author: "Stan Lee", price: 4.99, originalPrice: 9.99, discount: 50, rating: 4.9, sold: "2.5k", image: "/comic-slider1.png", category: "Comics", tag: "BESTSELLER" },
  { id: 2, title: "X-Men #1", author: "Stan Lee", price: 5.99, originalPrice: 11.99, discount: 51, rating: 4.9, sold: "2.1k", image: "/comic-slider3.png", category: "Comics", tag: "BESTSELLER" },
  { id: 3, title: "The Avengers", author: "Stan Lee", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.9, sold: "2.3k", image: "/comic-slider3.png", category: "Comics", tag: "BESTSELLER" },
  { id: 4, title: "Batman Annual", author: "Bob Kane", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.7, sold: "1.8k", image: "/comic-slider5.png", category: "Comics", tag: "NEW" },
  { id: 5, title: "Hulk #1", author: "Stan Lee", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.7, sold: "1.6k", image: "/comic-slider3.png", category: "Comics", tag: "BESTSELLER" },
  { id: 6, title: "Black Panther", author: "Stan Lee", price: 7.49, originalPrice: 14.99, discount: 50, rating: 4.9, sold: "1.9k", image: "/comic-slide4.png", category: "Comics", tag: "NEW" },
  { id: 7, title: "Deadpool #1", author: "Fabian Nicieza", price: 5.99, originalPrice: 11.99, discount: 50, rating: 4.6, sold: "1.4k", image: "/comic-slider1.png", category: "Comics", tag: "NEW" },
  { id: 8, title: "Iron Man #1", author: "Stan Lee", price: 5.49, originalPrice: 10.99, discount: 50, rating: 4.7, sold: "1.5k", image: "/comic-slide4.png", category: "Comics", tag: "NEW" },
  { id: 9, title: "The Flash", author: "Gardner Fox", price: 5.99, originalPrice: 11.99, discount: 50, rating: 4.6, sold: "1.3k", image: "/comic-slider5.png", category: "Comics", tag: "NEW" },
  { id: 10, title: "Thor #1", author: "Stan Lee", price: 5.99, originalPrice: 11.99, discount: 50, rating: 4.8, sold: "1.7k", image: "/comic-slider5.png", category: "Comics", tag: "NEW" },
  { id: 11, title: "Captain America", author: "Jack Kirby", price: 6.49, originalPrice: 12.99, discount: 50, rating: 4.8, sold: "1.6k", image: "/comic-slider1.png", category: "Comics", tag: "BESTSELLER" },
  { id: 12, title: "Superman #1", author: "Jerry Siegel", price: 7.99, originalPrice: 14.99, discount: 47, rating: 4.9, sold: "2.0k", image: "/comic-slider3.png", category: "Comics", tag: "CLASSIC" },
  { id: 13, title: "Wonder Woman", author: "William Moulton", price: 6.49, originalPrice: 12.99, discount: 50, rating: 4.7, sold: "1.8k", image: "/comic-slider5.png", category: "Comics", tag: "NEW" },
  { id: 14, title: "Aquaman #1", author: "Paul Norris", price: 5.99, originalPrice: 11.99, discount: 50, rating: 4.5, sold: "1.2k", image: "/comic-slider1.png", category: "Comics", tag: "NEW" },
  { id: 15, title: "Green Lantern", author: "John Broome", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.6, sold: "1.4k", image: "/comic-slide4.png", category: "Comics", tag: "NEW" },
  { id: 16, title: "Wolverine #1", author: "Chris Claremont", price: 7.99, originalPrice: 14.99, discount: 47, rating: 4.8, sold: "1.9k", image: "/comic-slider3.png", category: "Comics", tag: "BESTSELLER" },
  { id: 17, title: "Doctor Strange", author: "Stan Lee", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.7, sold: "1.5k", image: "/comic-slider5.png", category: "Comics", tag: "NEW" },
  { id: 18, title: "Ant-Man #1", author: "Stan Lee", price: 5.49, originalPrice: 10.99, discount: 50, rating: 4.6, sold: "1.3k", image: "/comic-slider1.png", category: "Comics", tag: "NEW" },
  { id: 19, title: "Silver Surfer", author: "Stan Lee", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.8, sold: "1.6k", image: "/comic-slide4.png", category: "Comics", tag: "CLASSIC" },
  { id: 20, title: "Venom #1", author: "David Michelinie", price: 7.49, originalPrice: 14.99, discount: 50, rating: 4.7, sold: "1.8k", image: "/comic-slider3.png", category: "Comics", tag: "HOT" },
];

const ITEMS_PER_PAGE = 12;

export default function ComicsPage() {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  // Filter by genre
  const filteredComics = allComics.filter(
    (comic) => selectedGenre === "All" || comic.tag === selectedGenre.toUpperCase()
  );

  // Get displayed items
  const displayedComics = filteredComics.slice(0, displayCount);
  const hasMore = displayCount < filteredComics.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredComics.length));
  };

  const genres = ["All", "Bestseller", "New", "Hot", "Classic"];

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-12xl px-4 sm:px-6 lg:px-20 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl sm:text-3xl font-black text-white">Comic Books</h1>
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
              Showing {displayedComics.length} of {filteredComics.length} comic books
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
        {displayedComics.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">No comics found in this genre.</p>
            <button
              onClick={() => setSelectedGenre("All")}
              className="text-yellow-400 hover:text-yellow-300 font-bold cursor-pointer"
            >
              View All Genres
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 mb-8 mx-auto px-2">
              {displayedComics.map((comic) => (
                <ProductCard key={comic.id} comic={comic} showSold={true} cardWidth="w-full" />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="border-2 border-yellow-400 hover:bg-yellow-400 text-yellow-400 hover:text-black font-bold px-6 py-2.5 rounded-lg transition-all cursor-pointer"
                >
                  Load More Comics
                </button>
              </div>
            )}

            {/* Show all loaded message */}
            {!hasMore && displayedComics.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">
                  You've viewed all {filteredComics.length} comic books
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
