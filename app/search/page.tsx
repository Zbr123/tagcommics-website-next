"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, Suspense } from "react";

// Mock comics database - In a real app, this would come from an API
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
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "All";
  const [sortBy, setSortBy] = useState("featured");

  // Filter comics based on search query
  const filteredComics = allComics.filter((comic) => {
    const matchesQuery = query === "" || 
      comic.title.toLowerCase().includes(query.toLowerCase()) ||
      comic.author.toLowerCase().includes(query.toLowerCase()) ||
      comic.category.toLowerCase().includes(query.toLowerCase());
    
    const matchesCategory = category === "All" || comic.category === category;
    
    return matchesQuery && matchesCategory;
  });

  // Sort comics
  const sortedComics = [...filteredComics].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "newest":
        return b.id - a.id;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Results Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
                {query ? `Search results for "${query}"` : "All Comics"}
              </h1>
              <p className="text-gray-400 text-sm">
                {sortedComics.length} {sortedComics.length === 1 ? "result" : "results"} found
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-gray-400 text-sm">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-yellow-400"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
              <h2 className="text-white font-black text-lg mb-4">Filters</h2>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-white font-bold text-sm mb-3">Category</h3>
                <div className="space-y-2">
                  {["All", "Comics", "Graphic Novels", "Manga"].map((cat) => (
                    <Link
                      key={cat}
                      href={`/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(cat)}`}
                      className={`block text-sm py-1 ${
                        category === cat
                          ? "text-yellow-400 font-bold"
                          : "text-gray-400 hover:text-yellow-400"
                      } transition-colors`}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-white font-bold text-sm mb-3">Price</h3>
                <div className="space-y-2">
                  {["$0 - $10", "$10 - $20", "$20 - $30", "$30+"].map((range) => (
                    <label key={range} className="flex items-center gap-2 text-gray-400 text-sm cursor-pointer hover:text-yellow-400">
                      <input type="checkbox" className="rounded" />
                      {range}
                    </label>
                  ))}
                </div>
              </div>

              {/* Customer Rating */}
              <div>
                <h3 className="text-white font-bold text-sm mb-3">Customer Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((stars) => (
                    <label key={stars} className="flex items-center gap-2 text-gray-400 text-sm cursor-pointer hover:text-yellow-400">
                      <input type="checkbox" className="rounded" />
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < stars ? "text-yellow-400" : "text-gray-600"}>
                            ⭐
                          </span>
                        ))}
                        <span className="ml-1">& Up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Results */}
          <div className="flex-1">
            {sortedComics.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg mb-4">No comics found matching your search.</p>
                <p className="text-gray-500 text-sm">Try adjusting your search terms or filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedComics.map((comic) => (
                  <Link
                    key={comic.id}
                    href={`/comic/${comic.id}`}
                    className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 overflow-hidden hover:border-yellow-400/50 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-400/10"
                  >
                    <div className="relative">
                      <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                        <Image
                          src={comic.image}
                          alt={comic.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        {comic.discount && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-lg z-10">
                            -{comic.discount}%
                          </div>
                        )}
                        {comic.tag && (
                          <div className={`absolute top-2 ${comic.discount ? "right-2" : "left-2"} text-xs font-black px-2.5 py-1 rounded-full shadow-lg z-10 ${
                            comic.tag === "NEW" ? "bg-green-500 text-white" :
                            comic.tag === "HOT" ? "bg-red-500 text-white" :
                            comic.tag === "CLASSIC" ? "bg-purple-500 text-white" :
                            comic.tag === "BESTSELLER" ? "bg-yellow-500 text-black" :
                            "bg-blue-500 text-white"
                          }`}>
                            {comic.tag}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-white text-sm mb-1.5 line-clamp-2 group-hover:text-yellow-400 transition-colors min-h-[2.5rem]">
                          {comic.title}
                        </h3>
                        <p className="text-gray-400 text-xs mb-2 truncate">{comic.author}</p>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-black text-yellow-400">${comic.price}</span>
                            {comic.originalPrice && (
                              <span className="text-xs text-gray-500 line-through">${comic.originalPrice}</span>
                            )}
                          </div>
                          {comic.rating && (
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400 text-xs">⭐</span>
                              <span className="text-xs text-gray-300">{comic.rating}</span>
                            </div>
                          )}
                        </div>
                        {comic.sold && (
                          <p className="text-xs text-gray-500">{comic.sold} sold</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-400 text-xl">Loading search results...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

