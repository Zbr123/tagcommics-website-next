"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard from "@/src/components/ProductCard";

// Extended new arrivals comics database
const allNewArrivals = [
  { id: 1, title: "The Walking Dead Vol.1", author: "Robert Kirkman", price: 12.99, rating: 4.8, image: "/comic-slider1.png", category: "Graphic Novels", tag: "NEW" },
  { id: 2, title: "Saga Deluxe Edition", author: "Brian K. Vaughan", price: 24.99, rating: 4.9, image: "/comic-slider5.png", category: "Graphic Novels", tag: "HOT" },
  { id: 3, title: "Invincible Compendium", author: "Robert Kirkman", price: 39.99, rating: 4.7, image: "/comic-slider3.png", category: "Graphic Novels", tag: "NEW" },
  { id: 4, title: "Watchmen Absolute", author: "Alan Moore", price: 29.99, rating: 5.0, image: "/comic-slide4.png", category: "Graphic Novels", tag: "CLASSIC" },
  { id: 5, title: "Sin City Library", author: "Frank Miller", price: 34.99, rating: 4.8, image: "/comic-slider1.png", category: "Graphic Novels", tag: "SALE" },
  { id: 6, title: "Preacher Omnibus", author: "Garth Ennis", price: 49.99, rating: 4.9, image: "/comic-slider5.png", category: "Graphic Novels", tag: "BESTSELLER" },
  { id: 7, title: "Y: The Last Man", author: "Brian K. Vaughan", price: 19.99, rating: 4.8, image: "/comic-slider3.png", category: "Graphic Novels", tag: "NEW" },
  { id: 8, title: "Sandman Omnibus", author: "Neil Gaiman", price: 44.99, rating: 5.0, image: "/comic-slide4.png", category: "Graphic Novels", tag: "CLASSIC" },
  { id: 9, title: "Batman Annual", author: "Bob Kane", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.7, image: "/comic-slider5.png", category: "Comics", tag: "NEW" },
  { id: 10, title: "Deadpool #1", author: "Fabian Nicieza", price: 5.99, originalPrice: 11.99, discount: 50, rating: 4.6, image: "/comic-slider1.png", category: "Comics", tag: "NEW" },
  { id: 11, title: "Iron Man #1", author: "Stan Lee", price: 5.49, originalPrice: 10.99, discount: 50, rating: 4.7, image: "/comic-slide4.png", category: "Comics", tag: "NEW" },
  { id: 12, title: "The Flash", author: "Gardner Fox", price: 5.99, originalPrice: 11.99, discount: 50, rating: 4.6, image: "/comic-slider5.png", category: "Comics", tag: "NEW" },
  { id: 13, title: "Black Panther", author: "Stan Lee", price: 7.49, originalPrice: 14.99, discount: 50, rating: 4.9, image: "/comic-slide4.png", category: "Comics", tag: "NEW" },
  { id: 14, title: "Thor #1", author: "Stan Lee", price: 5.99, originalPrice: 11.99, discount: 50, rating: 4.8, image: "/comic-slider5.png", category: "Comics", tag: "NEW" },
  { id: 15, title: "The Walking Dead Vol.1", author: "Robert Kirkman", price: 12.99, originalPrice: 19.99, discount: 35, rating: 4.8, image: "/comic-slider3.png", category: "Graphic Novels", tag: "NEW" },
  { id: 16, title: "Invincible Compendium", author: "Robert Kirkman", price: 39.99, rating: 4.7, image: "/comic-slider3.png", category: "Graphic Novels", tag: "NEW" },
  { id: 17, title: "DC Black Label", author: "Various", price: 16.99, rating: 4.7, image: "/comic-slider5.png", category: "Graphic Novels", tag: "NEW" },
  { id: 18, title: "Indie Collection", author: "Various Artists", price: 22.99, rating: 4.8, image: "/comic-slider1.png", category: "Graphic Novels", tag: "NEW" },
  { id: 19, title: "My Hero Academia Vol.1", author: "Kohei Horikoshi", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, image: "/comic-slide4.png", category: "Manga", tag: "NEW" },
  { id: 20, title: "Demon Slayer Vol.1", author: "Koyoharu Gotouge", price: 8.99, originalPrice: 13.99, discount: 36, rating: 4.8, image: "/comic-slider1.png", category: "Manga", tag: "HOT" },
  { id: 21, title: "Bleach Vol.1", author: "Tite Kubo", price: 8.49, originalPrice: 14.99, discount: 43, rating: 4.7, image: "/comic-slider5.png", category: "Manga", tag: "HOT" },
  { id: 22, title: "Attack on Titan", author: "Hajime Isayama", price: 8.99, originalPrice: 14.99, discount: 40, rating: 4.8, image: "/comic-slider3.png", category: "Manga", tag: "HOT" },
  { id: 23, title: "Saga Deluxe Edition", author: "Brian K. Vaughan", price: 24.99, originalPrice: 34.99, discount: 29, rating: 4.9, image: "/comic-slide4.png", category: "Graphic Novels", tag: "HOT" },
  { id: 24, title: "Y: The Last Man", author: "Brian K. Vaughan", price: 19.99, rating: 4.8, image: "/comic-slider3.png", category: "Graphic Novels", tag: "NEW" },
];

const ITEMS_PER_PAGE = 12;

export default function NewArrivalsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  // Filter by category
  const filteredComics = allNewArrivals.filter(
    (comic) => selectedCategory === "All" || comic.category === selectedCategory
  );

  // Get displayed items
  const displayedComics = filteredComics.slice(0, displayCount);
  const hasMore = displayCount < filteredComics.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredComics.length));
  };

  const categories = ["All", "Comics", "Manga", "Graphic Novels"];

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-20 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl sm:text-3xl font-black text-white">New Arrivals</h1>
            </div>
            
            {/* Category Dropdown */}
            <div className="flex items-center gap-3">
              <label className="text-gray-400 text-sm font-medium">Filter by Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setDisplayCount(ITEMS_PER_PAGE); // Reset display count when category changes
                }}
                className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-yellow-400 min-w-[150px]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Showing {displayedComics.length} of {filteredComics.length} products
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
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
            <p className="text-gray-400 text-lg mb-4">No new arrival products found in this category.</p>
            <button
              onClick={() => setSelectedCategory("All")}
              className="text-yellow-400 hover:text-yellow-300 font-bold cursor-pointer"
            >
              View All Categories
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8 mb-8 mx-auto">
              {displayedComics.map((comic) => (
                <ProductCard key={comic.id} comic={comic} showTag={true} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="border-2 border-yellow-400 hover:bg-yellow-400 text-yellow-400 hover:text-black font-bold px-6 py-2.5 rounded-lg transition-all cursor-pointer"
                >
                  Load More Products
                </button>
              </div>
            )}

            {/* Show all loaded message */}
            {!hasMore && displayedComics.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">
                  You've viewed all {filteredComics.length} new arrival products
                  {selectedCategory !== "All" && ` in ${selectedCategory}`}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

