"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/use-auth";

/** Matches navbar/footer bolt icon mark (viewBox 0 0 448 512). */
const BOLT_PATH =
  "M338.8-9.9c11.9 8.6 16.3 24.2 10.9 37.8L271.3 224 416 224c13.5 0 25.5 8.4 30.1 21.1s.7 26.9-9.6 35.5l-288 240c-11.3 9.4-27.4 9.9-39.3 1.3s-16.3-24.2-10.9-37.8L176.7 288 32 288c-13.5 0-25.5-8.4-30.1-21.1s-.7-26.9 9.6-35.5l288-240c11.3-9.4 27.4-9.9 39.3-1.3z";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout, isLoaded } = useAuth();
  const displayName = user?.name?.trim() ?? "";

  // Redirect unauthenticated users to login (preserve target via `redirect` param)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isLoaded && !user) {
      const target = pathname || "/admin";
      router.push(`/login?redirect=${encodeURIComponent(target)}`);
    }
  }, [isLoaded, user, pathname, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

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
    {
      name: "Characters",
      href: "/admin/characters",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      name: "Design inquiries",
      href: "/admin/design-inquiries",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  // while auth state is resolving or redirecting, show a simple loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">Redirecting to login...</div>
    );
  }

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-br from-gray-900 to-gray-800 border-b border-gray-800 w-full">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 max-w-full overflow-x-hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white hover:text-brand transition-colors lg:hidden cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link
              href="/admin"
              className="group inline-flex items-center gap-3 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              aria-label="TagComics admin home"
            >
              <span className="inline-flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-xl border border-[rgba(88,232,193,0.28)] bg-black/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:border-[rgba(88,232,193,0.6)] group-hover:bg-[rgba(88,232,193,0.08)] group-hover:shadow-[0_0_24px_rgba(88,232,193,0.3)]">
                <svg
                  viewBox="0 0 448 512"
                  className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(88,232,193,0.7)]"
                  fill="rgb(88,232,193)"
                  aria-hidden
                >
                  <path d={BOLT_PATH} />
                </svg>
              </span>
              <span className="text-3xl font-black tracking-tight">
                <span className="text-white">Tag</span>
                <span className="text-brand">Comics</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-3 pr-3 sm:pr-4 border-r border-gray-700">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-2 ring-brand/50 flex-shrink-0 bg-gray-700">
                <Image
                  src="/admin.png"
                  alt={user?.name ?? "User"}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              {displayName ? (
                <>
                  <div className="hidden sm:block">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Welcome back</p>
                    <p className="text-sm font-bold text-white truncate max-w-[120px]">Hi, {displayName}</p>
                  </div>
                  <div className="sm:hidden">
                    <p className="text-sm font-bold text-brand">Hi, {displayName.split(" ")[0]}</p>
                  </div>
                </>
              ) : null}
            </div>
            {/* <Link
              href="/"
              className="text-sm text-gray-400 hover:text-brand transition-colors flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Back to Site</span>
            </Link> */}
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? "bg-brand text-brand-foreground font-bold"
                        : "text-gray-300 hover:bg-gray-800 hover:text-brand"
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
              onClick={handleLogout}
              className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all duration-200 font-bold text-base cursor-pointer"
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
            className="fixed inset-0 bg-black/50 z-20 lg:hidden cursor-pointer"
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

