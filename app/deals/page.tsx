"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard from "@/src/components/ProductCard";

// Deals database
const allDeals = [
  { id: 1, title: "Spider-Man #1", author: "Stan Lee", price: 4.99, originalPrice: 9.99, discount: 50, rating: 4.9, sold: "2.5k", image: "/comic-slider1.png", category: "Comics", tag: "DEAL" },
  { id: 2, title: "Batman Annual", author: "Bob Kane", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.7, sold: "1.8k", image: "/comic-slider5.png", category: "Comics", tag: "DEAL" },
  { id: 3, title: "Attack on Titan", author: "Hajime Isayama", price: 8.99, originalPrice: 14.99, discount: 40, rating: 4.8, sold: "3.2k", image: "/comic-slider3.png", category: "Manga", tag: "DEAL" },
  { id: 4, title: "One Piece Vol.1", author: "Eiichiro Oda", price: 7.99, originalPrice: 15.99, discount: 50, rating: 4.9, sold: "5.1k", image: "/comic-slide4.png", category: "Manga", tag: "DEAL" },
  { id: 5, title: "Deadpool #1", author: "Fabian Nicieza", price: 5.99, originalPrice: 11.99, discount: 50, rating: 4.6, sold: "1.4k", image: "/comic-slider1.png", category: "Comics", tag: "DEAL" },
  { id: 6, title: "Wonder Woman", author: "William Moulton", price: 6.49, originalPrice: 12.99, discount: 50, rating: 4.7, sold: "1.8k", image: "/comic-slider5.png", category: "Comics", tag: "DEAL" },
  { id: 7, title: "X-Men #1", author: "Stan Lee", price: 5.99, originalPrice: 11.99, discount: 51, rating: 4.9, sold: "2.1k", image: "/comic-slider3.png", category: "Comics", tag: "DEAL" },
  { id: 8, title: "Superman Returns", author: "Jerry Siegel", price: 7.49, originalPrice: 14.99, discount: 50, rating: 4.8, sold: "2.0k", image: "/comic-slide4.png", category: "Comics", tag: "DEAL" },
  { id: 9, title: "Naruto Vol.1", author: "Masashi Kishimoto", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, sold: "4.5k", image: "/comic-slider1.png", category: "Manga", tag: "DEAL" },
  { id: 10, title: "My Hero Academia Vol.1", author: "Kohei Horikoshi", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, sold: "3.4k", image: "/comic-slide4.png", category: "Manga", tag: "DEAL" },
  { id: 11, title: "Demon Slayer Vol.1", author: "Koyoharu Gotouge", price: 8.99, originalPrice: 13.99, discount: 36, rating: 4.8, sold: "2.8k", image: "/comic-slider1.png", category: "Manga", tag: "DEAL" },
  { id: 12, title: "Dragon Ball Z", author: "Akira Toriyama", price: 8.99, originalPrice: 13.99, discount: 36, rating: 4.8, sold: "3.8k", image: "/comic-slider5.png", category: "Manga", tag: "DEAL" },
  { id: 13, title: "The Avengers", author: "Stan Lee", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.9, sold: "2.3k", image: "/comic-slider3.png", category: "Comics", tag: "DEAL" },
  { id: 14, title: "Hulk #1", author: "Stan Lee", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.7, sold: "1.6k", image: "/comic-slider3.png", category: "Comics", tag: "DEAL" },
  { id: 15, title: "Black Panther", author: "Stan Lee", price: 7.49, originalPrice: 14.99, discount: 50, rating: 4.9, sold: "1.9k", image: "/comic-slide4.png", category: "Comics", tag: "DEAL" },
  { id: 16, title: "Iron Man #1", author: "Stan Lee", price: 5.49, originalPrice: 10.99, discount: 50, rating: 4.7, sold: "1.5k", image: "/comic-slide4.png", category: "Comics", tag: "DEAL" },
  { id: 17, title: "Jujutsu Kaisen Vol.1", author: "Gege Akutami", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, sold: "3.1k", image: "/comic-slider3.png", category: "Manga", tag: "DEAL" },
  { id: 18, title: "Chainsaw Man Vol.1", author: "Tatsuki Fujimoto", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.8, sold: "2.9k", image: "/comic-slide4.png", category: "Manga", tag: "DEAL" },
  { id: 19, title: "Bleach Vol.1", author: "Tite Kubo", price: 8.49, originalPrice: 14.99, discount: 43, rating: 4.7, sold: "2.7k", image: "/comic-slider5.png", category: "Manga", tag: "DEAL" },
  { id: 20, title: "Thor #1", author: "Stan Lee", price: 5.99, originalPrice: 11.99, discount: 50, rating: 4.8, sold: "1.7k", image: "/comic-slider5.png", category: "Comics", tag: "DEAL" },
];

const ITEMS_PER_PAGE = 12;

export default function DealsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  // Filter by category
  const filteredDeals = allDeals.filter(
    (deal) => selectedCategory === "All" || deal.category === selectedCategory
  );

  // Get displayed items
  const displayedDeals = filteredDeals.slice(0, displayCount);
  const hasMore = displayCount < filteredDeals.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredDeals.length));
  };

  const categories = ["All", "Comics", "Manga", "Graphic Novels"];

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-20 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl sm:text-3xl font-black text-white">Today&apos;s Deals</h1>
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-3">
              <label className="text-gray-400 text-sm font-medium">Filter by Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setDisplayCount(ITEMS_PER_PAGE);
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
              Showing {displayedDeals.length} of {filteredDeals.length} deals
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
        {displayedDeals.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">No deals found in this category.</p>
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
              {displayedDeals.map((deal) => (
                <ProductCard key={deal.id} comic={deal} showSold={true} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="border-2 border-yellow-400 hover:bg-yellow-400 text-yellow-400 hover:text-black font-bold px-6 py-2.5 rounded-lg transition-all cursor-pointer"
                >
                  Load More Deals
                </button>
              </div>
            )}

            {/* Show all loaded message */}
            {!hasMore && displayedDeals.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">
                  You've viewed all {filteredDeals.length} deals
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
