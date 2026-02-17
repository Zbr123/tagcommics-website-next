"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../hooks/use-cart";

// Products database for search suggestions
const allProducts = [
  { id: 1, title: "Spider-Man #1", author: "Stan Lee", category: "Comics" },
  { id: 2, title: "Batman Annual", author: "Bob Kane", category: "Comics" },
  { id: 3, title: "Attack on Titan", author: "Hajime Isayama", category: "Manga" },
  { id: 4, title: "One Piece Vol.1", author: "Eiichiro Oda", category: "Manga" },
  { id: 5, title: "Deadpool #1", author: "Fabian Nicieza", category: "Comics" },
  { id: 6, title: "Wonder Woman", author: "William Moulton Marston", category: "Comics" },
  { id: 7, title: "X-Men #1", author: "Stan Lee", category: "Comics" },
  { id: 8, title: "Superman Returns", author: "Jerry Siegel", category: "Comics" },
  { id: 9, title: "Marvel Masterworks", author: "Stan Lee", category: "Graphic Novels" },
  { id: 10, title: "DC Black Label", author: "Various", category: "Graphic Novels" },
  { id: 11, title: "Manga Classics Box Set", author: "Various", category: "Manga" },
  { id: 12, title: "The Walking Dead Vol.1", author: "Robert Kirkman", category: "Graphic Novels" },
  { id: 13, title: "Saga Deluxe Edition", author: "Brian K. Vaughan", category: "Graphic Novels" },
  { id: 14, title: "Invincible Compendium", author: "Robert Kirkman", category: "Graphic Novels" },
  { id: 15, title: "Watchmen Absolute", author: "Alan Moore", category: "Graphic Novels" },
  { id: 16, title: "Naruto Vol.1", author: "Masashi Kishimoto", category: "Manga" },
  { id: 17, title: "Dragon Ball Z", author: "Akira Toriyama", category: "Manga" },
  { id: 18, title: "The Avengers", author: "Stan Lee", category: "Comics" },
  { id: 19, title: "Hulk #1", author: "Stan Lee", category: "Comics" },
  { id: 20, title: "Black Panther", author: "Stan Lee", category: "Comics" },
  { id: 21, title: "Iron Man #1", author: "Stan Lee", category: "Comics" },
  { id: 22, title: "The Flash", author: "Gardner Fox", category: "Comics" },
  { id: 23, title: "Thor #1", author: "Stan Lee", category: "Comics" },
  { id: 24, title: "Captain America", author: "Jack Kirby", category: "Comics" },
  { id: 25, title: "Superman #1", author: "Jerry Siegel", category: "Comics" },
  { id: 26, title: "Aquaman #1", author: "Paul Norris", category: "Comics" },
  { id: 27, title: "Green Lantern", author: "John Broome", category: "Comics" },
  { id: 28, title: "Wolverine #1", author: "Chris Claremont", category: "Comics" },
  { id: 29, title: "Doctor Strange", author: "Stan Lee", category: "Comics" },
  { id: 30, title: "My Hero Academia Vol.1", author: "Kohei Horikoshi", category: "Manga" },
  { id: 31, title: "Demon Slayer Vol.1", author: "Koyoharu Gotouge", category: "Manga" },
  { id: 32, title: "Jujutsu Kaisen Vol.1", author: "Gege Akutami", category: "Manga" },
];
import { useAuth } from "../hooks/use-auth";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchSuggestions, setSearchSuggestions] = useState<typeof allProducts>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const cartCount = getTotalItems();

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = allProducts.filter((product) => {
        const query = searchQuery.toLowerCase();
        const matchesQuery = 
          product.title.toLowerCase().includes(query) ||
          product.author.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query);
        
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        
        return matchesQuery && matchesCategory;
      }).slice(0, 8); // Limit to 8 suggestions
      
      setSearchSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, selectedCategory]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}&category=${encodeURIComponent(selectedCategory)}`);
    }
  };

  const handleSuggestionClick = (product: typeof allProducts[0]) => {
    setSearchQuery(product.title);
    setShowSuggestions(false);
    router.push(`/comic/${product.id}`);
  };

  return (
    <>
      {/* Main Navbar - Amazon Style Dark Header */}
      <nav className="sticky top-0 z-50 bg-black shadow-2xl">
        <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">

            {/* Logo - Left */}
            <Link href="/" className="flex items-center gap-1 group shrink-0">
              <div className="relative group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/logo-comics.png"
                  alt="Comics Universe Logo"
                  className="h-16 w-44 object-cover drop-shadow-2xl"
                />
              </div>
            </Link>

            {/* Delivery Location */}
            <div className="hidden md:flex items-center gap-1 text-white/70 hover:text-white cursor-pointer group shrink-0">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="flex flex-col">
                <span className="text-xs text-white/50">Deliver to</span>
                <span className="text-sm font-bold text-white">Worldwide</span>
              </div>
            </div>

            {/* Search Bar - Center - Amazon Style */}
            <form onSubmit={handleSearch} className="flex-1 max-w-3xl relative" ref={searchRef}>
              <div
                className={`flex items-center rounded-lg overflow-hidden transition-all duration-300 ${
                  isSearchFocused
                    ? "ring-2 ring-yellow-400 shadow-2xl shadow-yellow-400/20"
                    : "shadow-lg"
                } bg-white`}
              >
                {/* Category Dropdown */}
                <div className="relative group shrink-0">
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-gray-100 px-2 py-3 text-sm text-gray-700 border-r border-gray-300 focus:outline-none appearance-none cursor-pointer hover:bg-gray-200 pr-6 w-24"
                  >
                    <option value="All">All</option>
                    <option value="Comics">Comics</option>
                    <option value="Graphic Novels">Graphic Novels</option>
                    <option value="Manga">Manga</option>
                  </select>
                  <svg className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Search Input */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for comics, authors, genres, publishers..."
                  className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none text-sm"
                  onFocus={() => {
                    setIsSearchFocused(true);
                    if (searchQuery.trim().length > 0 && searchSuggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    setIsSearchFocused(false);
                  }}
                />

                {/* Search Button */}
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-3 hover:from-yellow-500 hover:to-yellow-600 transition-all shrink-0 cursor-pointer"
                >
                  <svg
                    className="h-5 w-5 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                  <div className="py-2">
                    {searchSuggestions.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSuggestionClick(product)}
                        className="w-full px-4 py-3 text-left hover:bg-yellow-50 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">{product.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{product.author} • {product.category}</p>
                          </div>
                          <svg className="h-4 w-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-4">

              {/* Language */}
              <div className="hidden lg:flex items-center gap-1 text-white cursor-pointer hover:text-yellow-400 shrink-0">
                <span className="text-sm font-bold">🌐</span>
                <span className="text-sm font-bold">EN</span>
              </div>

              {/* Account */}
              <Link
                href={user ? "/account" : "/login"}
                className="hidden lg:flex flex-col items-start text-white/80 hover:text-white cursor-pointer shrink-0"
              >
                <span className="text-xs text-white/60">
                  Hello, {user ? user.name : "sign in"}
                </span>
                <span className="text-sm font-bold flex items-center gap-1">
                  Account & Lists
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </Link>

              {/* Orders */}
              <Link
                href="/orders"
                className="hidden lg:flex flex-col items-start text-white/80 hover:text-white cursor-pointer shrink-0"
              >
                <span className="text-xs text-white/60">Returns</span>
                <span className="text-sm font-bold">& Orders</span>
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="flex items-center gap-1 text-white/80 hover:text-white cursor-pointer shrink-0"
              >
                <div className="relative">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-xs font-black text-black">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-bold text-yellow-400">Cart</span>
                </div>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Secondary Nav - Categories */}
          <div className="hidden lg:flex items-center gap-6 py-2 border-t border-white/10">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 text-sm font-bold text-white hover:text-yellow-400 transition-colors cursor-pointer"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              All
            </button>
            <Link href="/comics" className={`text-sm font-semibold transition-colors ${pathname === "/comics" ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}>
              Comic Books
            </Link>
            <Link href="/manga" className={`text-sm font-semibold transition-colors ${pathname === "/manga" ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}>
              Manga
            </Link>
            <Link href="/new-releases" className={`text-sm font-semibold transition-colors ${pathname === "/new-releases" ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}>
              New Releases
            </Link>
            <Link href="/bestsellers" className={`text-sm font-semibold transition-colors ${pathname === "/bestsellers" ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}>
              Bestsellers
            </Link>
            <Link href="/deals" className={`text-sm font-semibold transition-colors ${pathname === "/deals" ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}>
              Today&apos;s Deals
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-black">
            <div className="px-4 py-4 space-y-3">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-3 rounded-lg cursor-pointer"
                >
                  <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsSidebarOpen(true);
                }}
                className="flex items-center gap-2 w-full py-2 text-sm font-semibold text-white hover:text-yellow-400 cursor-pointer"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                All
              </button>
              <Link href="/comics" className={`block py-2 text-sm font-semibold transition-colors ${pathname === "/comics" ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}>
                📚 Comic Books
              </Link>
              <Link href="/graphic-novels" className={`block py-2 text-sm font-semibold transition-colors ${pathname === "/graphic-novels" ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}>
                📖 Graphic Novels
              </Link>
              <Link href="/manga" className={`block py-2 text-sm font-semibold transition-colors ${pathname === "/manga" ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}>
                🎌 Manga
              </Link>
              <Link href="/new-releases" className={`block py-2 text-sm font-semibold transition-colors ${pathname === "/new-releases" ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}>
                ⭐ New Releases
              </Link>
              <Link href={user ? "/account" : "/login"} className="block py-2 text-sm font-semibold text-white hover:text-yellow-400">
                👤 {user ? "Account" : "Login"}
              </Link>
              {user && (
                <button
                  onClick={() => { setIsMenuOpen(false); logout(); }}
                  className="block py-2 text-sm font-semibold text-red-400 hover:text-red-300 w-full text-left"
                >
                  Log out
                </button>
              )}
              <Link href="/orders" className="block py-2 text-sm font-semibold text-white hover:text-yellow-400">
                📦 Orders
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 py-2">
        <p className="text-center text-sm font-bold text-black">
          🔥 FREE SHIPPING on orders over $50! Use code: <span className="underline">COMICS50</span> 🎉
        </p>
      </div>

      {/* Sidebar - Amazon Style */}
      {isSidebarOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 lg:z-[60]"
            onClick={() => setIsSidebarOpen(false)}
          />
          
          {/* Sidebar Container */}
          <div className="fixed left-0 top-0 h-full z-50 lg:z-[60] animate-slide-in-left">
            {/* Close Button - Outside Sidebar */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute -right-8 top-3 ml-6 bg-white border border-black w-8 h-8 flex items-center justify-center hover:bg-yellow-400 hover:border-yellow-500 hover:scale-110 hover:shadow-xl transition-all duration-200 cursor-pointer z-10 shadow-lg"
              aria-label="Close sidebar"
            >
              <svg className="h-4 w-4 text-black transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Sidebar */}
            <div className="h-full w-80 bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl overflow-y-auto sidebar-scrollbar border-r border-gray-800">
              {/* Sidebar Header */}
              <div className="sticky top-0 bg-gradient-to-b from-gray-900 to-gray-800 border-b border-gray-800 p-4 flex items-center">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm font-semibold text-white">Hello, sign in</span>
                </div>
              </div>

            {/* Sidebar Content */}
            <div className="p-4">
              {/* Trending Section */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">Trending</h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="/bestsellers" 
                      className="flex items-center justify-between text-sm text-gray-300 hover:text-yellow-400 py-2 group transition-colors"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span>Best Sellers</span>
                      <svg className="h-4 w-4 text-gray-500 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/new-releases" 
                      className="flex items-center justify-between text-sm text-gray-300 hover:text-yellow-400 py-2 group transition-colors"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span>New Releases</span>
                      <svg className="h-4 w-4 text-gray-500 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/deals" 
                      className="flex items-center justify-between text-sm text-gray-300 hover:text-yellow-400 py-2 group transition-colors"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span>Today&apos;s Deals</span>
                      <svg className="h-4 w-4 text-gray-500 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Shop by Category Section */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">Shop by Category</h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="/comics" 
                      className="flex items-center justify-between text-sm text-gray-300 hover:text-yellow-400 py-2 group transition-colors"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span>Comic Books</span>
                      <svg className="h-4 w-4 text-gray-500 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/manga" 
                      className="flex items-center justify-between text-sm text-gray-300 hover:text-yellow-400 py-2 group transition-colors"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span>Manga</span>
                      <svg className="h-4 w-4 text-gray-500 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/category/superhero" 
                      className="flex items-center justify-between text-sm text-gray-300 hover:text-yellow-400 py-2 group transition-colors"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span>Superhero Comics</span>
                      <svg className="h-4 w-4 text-gray-500 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/category/manga" 
                      className="flex items-center justify-between text-sm text-gray-300 hover:text-yellow-400 py-2 group transition-colors"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span>Manga Series</span>
                      <svg className="h-4 w-4 text-gray-500 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/category/horror" 
                      className="flex items-center justify-between text-sm text-gray-300 hover:text-yellow-400 py-2 group transition-colors"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span>Horror Stories</span>
                      <svg className="h-4 w-4 text-gray-500 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/category/fantasy" 
                      className="flex items-center justify-between text-sm text-gray-300 hover:text-yellow-400 py-2 group transition-colors"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span>Fantasy Worlds</span>
                      <svg className="h-4 w-4 text-gray-500 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Account & Lists Section */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">Account & Lists</h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="/account" 
                      className="flex items-center justify-between text-sm text-gray-300 hover:text-yellow-400 py-2 group transition-colors"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span>Your Account</span>
                      <svg className="h-4 w-4 text-gray-500 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/orders" 
                      className="flex items-center justify-between text-sm text-gray-300 hover:text-yellow-400 py-2 group transition-colors"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span>Returns & Orders</span>
                      <svg className="h-4 w-4 text-gray-500 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/cart" 
                      className="flex items-center justify-between text-sm text-gray-300 hover:text-yellow-400 py-2 group transition-colors"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span>Shopping Cart</span>
                      <svg className="h-4 w-4 text-gray-500 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          </div>
        </>
      )}
    </>
  );
}
