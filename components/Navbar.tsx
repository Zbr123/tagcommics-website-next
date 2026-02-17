"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const router = useRouter();
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}&category=${encodeURIComponent(selectedCategory)}`);
    }
  };

  return (
    <>
      {/* Main Navbar - Amazon Style Dark Header */}
      <nav className="sticky top-0 z-50 bg-black shadow-2xl">
        <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">

            {/* Logo - Left */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 text-black shadow-lg group-hover:shadow-yellow-400/50 transition-all">
                <span className="text-2xl font-black">C</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-black text-white leading-tight">
                  COMICS
                  <span className="block text-sm font-bold text-yellow-400">
                    UNIVERSE
                  </span>
                </h1>
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
            <form onSubmit={handleSearch} className="flex-1 max-w-3xl">
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
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />

                {/* Search Button */}
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-3 hover:from-yellow-500 hover:to-yellow-600 transition-all shrink-0"
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
                href="/account"
                className="hidden lg:flex flex-col items-start text-white/80 hover:text-white cursor-pointer shrink-0"
              >
                <span className="text-xs text-white/60">Hello, sign in</span>
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
                className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg"
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
            <button className="flex items-center gap-2 text-sm font-bold text-white hover:text-yellow-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              All
            </button>
            <Link href="/comics" className="text-sm font-semibold text-white hover:text-yellow-400 transition-colors">
              Comic Books
            </Link>
            <Link href="/graphic-novels" className="text-sm font-semibold text-white hover:text-yellow-400 transition-colors">
              Graphic Novels
            </Link>
            <Link href="/manga" className="text-sm font-semibold text-white hover:text-yellow-400 transition-colors">
              Manga
            </Link>
            <Link href="/new-releases" className="text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition-colors">
              New Releases
            </Link>
            <Link href="/bestsellers" className="text-sm font-semibold text-white hover:text-yellow-400 transition-colors">
              Bestsellers
            </Link>
            <Link href="/deals" className="text-sm font-semibold text-white hover:text-yellow-400 transition-colors">
              Today&apos;s Deals
            </Link>
            <Link href="/subscriptions" className="text-sm font-semibold text-white hover:text-yellow-400 transition-colors">
              Subscribe & Save
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
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-3 rounded-lg"
                >
                  <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
              <Link href="/comics" className="block py-2 text-sm font-semibold text-white hover:text-yellow-400">
                📚 Comic Books
              </Link>
              <Link href="/graphic-novels" className="block py-2 text-sm font-semibold text-white hover:text-yellow-400">
                📖 Graphic Novels
              </Link>
              <Link href="/manga" className="block py-2 text-sm font-semibold text-white hover:text-yellow-400">
                🎌 Manga
              </Link>
              <Link href="/new-releases" className="block py-2 text-sm font-semibold text-yellow-400">
                ⭐ New Releases
              </Link>
              <Link href="/account" className="block py-2 text-sm font-semibold text-white hover:text-yellow-400">
                👤 Account
              </Link>
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
    </>
  );
}
