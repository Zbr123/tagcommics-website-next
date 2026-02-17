"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/src/components/ProductCard";

// Category-specific data
const categoryData: Record<string, {
  title: string;
  emoji: string;
  description: string;
  items: any[];
}> = {
  superhero: {
    title: "Superhero Comics",
    emoji: "🦸",
    description: "Explore the amazing world of superheroes",
    items: [
      { id: 101, title: "Spider-Man #1", author: "Stan Lee", price: 4.99, originalPrice: 9.99, discount: 50, rating: 4.9, sold: "2.5k", image: "/comic-slider1.png", category: "Comics", tag: "BESTSELLER", genre: "Superhero" },
      { id: 102, title: "Batman Annual", author: "Bob Kane", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.7, sold: "1.8k", image: "/comic-slider5.png", category: "Comics", tag: "NEW", genre: "Superhero" },
      { id: 103, title: "X-Men #1", author: "Stan Lee", price: 5.99, originalPrice: 11.99, discount: 51, rating: 4.9, sold: "2.1k", image: "/comic-slider3.png", category: "Comics", tag: "BESTSELLER", genre: "Superhero" },
      { id: 104, title: "The Avengers", author: "Stan Lee", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.9, sold: "2.3k", image: "/comic-slider3.png", category: "Comics", tag: "BESTSELLER", genre: "Superhero" },
      { id: 105, title: "Superman Returns", author: "Jerry Siegel", price: 7.49, originalPrice: 14.99, discount: 50, rating: 4.7, sold: "1.5k", image: "/comic-slide4.png", category: "Comics", tag: "CLASSIC", genre: "Superhero" },
      { id: 106, title: "Wonder Woman", author: "William Moulton Marston", price: 6.49, originalPrice: 12.99, discount: 50, rating: 4.8, sold: "1.2k", image: "/comic-slider5.png", category: "Comics", tag: "CLASSIC", genre: "Superhero" },
      { id: 107, title: "Iron Man #1", author: "Stan Lee", price: 5.49, originalPrice: 10.99, discount: 50, rating: 4.7, sold: "1.5k", image: "/comic-slide4.png", category: "Comics", tag: "NEW", genre: "Superhero" },
      { id: 108, title: "Captain America", author: "Jack Kirby", price: 6.49, originalPrice: 12.99, discount: 50, rating: 4.8, sold: "1.6k", image: "/comic-slider1.png", category: "Comics", tag: "BESTSELLER", genre: "Superhero" },
      { id: 109, title: "The Flash", author: "Gardner Fox", price: 5.99, originalPrice: 11.99, discount: 50, rating: 4.6, sold: "1.3k", image: "/comic-slider5.png", category: "Comics", tag: "NEW", genre: "Superhero" },
      { id: 110, title: "Thor #1", author: "Stan Lee", price: 5.99, originalPrice: 11.99, discount: 50, rating: 4.8, sold: "1.7k", image: "/comic-slider5.png", category: "Comics", tag: "NEW", genre: "Superhero" },
      { id: 111, title: "Black Panther", author: "Stan Lee", price: 7.49, originalPrice: 14.99, discount: 50, rating: 4.9, sold: "1.9k", image: "/comic-slide4.png", category: "Comics", tag: "NEW", genre: "Superhero" },
      { id: 112, title: "Green Lantern", author: "John Broome", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.6, sold: "1.4k", image: "/comic-slide4.png", category: "Comics", tag: "NEW", genre: "Superhero" },
      { id: 113, title: "Wolverine #1", author: "Chris Claremont", price: 7.99, originalPrice: 14.99, discount: 47, rating: 4.8, sold: "1.9k", image: "/comic-slider3.png", category: "Comics", tag: "BESTSELLER", genre: "Superhero" },
      { id: 114, title: "Deadpool #1", author: "Fabian Nicieza", price: 5.99, originalPrice: 11.99, discount: 50, rating: 4.6, sold: "1.4k", image: "/comic-slider1.png", category: "Comics", tag: "NEW", genre: "Superhero" },
      { id: 115, title: "Hulk #1", author: "Stan Lee", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.7, sold: "1.6k", image: "/comic-slider3.png", category: "Comics", tag: "BESTSELLER", genre: "Superhero" },
      { id: 116, title: "Doctor Strange", author: "Stan Lee", price: 6.99, originalPrice: 12.99, discount: 46, rating: 4.7, sold: "1.5k", image: "/comic-slider5.png", category: "Comics", tag: "NEW", genre: "Superhero" },
    ],
  },
  manga: {
    title: "Manga Series",
    emoji: "🎌",
    description: "Discover amazing manga series",
    items: [
      { id: 201, title: "One Piece Vol.1", author: "Eiichiro Oda", price: 7.99, originalPrice: 15.99, discount: 50, rating: 4.9, sold: "5.1k", image: "/comic-slide4.png", category: "Manga", tag: "BESTSELLER", genre: "Manga" },
      { id: 202, title: "Naruto Vol.1", author: "Masashi Kishimoto", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, sold: "4.5k", image: "/comic-slider1.png", category: "Manga", tag: "BESTSELLER", genre: "Manga" },
      { id: 203, title: "Attack on Titan", author: "Hajime Isayama", price: 8.99, originalPrice: 14.99, discount: 40, rating: 4.8, sold: "3.2k", image: "/comic-slider3.png", category: "Manga", tag: "HOT", genre: "Manga" },
      { id: 204, title: "My Hero Academia Vol.1", author: "Kohei Horikoshi", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, sold: "3.4k", image: "/comic-slide4.png", category: "Manga", tag: "BESTSELLER", genre: "Manga" },
      { id: 205, title: "Dragon Ball Z", author: "Akira Toriyama", price: 8.99, originalPrice: 13.99, discount: 36, rating: 4.8, sold: "3.8k", image: "/comic-slider5.png", category: "Manga", tag: "CLASSIC", genre: "Manga" },
      { id: 206, title: "Demon Slayer Vol.1", author: "Koyoharu Gotouge", price: 8.99, originalPrice: 13.99, discount: 36, rating: 4.8, sold: "2.8k", image: "/comic-slider1.png", category: "Manga", tag: "HOT", genre: "Manga" },
      { id: 207, title: "Jujutsu Kaisen Vol.1", author: "Gege Akutami", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, sold: "3.1k", image: "/comic-slider3.png", category: "Manga", tag: "HOT", genre: "Manga" },
      { id: 208, title: "Chainsaw Man Vol.1", author: "Tatsuki Fujimoto", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.8, sold: "2.9k", image: "/comic-slide4.png", category: "Manga", tag: "HOT", genre: "Manga" },
      { id: 209, title: "Spy x Family Vol.1", author: "Tatsuya Endo", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, sold: "3.6k", image: "/comic-slider1.png", category: "Manga", tag: "BESTSELLER", genre: "Manga" },
      { id: 210, title: "Bleach Vol.1", author: "Tite Kubo", price: 8.49, originalPrice: 14.99, discount: 43, rating: 4.7, sold: "2.7k", image: "/comic-slider5.png", category: "Manga", tag: "CLASSIC", genre: "Manga" },
      { id: 211, title: "Death Note Vol.1", author: "Tsugumi Ohba", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, sold: "4.2k", image: "/comic-slider3.png", category: "Manga", tag: "CLASSIC", genre: "Manga" },
      { id: 212, title: "Fullmetal Alchemist Vol.1", author: "Hiromu Arakawa", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.9, sold: "3.8k", image: "/comic-slide4.png", category: "Manga", tag: "CLASSIC", genre: "Manga" },
      { id: 213, title: "One Punch Man Vol.1", author: "ONE", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.8, sold: "3.3k", image: "/comic-slider1.png", category: "Manga", tag: "BESTSELLER", genre: "Manga" },
      { id: 214, title: "Hunter x Hunter Vol.1", author: "Yoshihiro Togashi", price: 8.99, originalPrice: 13.99, discount: 36, rating: 4.9, sold: "3.0k", image: "/comic-slider3.png", category: "Manga", tag: "CLASSIC", genre: "Manga" },
      { id: 215, title: "Tokyo Revengers Vol.1", author: "Ken Wakui", price: 8.99, originalPrice: 13.99, discount: 36, rating: 4.7, sold: "2.5k", image: "/comic-slider5.png", category: "Manga", tag: "NEW", genre: "Manga" },
      { id: 216, title: "Blue Lock Vol.1", author: "Muneyuki Kaneshiro", price: 9.99, originalPrice: 14.99, discount: 33, rating: 4.7, sold: "2.4k", image: "/comic-slider5.png", category: "Manga", tag: "HOT", genre: "Manga" },
    ],
  },
  horror: {
    title: "Horror Stories",
    emoji: "👻",
    description: "Dive into spine-chilling horror stories",
    items: [
      { id: 301, title: "The Walking Dead Vol.1", author: "Robert Kirkman", price: 12.99, originalPrice: 19.99, discount: 35, rating: 4.8, sold: "1.4k", image: "/comic-slider3.png", category: "Graphic Novels", tag: "NEW", genre: "Horror" },
      { id: 302, title: "30 Days of Night", author: "Steve Niles", price: 14.99, originalPrice: 19.99, discount: 25, rating: 4.7, sold: "856", image: "/comic-slider1.png", category: "Graphic Novels", tag: "HOT", genre: "Horror" },
      { id: 303, title: "Hellblazer", author: "Jamie Delano", price: 11.99, originalPrice: 16.99, discount: 29, rating: 4.8, sold: "623", image: "/comic-slider5.png", category: "Comics", tag: "CLASSIC", genre: "Horror" },
      { id: 304, title: "Locke & Key", author: "Joe Hill", price: 13.99, originalPrice: 18.99, discount: 26, rating: 4.9, sold: "987", image: "/comic-slider3.png", category: "Graphic Novels", tag: "BESTSELLER", genre: "Horror" },
      { id: 305, title: "Swamp Thing", author: "Alan Moore", price: 15.99, originalPrice: 21.99, discount: 27, rating: 4.9, sold: "1.2k", image: "/comic-slide4.png", category: "Comics", tag: "CLASSIC", genre: "Horror" },
      { id: 306, title: "From Hell", author: "Alan Moore", price: 19.99, originalPrice: 24.99, discount: 20, rating: 4.8, sold: "756", image: "/comic-slider1.png", category: "Graphic Novels", tag: "CLASSIC", genre: "Horror" },
      { id: 307, title: "Uzumaki", author: "Junji Ito", price: 16.99, originalPrice: 22.99, discount: 26, rating: 4.9, sold: "1.1k", image: "/comic-slider5.png", category: "Manga", tag: "HOT", genre: "Horror" },
      { id: 308, title: "Gyo", author: "Junji Ito", price: 15.99, originalPrice: 21.99, discount: 27, rating: 4.7, sold: "892", image: "/comic-slider3.png", category: "Manga", tag: "NEW", genre: "Horror" },
      { id: 309, title: "Tomie", author: "Junji Ito", price: 17.99, originalPrice: 23.99, discount: 25, rating: 4.8, sold: "1.0k", image: "/comic-slide4.png", category: "Manga", tag: "BESTSELLER", genre: "Horror" },
      { id: 310, title: "The Sandman: Preludes", author: "Neil Gaiman", price: 18.99, originalPrice: 24.99, discount: 24, rating: 4.9, sold: "1.3k", image: "/comic-slider1.png", category: "Graphic Novels", tag: "CLASSIC", genre: "Horror" },
      { id: 311, title: "Wytches", author: "Scott Snyder", price: 13.99, originalPrice: 18.99, discount: 26, rating: 4.7, sold: "678", image: "/comic-slider5.png", category: "Comics", tag: "NEW", genre: "Horror" },
      { id: 312, title: "Harrow County", author: "Cullen Bunn", price: 12.99, originalPrice: 17.99, discount: 28, rating: 4.6, sold: "543", image: "/comic-slider3.png", category: "Comics", tag: "HOT", genre: "Horror" },
      { id: 313, title: "Something is Killing the Children", author: "James Tynion IV", price: 14.99, originalPrice: 19.99, discount: 25, rating: 4.8, sold: "789", image: "/comic-slide4.png", category: "Comics", tag: "HOT", genre: "Horror" },
      { id: 314, title: "The Nice House on the Lake", author: "James Tynion IV", price: 15.99, originalPrice: 20.99, discount: 24, rating: 4.9, sold: "654", image: "/comic-slider1.png", category: "Comics", tag: "NEW", genre: "Horror" },
      { id: 315, title: "Gideon Falls", author: "Jeff Lemire", price: 13.99, originalPrice: 18.99, discount: 26, rating: 4.7, sold: "567", image: "/comic-slider5.png", category: "Comics", tag: "NEW", genre: "Horror" },
      { id: 316, title: "Revival", author: "Tim Seeley", price: 12.99, originalPrice: 17.99, discount: 28, rating: 4.6, sold: "432", image: "/comic-slider3.png", category: "Comics", tag: "HOT", genre: "Horror" },
    ],
  },
  fantasy: {
    title: "Fantasy Worlds",
    emoji: "🧙",
    description: "Journey to magical fantasy worlds",
    items: [
      { id: 401, title: "Saga Deluxe Edition", author: "Brian K. Vaughan", price: 24.99, originalPrice: 34.99, discount: 29, rating: 4.9, sold: "1.7k", image: "/comic-slider5.png", category: "Graphic Novels", tag: "HOT", genre: "Fantasy" },
      { id: 402, title: "Fables Vol.1", author: "Bill Willingham", price: 16.99, originalPrice: 22.99, discount: 26, rating: 4.8, sold: "1.2k", image: "/comic-slider1.png", category: "Graphic Novels", tag: "BESTSELLER", genre: "Fantasy" },
      { id: 403, title: "The Sandman Omnibus", author: "Neil Gaiman", price: 44.99, rating: 5.0, sold: "623", image: "/comic-slide4.png", category: "Graphic Novels", tag: "CLASSIC", genre: "Fantasy" },
      { id: 404, title: "Monstress Vol.1", author: "Marjorie Liu", price: 17.99, originalPrice: 23.99, discount: 25, rating: 4.9, sold: "987", image: "/comic-slider3.png", category: "Graphic Novels", tag: "BESTSELLER", genre: "Fantasy" },
      { id: 405, title: "Bone", author: "Jeff Smith", price: 19.99, originalPrice: 25.99, discount: 23, rating: 4.9, sold: "1.4k", image: "/comic-slider5.png", category: "Graphic Novels", tag: "CLASSIC", genre: "Fantasy" },
      { id: 406, title: "Rat Queens Vol.1", author: "Kurtis J. Wiebe", price: 14.99, originalPrice: 19.99, discount: 25, rating: 4.7, sold: "756", image: "/comic-slider1.png", category: "Comics", tag: "NEW", genre: "Fantasy" },
      { id: 407, title: "The Wicked + The Divine", author: "Kieron Gillen", price: 15.99, originalPrice: 20.99, discount: 24, rating: 4.8, sold: "892", image: "/comic-slide4.png", category: "Comics", tag: "HOT", genre: "Fantasy" },
      { id: 408, title: "The Unwritten", author: "Mike Carey", price: 16.99, originalPrice: 21.99, discount: 23, rating: 4.7, sold: "678", image: "/comic-slider3.png", category: "Graphic Novels", tag: "NEW", genre: "Fantasy" },
      { id: 409, title: "Lucifer", author: "Mike Carey", price: 18.99, originalPrice: 24.99, discount: 24, rating: 4.9, sold: "1.1k", image: "/comic-slider5.png", category: "Graphic Novels", tag: "CLASSIC", genre: "Fantasy" },
      { id: 410, title: "The Books of Magic", author: "Neil Gaiman", price: 17.99, originalPrice: 23.99, discount: 25, rating: 4.8, sold: "856", image: "/comic-slider1.png", category: "Graphic Novels", tag: "CLASSIC", genre: "Fantasy" },
      { id: 411, title: "Mage: The Hero Discovered", author: "Matt Wagner", price: 15.99, originalPrice: 20.99, discount: 24, rating: 4.6, sold: "543", image: "/comic-slide4.png", category: "Comics", tag: "NEW", genre: "Fantasy" },
      { id: 412, title: "Coda", author: "Simon Spurrier", price: 14.99, originalPrice: 19.99, discount: 25, rating: 4.7, sold: "654", image: "/comic-slider3.png", category: "Comics", tag: "HOT", genre: "Fantasy" },
      { id: 413, title: "The Realm", author: "Seth Peck", price: 13.99, originalPrice: 18.99, discount: 26, rating: 4.5, sold: "432", image: "/comic-slider5.png", category: "Comics", tag: "NEW", genre: "Fantasy" },
      { id: 414, title: "Birthright", author: "Joshua Williamson", price: 15.99, originalPrice: 20.99, discount: 24, rating: 4.8, sold: "789", image: "/comic-slider1.png", category: "Comics", tag: "BESTSELLER", genre: "Fantasy" },
      { id: 415, title: "Die", author: "Kieron Gillen", price: 16.99, originalPrice: 21.99, discount: 23, rating: 4.9, sold: "567", image: "/comic-slide4.png", category: "Comics", tag: "HOT", genre: "Fantasy" },
      { id: 416, title: "The Last God", author: "Philip Kennedy Johnson", price: 17.99, originalPrice: 22.99, discount: 22, rating: 4.7, sold: "456", image: "/comic-slider3.png", category: "Comics", tag: "NEW", genre: "Fantasy" },
    ],
  },
};

const ITEMS_PER_PAGE = 12;

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [selectedTag, setSelectedTag] = useState("All");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  const categoryInfo = categoryData[category];

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

  // Filter by tag
  const filteredItems = categoryInfo.items.filter(
    (item) => selectedTag === "All" || item.tag === selectedTag.toUpperCase()
  );

  // Get displayed items
  const displayedItems = filteredItems.slice(0, displayCount);
  const hasMore = displayCount < filteredItems.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredItems.length));
  };

  const tags = ["All", "Bestseller", "New", "Hot", "Classic"];

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-20 py-8">
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
              className="text-yellow-400 hover:text-yellow-300 font-bold text-sm flex items-center gap-1"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        {displayedItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">No items found in this category.</p>
            <button
              onClick={() => setSelectedTag("All")}
              className="text-yellow-400 hover:text-yellow-300 font-bold cursor-pointer"
            >
              View All Tags
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8 mb-8 mx-auto">
              {displayedItems.map((item) => (
                <ProductCard key={item.id} comic={item} showSold={true} />
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

