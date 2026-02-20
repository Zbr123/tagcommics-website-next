"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/hooks/use-auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const displayName = user?.name?.trim() || "Admin";

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      name: "Customers",
      href: "/admin/customers",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-br from-gray-900 to-gray-800 border-b border-gray-800 w-full">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 max-w-full overflow-x-hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white hover:text-yellow-400 transition-colors lg:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/admin" className="flex items-center gap-2 group">
              <img
                src="/logo-comics.png"
                alt="Tag Comics Logo"
                className="h-12 w-32 sm:h-14 sm:w-40 object-cover drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-3 pr-3 sm:pr-4 border-r border-gray-700">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-2 ring-yellow-400/50 flex-shrink-0 bg-gray-700">
                <Image
                  src="/admin.png"
                  alt="Admin"
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Welcome back</p>
                <p className="text-sm font-bold text-white truncate max-w-[120px]">Hi, {displayName}</p>
              </div>
              <div className="sm:hidden">
                <p className="text-sm font-bold text-yellow-400">Hi, {displayName.split(" ")[0]}</p>
              </div>
            </div>
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Back to Site</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-br from-gray-900 to-gray-800 border-r border-gray-800 transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col`}
          style={{ top: "73px" }}
        >
          <div className="flex-1 min-h-0 overflow-y-auto py-6 sidebar-scrollbar">
            <nav className="space-y-1 px-3">
              {menuItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-yellow-400 text-black font-bold"
                        : "text-gray-300 hover:bg-gray-800 hover:text-yellow-400"
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-semibold">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          {/* Logout at bottom of sidebar */}
          <div className="flex-shrink-0 border-t border-gray-800 p-4 pt-5">
            <button
              type="button"
              onClick={() => logout()}
              className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all duration-200 font-bold text-base"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            style={{ top: "73px" }}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:ml-64 overflow-x-hidden pt-[73px]">
          <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">{children}</div>
        </main>
      </div>
    </div>
  );
}

