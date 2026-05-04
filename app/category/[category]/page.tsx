"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/src/components/ProductCard";
import { getCategoryComics, type Comic } from "@/src/lib/comics-api";

const ITEMS_PER_PAGE = 12;

const CATEGORY_INFO: Record<string, { title: string; emoji: string; description: string }> = {
  superhero: {
    title: "Superhero Comics",
    emoji: "🦸",
    description: "Explore the amazing world of superheroes",
  },
  manga: {
    title: "Manga Series",
    emoji: "🎌",
    description: "Discover amazing manga series",
  },
  horror: {
    title: "Horror Stories",
    emoji: "👻",
    description: "Dive into spine-chilling horror stories",
  },
  fantasy: {
    title: "Fantasy Worlds",
    emoji: "🧙",
    description: "Journey to magical fantasy worlds",
  },
};

function LoadingState() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
        <p className="text-zinc-400">Loading comics...</p>
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-center py-16">
      <p className="text-gray-400 text-lg mb-4">No items found in this category.</p>
      <button
        onClick={onClear}
        className="text-yellow-400 hover:text-yellow-300 font-bold cursor-pointer"
      >
        View All Tags
      </button>
    </div>
  );
}

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState("All");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    async function fetchComics() {
      setLoading(true);
      try {
        const data = await getCategoryComics(category);
        setComics(data);
      } catch (error) {
        console.error("Failed to fetch comics:", error);
        setComics([]);
      } finally {
        setLoading(false);
      }
    }

    if (category) {
      fetchComics();
    }
  }, [category]);

  const categoryInfo = CATEGORY_INFO[category];

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black text-white mb-4">Category Not Found</h1>
          <Link href="/" className="text-yellow-400 hover:text-yellow-300">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingState />;

  // Filter by tag
  const filteredItems = comics.filter(
    (item) => selectedTag === "All" || item.tag?.toLowerCase() === selectedTag.toLowerCase()
  );

  // Get displayed items
  const displayedItems = filteredItems.slice(0, displayCount);
  const hasMore = displayCount < filteredItems.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredItems.length));
  };

  const handleClearFilter = () => {
    setSelectedTag("All");
    setDisplayCount(ITEMS_PER_PAGE);
  };

  const tags = ["All", "Bestseller", "New", "Hot", "Classic"];

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-12xl px-4 sm:px-6 lg:px-20 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">{categoryInfo.title}</h1>
                <p className="text-gray-400 text-sm mt-1">{categoryInfo.description}</p>
              </div>
            </div>

            {/* Tag Dropdown */}
            <div className="flex items-center gap-3">
              <label className="text-gray-400 text-sm font-medium">Filter by Tag:</label>
              <select
                value={selectedTag}
                onChange={(e) => {
                  setSelectedTag(e.target.value);
                  setDisplayCount(ITEMS_PER_PAGE);
                }}
                className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-yellow-400 min-w-[150px] cursor-pointer"
              >
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Showing {displayedItems.length} of {filteredItems.length} items
              {selectedTag !== "All" && ` in ${selectedTag}`}
            </p>
            <Link
              href="/"
              className="text-brand hover:text-white font-bold text-sm flex items-center gap-1"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        {filteredItems.length === 0 ? (
          <EmptyState onClear={handleClearFilter} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 mb-8 mx-auto">
              {displayedItems.map((item) => (
                <ProductCard key={item.id} comic={item} showSold={true} cardWidth="w-full" />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="border-2 border-yellow-400 hover:bg-yellow-400 text-yellow-400 hover:text-black font-bold px-6 py-2.5 rounded-lg transition-all cursor-pointer"
                >
                  Load More Items
                </button>
              </div>
            )}

            {/* Show all loaded message */}
            {!hasMore && displayedItems.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">
                  You&apos;ve viewed all {filteredItems.length} items
                  {selectedTag !== "All" && ` in ${selectedTag}`}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
